<script setup lang="ts">
import { computed } from "vue";
import { useColorMode } from "@vueuse/core";
import { FallingStarsBg } from "@/components/ui/bg-falling-stars";

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");
</script>

<template>
  <div
    class="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-white px-6 py-16 text-center dark:bg-black"
  >
    <FallingStarsBg
      class="absolute inset-0"
      :color="isDark ? '#FFF' : '#555'"
    />
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.35),_transparent_55%)]"
    ></div>
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white via-white/70 to-transparent dark:from-black dark:via-black/70"
    ></div>
    <div
      class="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-white via-white/70 to-transparent dark:from-black dark:via-black/70"
    ></div>
    <div class="relative z-[1] flex max-w-3xl flex-col items-center gap-6">
      <span class="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
        AI · Minecraft · Online Networks
      </span>
      <h1 class="text-balance text-5xl font-bold leading-tight text-black md:text-6xl dark:text-white">
        Amethyst
      </h1>
      <p class="text-pretty text-lg text-slate-600 md:text-xl dark:text-slate-300">
        We build real-world AI applications, craft unforgettable Minecraft experiences,
        and weave the connectivity that keeps every world in sync.
      </p>
      <div class="flex flex-col items-center gap-3 sm:flex-row">
        <a
          class="rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition duration-300 hover:bg-slate-900 dark:bg-white dark:text-black dark:hover:bg-slate-200"
          href="#"
        >
          Join the Collective
        </a>
        <a
          class="rounded-full border border-black/10 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-black transition duration-300 hover:border-black/40 hover:bg-black/5 dark:border-white/20 dark:text-white dark:hover:border-white/40 dark:hover:bg-white/10"
          href="#"
        >
          Explore Our Worlds
        </a>
      </div>
    </div>
  </div>
</template>
