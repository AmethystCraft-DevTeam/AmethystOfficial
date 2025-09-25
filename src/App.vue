<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, onUnmounted, ref, watch } from "vue";
import { useColorMode, useElementVisibility } from "@vueuse/core";
import { Moon, Sun } from "lucide-vue-next";
import A2BotIntercepts from "@/components/A2BotIntercepts.vue";
import BlogPage from "@/components/BlogPage.vue";


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

const initialRoute = typeof window !== "undefined" ? parseHash() : { page: "home" as const, slug: null };
const activePage = ref<"home" | "blog">(initialRoute.page);
const activePostSlug = ref<string | null>(initialRoute.slug);

function parseHash(): { page: "home" | "blog"; slug: string | null } {
  if (typeof window === "undefined") return { page: "home", slug: null };
  const rawHash = window.location.hash.replace(/^#/, "");
  if (!rawHash) return { page: "home", slug: null };

  const [segment, ...rest] = rawHash.split("/");
  const page = segment?.toLowerCase() === "blog" ? "blog" : "home";
  const slug = page === "blog" ? rest.join("/") || null : null;
  return { page, slug };
}

function syncHashFromState() {
  if (typeof window === "undefined") return;
  const { pathname, search, hash } = window.location;
  const slug = activePage.value === "blog" ? activePostSlug.value : null;
  const targetHash = activePage.value === "blog" ? (slug ? `#blog/${slug}` : "#blog") : "";
  const target = `${pathname}${search}${targetHash}`;
  const current = `${pathname}${search}${hash}`;
  if (current === target) return;
  window.history.replaceState(null, "", target);
}

function handleHashChange() {
  const { page, slug } = parseHash();
  if (page !== activePage.value) {
    activePage.value = page;
  }
  if (slug !== activePostSlug.value) {
    activePostSlug.value = slug;
  }
}

function navigateTo(page: "home" | "blog") {
  if (activePage.value === page) return;
  activePage.value = page;
}

function toggleTheme() {
  colorMode.value = isDark.value ? "light" : "dark";
}

watch(
  activePage,
  () => {
    syncHashFromState();
    scheduleIdle(() => {
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 300);
  },
  { immediate: true },
);

watch(
  activePostSlug,
  () => {
    if (activePage.value === "blog") {
      syncHashFromState();
    }
  },
);

onMounted(() => {
  scheduleIdle(() => {
    showStars.value = true;
    loadClientReviews().catch(() => undefined);
    loadCoolShimmerButton().catch(() => undefined);
  });

  if (typeof window !== "undefined") {
    window.addEventListener("hashchange", handleHashChange);
  }
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("hashchange", handleHashChange);
  }
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
  <div class="flex min-h-screen flex-col bg-white transition-colors duration-500 dark:bg-black">
    <header class="sticky top-0 z-40 flex justify-center px-6 pb-4 pt-6">
      <div
        class="relative flex w-full max-w-5xl items-center gap-6 overflow-hidden rounded-full border border-black/5 bg-white/80 px-6 py-4 shadow-[0_25px_60px_-35px_rgba(59,130,246,0.45)] backdrop-blur-2xl dark:border-white/10 dark:bg-neutral-950/80 dark:shadow-[0_25px_60px_-35px_rgba(148,163,184,0.35)]"
      >
        <div class="pointer-events-none absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-purple-500/10 dark:from-indigo-400/10 dark:to-purple-400/10"></div>
        <nav class="relative z-10 flex flex-1 items-center justify-center gap-2">
          <button
            class="relative overflow-hidden rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.4em] transition"
            :class="[
              activePage === 'home'
                ? 'bg-black text-white shadow-lg dark:bg-white dark:text-black'
                : 'text-slate-600 hover:bg-black/5 dark:text-slate-300 dark:hover:bg-white/10',
            ]"
            type="button"
            @click="navigateTo('home')"
          >
            Home
          </button>
          <button
            class="relative overflow-hidden rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.4em] transition"
            :class="[
              activePage === 'blog'
                ? 'bg-black text-white shadow-lg dark:bg-white dark:text-black'
                : 'text-slate-600 hover:bg-black/5 dark:text-slate-300 dark:hover:bg-white/10',
            ]"
            type="button"
            @click="navigateTo('blog')"
          >
            Blog
          </button>
        </nav>
        <div class="relative z-10 ml-auto flex items-center gap-3">
          <button
            class="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-white/90 text-slate-600 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:text-indigo-500 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:shadow-[0_10px_30px_rgba(15,23,42,0.5)] dark:hover:text-indigo-300"
            type="button"
            aria-label="切换主题"
            @click="toggleTheme"
          >
            <Sun v-if="isDark" class="h-5 w-5" />
            <Moon v-else class="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>

    <Transition name="page" mode="out-in">
      <main
        v-if="activePage === 'home'"
        key="home"
        class="flex flex-1 flex-col gap-24 pb-24 pt-10"
      >
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
      <main v-else key="blog" class="flex flex-1 flex-col pb-24 pt-10">
        <div class="mx-auto w-full max-w-6xl px-6">
          <BlogPage v-model:selectedSlug="activePostSlug" />
        </div>
      </main>
    </Transition>
  </div>
</template>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.45s ease, transform 0.45s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
</style>
