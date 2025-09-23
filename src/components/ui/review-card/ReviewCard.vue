<template>
  <article
    class="flex min-w-[260px] max-w-xs flex-col gap-4 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg dark:border-white/20 dark:bg-white/5"
  >
    <header class="flex items-center gap-3">
      <img
        :src="img"
        :alt="name"
        class="h-10 w-10 rounded-full border border-white/80 object-cover dark:border-white/20"
      />
      <div class="flex flex-col">
        <span class="font-semibold text-slate-900 dark:text-slate-100">{{ name }}</span>
        <span class="text-sm text-slate-500 dark:text-slate-400">{{ username }}</span>
      </div>
    </header>
    <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
      {{ body }}
    </p>
  </article>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    img: string;
    name: string;
    username: string;
    body: string;
  }>(),
  {
    img: "https://avatar.vercel.sh/placeholder",
  },
);
</script>
