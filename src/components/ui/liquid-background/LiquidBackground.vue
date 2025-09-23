<template>
  <div
    ref="ctnDom"
    :class="cn('block h-full w-full', props?.class)"
  ></div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, nextTick, type HTMLAttributes } from "vue";
import { Renderer, Program, Mesh, Color, Triangle, type OGLRenderingContext } from "ogl";
import { cn } from "@/lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();

const ctnDom = ref<HTMLDivElement | null>(null);

let animateId: number;
let renderer: Renderer;
let gl: OGLRenderingContext;
let mesh: Mesh;

// Vertex Shader
const vert = `
  attribute vec2 uv;
  attribute vec2 position;
  
  varying vec2 vUv;
  
  void main() {
      vUv = uv;
      gl_Position = vec4(position, 0, 1);
  }
  `;

// Fragment Shader
const frag = `
  precision highp float;
  
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec3 uResolution;
  
  varying vec2 vUv;
  
  void main() {
      float mr = min(uResolution.x, uResolution.y);
      vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;
  
      float d = -uTime * 1.2;
      float a = 0.0;
      for (float i = 0.0; i < 8.0; ++i) {
          a += cos(i - d - a * uv.x);
          d += sin(uv.y * i + a);
      }
      d += uTime * 1.0;
      vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
      col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5);
      gl_FragColor = vec4(col, 1.0);
  }
  `;

function resize() {
  if (!ctnDom.value) return;
  const { clientWidth, clientHeight } = ctnDom.value;
  if (!clientWidth || !clientHeight) return;

  renderer.setSize(clientWidth, clientHeight);

  if (mesh) {
    const width = gl.canvas.width || 1;
    const height = gl.canvas.height || 1;
    mesh.program.uniforms.uResolution.value = [width, height, width / height];
  }
}

function update(t: number) {
  animateId = requestAnimationFrame(update);
  if (mesh) {
    mesh.program.uniforms.uTime.value = t * 0.001;
    renderer.render({ scene: mesh });
  }
}

onMounted(async () => {
  if (!ctnDom.value) return;

  renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2) });
  gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);

  ctnDom.value.appendChild(gl.canvas);
  await nextTick();

  const geometry = new Triangle(gl);

  const program = new Program(gl, {
    vertex: vert,
    fragment: frag,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new Color(0.3, 0.2, 0.5) },
      uResolution: {
        value: [gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height],
      },
    },
  });

  mesh = new Mesh(gl, { geometry, program });
  resize();
  window.addEventListener("resize", resize, false);
  animateId = requestAnimationFrame(update);
});

onUnmounted(() => {
  cancelAnimationFrame(animateId);
  window.removeEventListener("resize", resize);
  if (ctnDom.value && gl?.canvas) {
    ctnDom.value.removeChild(gl.canvas);
  }
  gl?.getExtension("WEBGL_lose_context")?.loseContext();
});
</script>
