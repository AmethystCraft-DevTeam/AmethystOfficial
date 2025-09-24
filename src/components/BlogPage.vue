<template>
  <div class="flex w-full flex-col gap-16">
    <section class="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border border-black/5 bg-white/80 px-6 py-20 text-center shadow-2xl dark:border-white/10 dark:bg-neutral-950/80">
      <LiquidBackground class="pointer-events-none absolute inset-0 opacity-25" />
      <div class="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white via-white/60 to-transparent dark:from-black dark:via-black/60"></div>
      <div class="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/60 to-transparent dark:from-black dark:via-black/60"></div>
      <div class="relative z-10 flex max-w-3xl flex-col items-center gap-5">
        <span class="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
          Blog Page
        </span>
        <h2 class="text-balance text-4xl font-semibold text-slate-900 md:text-5xl dark:text-white">
          Insights from the Amethyst Collective
        </h2>
        <p class="text-pretty text-base text-slate-600 md:text-lg dark:text-slate-300">
          深入了解我们的研究记录、架构反思与灵感速记。每一篇文章都由 InspiraUI 承载，带来沉浸式的阅读体验。
        </p>
      </div>
    </section>

    <section class="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6">
      <div
        v-if="posts.length"
        class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]"
      >
        <div class="flex max-h-[600px] flex-col gap-5 overflow-y-auto pr-1">
          <CardSpotlight
            v-for="post in posts"
            :key="post.slug"
            :class="[
              'flex cursor-pointer flex-col gap-4 rounded-3xl border border-transparent bg-white/70 transition duration-300 hover:-translate-y-1 hover:border-black/10 dark:bg-white/10 dark:hover:border-white/20',
              selectedSlug === post.slug
                ? 'shadow-[0_25px_60px_-30px_rgba(59,130,246,0.55)] dark:shadow-[0_25px_60px_-30px_rgba(125,211,252,0.45)]'
                : 'shadow-[0_8px_30px_rgba(15,23,42,0.07)] dark:shadow-[0_8px_30px_rgba(15,23,42,0.45)]',
            ]"
            slot-class="flex h-full flex-col gap-5 p-6 text-left"
            :gradient-color="isDark ? '#6366F1' : '#8B5CF6'"
            :gradient-opacity="selectedSlug === post.slug ? 0.95 : 0.75"
            @click="selectPost(post.slug)"
          >
            <header class="flex flex-col gap-2">
              <div class="flex items-center justify-between gap-3">
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
                  {{ post.title }}
                </h3>
                <span class="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                  {{ formatDate(post.publishedAt) }}
                </span>
              </div>
              <p class="text-sm text-slate-600 dark:text-slate-300">
                {{ post.excerpt }}
              </p>
            </header>
            <footer class="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
              <span>{{ estimateReadingTime(post.content) }}</span>
              <span :class="selectedSlug === post.slug ? 'text-indigo-500 dark:text-indigo-300' : ''">
                {{ selectedSlug === post.slug ? '当前阅读' : '开始阅读' }}
              </span>
            </footer>
          </CardSpotlight>
        </div>

        <Transition name="fade">
          <div
            v-if="selectedPost"
            key="detail"
            class="relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-black/5 bg-white/90 shadow-2xl dark:border-white/10 dark:bg-neutral-950/90"
          >
            <LiquidBackground class="pointer-events-none absolute inset-0 opacity-15" />
            <div class="absolute inset-0 bg-gradient-to-br from-white/75 via-white/60 to-transparent dark:from-black/75 dark:via-black/60"></div>
            <div class="relative z-10 flex h-full flex-col gap-8 p-10">
              <header class="flex flex-col gap-3">
                <span class="text-xs uppercase tracking-[0.4em] text-indigo-500 dark:text-indigo-300">
                  {{ formatDate(selectedPost.publishedAt) }} · {{ estimateReadingTime(selectedPost.content) }}
                </span>
                <h3 class="text-3xl font-bold text-slate-900 dark:text-white">
                  {{ selectedPost.title }}
                </h3>
              </header>
              <article
                class="prose prose-slate max-w-none text-base leading-relaxed dark:prose-invert"
                v-html="selectedPost.html"
              ></article>
            </div>
          </div>
        </Transition>
      </div>

      <CardSpotlight
        v-else
        class="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-300/80 bg-white/70 p-10 text-center shadow-[0_8px_30px_rgba(15,23,42,0.08)] dark:border-slate-700/80 dark:bg-white/10 dark:shadow-[0_8px_35px_rgba(15,23,42,0.5)]"
        slot-class="flex flex-col items-center gap-4"
        :gradient-color="isDark ? '#4F46E5' : '#818CF8'"
        :gradient-opacity="0.85"
      >
        <span class="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">暂未发布</span>
        <h3 class="text-2xl font-semibold text-slate-900 dark:text-white">博客内容正在装载</h3>
        <p class="max-w-md text-sm text-slate-600 dark:text-slate-300">
          posts 文件夹中暂未检测到 Markdown 文章。当内容上线时，它们会自动出现在这里。
        </p>
      </CardSpotlight>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useColorMode } from "@vueuse/core";
import LiquidBackground from "@/components/LiquidBackground.vue";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { useBlogPosts } from "@/lib/posts";

const posts = useBlogPosts();
const selectedSlug = ref<string | null>(null);

watch(
  posts,
  (collection) => {
    if (!collection.length) {
      selectedSlug.value = null;
      return;
    }
    if (!collection.some((item) => item.slug === selectedSlug.value)) {
      selectedSlug.value = collection[0]?.slug ?? null;
    }
  },
  { immediate: true },
);

const selectedPost = computed(() => posts.value.find((item) => item.slug === selectedSlug.value) ?? null);

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

function selectPost(slug: string) {
  selectedSlug.value = slug;
}

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function estimateReadingTime(content: string) {
  const words = content.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 180));
  return `${minutes} min read`;
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.prose :deep(p) {
  margin-bottom: 1.1em;
}

.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3) {
  font-family: "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  margin-top: 1.6em;
  margin-bottom: 0.8em;
}

.prose :deep(a) {
  color: #6366f1;
}

.prose :deep(pre) {
  background-color: rgba(15, 23, 42, 0.9);
  color: white;
  padding: 1rem;
  border-radius: 1rem;
  overflow-x: auto;
}
</style>
