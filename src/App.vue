<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref, watch } from "vue";
import { useColorMode, useElementVisibility } from "@vueuse/core";
import A2BotIntercepts from "@/components/A2BotIntercepts.vue";

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

const loadClientReviews = () => import("@/components/ClientReviews.vue");
const loadCoolShimmerButton = () => import("@/components/CoolShimmerButton.vue");
const loadFallingStarsBg = async () => {
  const module = await import("@/components/ui/bg-falling-stars");
  return module.FallingStarsBg;
};

const ClientReviews = defineAsyncComponent(loadClientReviews);
const CoolShimmerButton = defineAsyncComponent(loadCoolShimmerButton);
const FallingStarsBg = defineAsyncComponent(loadFallingStarsBg);

const showStars = ref(false);
const shouldRenderReviews = ref(false);
const shouldRenderCommunityCta = ref(false);

const reviewsSectionRef = ref<HTMLElement | null>(null);
const communitySectionRef = ref<HTMLElement | null>(null);

const reviewsInView = useElementVisibility(reviewsSectionRef, { threshold: 0.2 });
const communityInView = useElementVisibility(communitySectionRef, { threshold: 0.2 });

function scheduleIdle(cb: () => void, timeout = 1200) {
  if (typeof window === "undefined") {
    cb();
    return;
  }

  const idleWindow = window as Window & {
    requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  };

  if (idleWindow.requestIdleCallback) {
    idleWindow.requestIdleCallback(
      () => cb(),
      { timeout },
    );
  } else {
    window.setTimeout(cb, Math.min(timeout, 400));
  }
}

onMounted(() => {
  scheduleIdle(() => {
    showStars.value = true;
    loadClientReviews().catch(() => undefined);
    loadCoolShimmerButton().catch(() => undefined);
  });
});

watch(
  reviewsInView,
  (isVisible) => {
    if (isVisible) {
      shouldRenderReviews.value = true;
    }
  },
  { immediate: true },
);

watch(
  communityInView,
  (isVisible) => {
    if (isVisible) {
      shouldRenderCommunityCta.value = true;
    }
  },
  { immediate: true },
);
</script>

<template>
  <main class="flex min-h-screen w-full flex-col gap-24 bg-white dark:bg-black">
    <section
      class="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-16 text-center"
    >
      <Suspense>
        <template #default>
          <FallingStarsBg
            v-if="showStars"
            class="absolute inset-0"
            :color="isDark ? '#FFF' : '#555'"
          />
        </template>
        <template #fallback>
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.25),_transparent_65%)]"></div>
        </template>
      </Suspense>
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
          A studio dedicated to AI application deployment, Minecraft entertainment, and online networking.
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
    </section>

    <section
      ref="reviewsSectionRef"
      class="relative z-[1] mx-auto w-full max-w-6xl px-6"
    >
      <header class="mb-10 text-center">
        <p class="text-sm uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
          Security Insights
        </p>
        <h2 class="mt-3 text-3xl font-semibold text-slate-900 md:text-4xl dark:text-white">
          A2Bot Interception Overview
        </h2>
      </header>
      <A2BotIntercepts />
    </section>

    <section class="relative z-[1] mx-auto w-full max-w-6xl px-6">
      <header class="mb-10 text-center">
        <p class="text-sm uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
          Voices from the Multiverse
        </p>
        <h2 class="mt-3 text-3xl font-semibold text-slate-900 md:text-4xl dark:text-white">
          Trusted by creators, engineers, and adventurers alike
        </h2>
      </header>
      <Suspense v-if="shouldRenderReviews">
        <template #default>
          <ClientReviews />
        </template>
        <template #fallback>
          <div class="h-64 w-full animate-pulse rounded-3xl bg-slate-100/70 dark:bg-slate-900/50"></div>
        </template>
      </Suspense>
      <div
        v-else
        class="h-64 w-full animate-pulse rounded-3xl bg-slate-100/70 dark:bg-slate-900/50"
      ></div>
    </section>

    <section
      ref="communitySectionRef"
      class="relative z-[1] mx-auto w-full max-w-4xl px-6 pb-16"
    >
      <header class="mb-10 text-center">
        <p class="text-sm uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
          Community
        </p>
        <h2 class="mt-3 text-3xl font-semibold text-slate-900 md:text-4xl dark:text-white">
          Join our Community
        </h2>
      </header>
      <Suspense v-if="shouldRenderCommunityCta">
        <template #default>
          <CoolShimmerButton />
        </template>
        <template #fallback>
          <div class="h-24 w-full animate-pulse rounded-full bg-slate-100/70 dark:bg-slate-900/50"></div>
        </template>
      </Suspense>
      <div
        v-else
        class="h-24 w-full animate-pulse rounded-full bg-slate-100/70 dark:bg-slate-900/50"
      ></div>
    </section>
  </main>
</template>
