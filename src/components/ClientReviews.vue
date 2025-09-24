<template>
  <section
    class="relative flex w-full flex-col gap-8 overflow-hidden rounded-3xl border border-white/10 bg-background px-4 py-10 shadow-md dark:border-white/10 md:px-8"
  >
    <div class="marquee" :style="trackStyle">
      <div class="marquee__inner">
        <article
          v-for="(review, index) in firstRowLoop"
          :key="`first-${index}-${review.username}`"
          class="review-card"
        >
          <div class="review-card__header">
            <img
              :src="review.img"
              :alt="review.name"
              class="review-card__avatar"
              loading="lazy"
            />
            <div>
              <p class="review-card__name">{{ review.name }}</p>
              <p class="review-card__username">{{ review.username }}</p>
            </div>
          </div>
          <p class="review-card__body">{{ review.body }}</p>
        </article>
      </div>
    </div>

    <div class="marquee marquee--reverse" :style="trackStyle">
      <div class="marquee__inner">
        <article
          v-for="(review, index) in secondRowLoop"
          :key="`second-${index}-${review.username}`"
          class="review-card"
        >
          <div class="review-card__header">
            <img
              :src="review.img"
              :alt="review.name"
              class="review-card__avatar"
              loading="lazy"
            />
            <div>
              <p class="review-card__name">{{ review.name }}</p>
              <p class="review-card__username">{{ review.username }}</p>
            </div>
          </div>
          <p class="review-card__body">{{ review.body }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import config from "@/config.json";

interface ReviewConfig {
  name: string;
  username: string;
  body: string;
  img: string;
}

interface ReviewsConfig {
  reviews?: ReviewConfig[];
  reviewsMarquee?: {
    duration?: string;
    gap?: string;
  };
}

const reviewsConfig = config as ReviewsConfig;
const reviews = computed(() => reviewsConfig.reviews ?? []);
const half = computed(() => Math.ceil(reviews.value.length / 2));

const firstRow = computed(() => reviews.value.slice(0, half.value));
const secondRow = computed(() => reviews.value.slice(half.value));

const loopArray = (items: ReviewConfig[]) => [...items, ...items];

const firstRowLoop = computed(() => loopArray(firstRow.value));
const secondRowLoop = computed(() => loopArray(secondRow.value));

const marqueeDuration = computed(() => reviewsConfig.reviewsMarquee?.duration ?? "28s");
const marqueeGap = computed(() => reviewsConfig.reviewsMarquee?.gap ?? "2rem");

const trackStyle = computed(() => ({
  "--duration": marqueeDuration.value,
  "--gap": marqueeGap.value,
}));
</script>

<style scoped>
.marquee {
  --duration: 28s;
  --gap: 2rem;
  position: relative;
  width: 100%;
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent);
}

.marquee__inner {
  display: flex;
  gap: var(--gap);
  width: max-content;
  animation: marquee var(--duration) linear infinite;
}

.marquee--reverse .marquee__inner {
  animation-direction: reverse;
}

.review-card {
  display: flex;
  min-width: 240px;
  max-width: 320px;
  flex-direction: column;
  gap: 1rem;
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: color-mix(in srgb, var(--background) 90%, transparent);
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  color: color-mix(in srgb, var(--foreground) 88%, transparent);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  contain: layout paint;
  will-change: transform;
}

.review-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.12);
}

.review-card__header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.review-card__avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.7);
}

.review-card__name {
  font-weight: 600;
  color: color-mix(in srgb, var(--foreground) 96%, transparent);
}

.review-card__username {
  font-size: 0.85rem;
  color: color-mix(in srgb, var(--foreground) 70%, transparent);
}

.review-card__body {
  font-size: 0.95rem;
  line-height: 1.6;
  color: color-mix(in srgb, var(--foreground) 90%, transparent);
}

:global(.dark) .review-card {
  border-color: rgba(255, 255, 255, 0.16);
  background: color-mix(in srgb, var(--background) 92%, transparent);
  color: color-mix(in srgb, var(--foreground) 92%, transparent);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.4);
}

:global(.dark) .review-card__username {
  color: color-mix(in srgb, var(--foreground) 70%, transparent);
}

:global(.dark) .review-card__name {
  color: color-mix(in srgb, var(--foreground) 98%, transparent);
}

:global(.dark) .review-card__body {
  color: color-mix(in srgb, var(--foreground) 92%, transparent);
}

@keyframes marquee {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(calc(-50% - (var(--gap) * 0.5)), 0, 0);
  }
}
</style>
