<template>
  <section class="flex w-full flex-col gap-10">
    <div class="flex min-h-64 flex-col items-center justify-center gap-3 text-center">
      <p class="text-sm uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
        Real-Time A2Bot Defense Snapshot
      </p>
      <div class="flex flex-wrap items-end justify-center gap-4">
        <p class="whitespace-pre-wrap text-7xl font-semibold tracking-tight text-black dark:text-white">
          <NumberTicker :value="interceptedTotal" :decimal-places="0" />
        </p>
        <span class="mb-2 text-xl text-slate-600 dark:text-slate-300">Blocked high-risk sessions</span>
      </div>
      <div class="flex flex-wrap items-center justify-center gap-3 text-sm">
        <span class="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          Processed
          <NumberTicker :value="processedTotal" :decimal-places="0" class="text-base font-semibold" />
        </span>
        <span class="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          Pending review
          <NumberTicker :value="pendingTotal" :decimal-places="0" class="text-base font-semibold" />
        </span>
      </div>
      <p class="max-w-xl text-balance text-base text-slate-600 dark:text-slate-300">
        Analytics sourced from recent A2Bot interception logs. Sample data only while the live feed is wired up.
      </p>
      <p
        v-if="fetchError"
        class="text-xs text-red-500 dark:text-red-400"
      >
        Unable to reach the stats API right now; showing placeholder numbers.
      </p>
    </div>

    <div class="flex w-full flex-col gap-4 lg:h-[250px] lg:flex-row">
      <CardSpotlight
        v-for="card in statCards"
        :key="card.id"
        class="flex-1 cursor-pointer flex-col items-start justify-between gap-6 whitespace-pre-wrap text-left text-lg shadow-2xl"
        :gradient-color="isDark ? '#363636' : '#C9C9C9'"
        :slot-class="'flex h-full w-full flex-col justify-between p-6'"
        :gradient-opacity="0.9"
      >
        <header class="flex flex-col gap-2 text-left">
          <span class="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">{{ card.label }}</span>
          <p class="text-4xl font-semibold text-black dark:text-white">
            <NumberTicker :value="card.value" :decimal-places="0" />
          </p>
        </header>
        <p class="text-sm text-slate-600 dark:text-slate-300">
          {{ card.description }}
        </p>
        <footer class="text-xs uppercase tracking-[0.2em] text-slate-400">
          Updated {{ lastUpdatedLabel }}
        </footer>
      </CardSpotlight>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useColorMode } from "@vueuse/core";
import { NumberTicker } from "@/components/ui/number-ticker";
import { CardSpotlight } from "@/components/ui/card-spotlight";
const interceptedTotal = ref(128);
const processedTotal = ref(680);
const pendingTotal = ref(42);
const fetchError = ref(false);
const lastUpdated = ref<Date | null>(null);

const statsApiUrl = "https://open.amethyst.ltd/bot/groupchk/stats" as const;

async function fetchStats() {
  try {
    fetchError.value = false;
    const response = await fetch(statsApiUrl);
    if (!response.ok) {
      throw new Error(`Stats request failed with ${response.status}`);
    }

    const payload: Partial<{ intercepted: number; processed: number; pending: number }> =
      await response.json();

    if (typeof payload.intercepted === "number") {
      interceptedTotal.value = payload.intercepted;
    }
    if (typeof payload.processed === "number") {
      processedTotal.value = payload.processed;
    }
    if (typeof payload.pending === "number") {
      pendingTotal.value = payload.pending;
    }

    lastUpdated.value = new Date();
  } catch (error) {
    fetchError.value = true;
    console.error("Failed to load A2Bot stats", error);
  }
}

onMounted(fetchStats);

const lastUpdatedLabel = computed(() => {
  if (!lastUpdated.value) return "just now";
  return lastUpdated.value.toLocaleTimeString();
});

const statCards = computed(() => [
  {
    id: "intercepted",
    label: "Intercepted",
    value: interceptedTotal.value,
    description: "Unique malicious sessions actively blocked to protect your user groups.",
  },
  {
    id: "processed",
    label: "Processed",
    value: processedTotal.value,
    description: "Total inbound requests analyzed by A2Bot risk engines in this period.",
  },
  {
    id: "pending",
    label: "Pending",
    value: pendingTotal.value,
    description: "Sessions flagged for manual review before enforcement decisions are applied.",
  },
]);

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");
</script>

<style scoped>
strong {
  font-weight: 600;
}
</style>
