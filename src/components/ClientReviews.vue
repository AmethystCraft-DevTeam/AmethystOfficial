<template>
  <section
    class="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/30 bg-background/80 px-4 py-8 shadow-lg backdrop-blur-lg dark:border-white/10 md:px-10"
  >
    <Marquee
      :pause-on-hover="true"
      :repeat="marqueeRepeat"
      class="w-full"
      :style="{ '--duration': marqueeDuration, '--gap': marqueeGap }"
    >
      <ReviewCard
        v-for="review in firstRow"
        :key="review.username"
        :img="review.img"
        :name="review.name"
        :username="review.username"
        :body="review.body"
      />
    </Marquee>

    <Marquee
      reverse
      :pause-on-hover="true"
      :repeat="marqueeRepeat"
      class="mt-6 w-full"
      :style="{ '--duration': marqueeDuration, '--gap': marqueeGap }"
    >
      <ReviewCard
        v-for="review in secondRow"
        :key="review.username"
        :img="review.img"
        :name="review.name"
        :username="review.username"
        :body="review.body"
      />
    </Marquee>

    <div
      class="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background via-background/80 to-transparent"
    ></div>
    <div
      class="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background via-background/80 to-transparent"
    ></div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import config from "@/config.json";
import { Marquee } from "@/components/ui/marquee";
import { ReviewCard } from "@/components/ui/review-card";

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
    repeat?: number;
    gap?: string;
  };
}

const reviewsConfig = config as ReviewsConfig;

const reviews = computed(() => reviewsConfig.reviews ?? []);
const half = computed(() => Math.ceil(reviews.value.length / 2));

const firstRow = computed(() => reviews.value.slice(0, half.value));
const secondRow = computed(() => reviews.value.slice(half.value));

const marqueeDuration = computed(() => reviewsConfig.reviewsMarquee?.duration ?? "20s");
const marqueeRepeat = computed(() => reviewsConfig.reviewsMarquee?.repeat ?? 3);
const marqueeGap = computed(() => reviewsConfig.reviewsMarquee?.gap ?? "1.5rem");
</script>
