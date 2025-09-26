import { computed } from "vue";

export interface BlogPost {
  slug: string;
  title: string;
  publishedAt: string;
  excerpt: string;
  content: string;
  html: string;
}

const postModules = import.meta.glob("../../posts/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

const posts: BlogPost[] = Object.entries(postModules).map(([path, rawContent]) => {
  const raw = typeof rawContent === "string" ? rawContent : "";
  const normalized = raw.replace(/\r\n/g, "\n").trim();
  const fileName = path.split("/").pop() ?? "";
  const slug = fileName.replace(/\.md$/i, "");

  const titleMatch = normalized.match(/^#\s+(.+)$/m);
  const title = titleMatch?.[1]?.trim() ?? deriveTitleFromFileName(slug) ?? new Date().toISOString();

  const excerptSource = normalized
    .replace(/^#\s+.+$/m, "")
    .split(/\n{2,}/)
    .map((section) => section.replace(/\n/g, " ").trim())
    .find((section) => section.length > 0);

  const excerpt = excerptSource ?? "敬请期待更多内容。";

  const publishedAt = derivePublishedAt(fileName, normalized);
  const html = basicMarkdownToHtml(normalized);

  return {
    slug,
    title,
    excerpt,
    publishedAt,
    content: normalized,
    html,
  } satisfies BlogPost;
});

function derivePublishedAt(fileName: string, raw: string): string {
  const explicitDate = raw.match(/^date:\s*(.+)$/im)?.[1]?.trim();
  if (explicitDate) {
    const parsed = new Date(explicitDate);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  }

  const nameDate = fileName.match(/(\d{4})(?:[-_](\d{2}))?(?:[-_](\d{2}))?/);
  if (nameDate) {
    const [year, month = "01", day = "01"] = nameDate.slice(1);
    const composed = new Date(`${year}-${month}-${day}`);
    if (!Number.isNaN(composed.getTime())) {
      return composed.toISOString();
    }
  }

  return new Date().toISOString();
}

function deriveTitleFromFileName(slug: string): string | null {
  const withoutDate = slug.replace(/^(\d{4})([-_]?\d{2})?([-_]?\d{2})?[-_]?/, "");
  const segments = withoutDate
    .split(/[-_]+/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (!segments.length) {
    const cleaned = slug.replace(/[-_]+/g, " ");
    return cleaned ? cleaned : null;
  }

  return segments
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function basicMarkdownToHtml(markdown: string) {
  const codeBlocks: string[] = [];
  let processed = markdown.replace(/```([\s\S]*?)```/g, (_, code) => {
    codeBlocks.push(`<pre class="overflow-x-auto rounded-xl bg-slate-900/90 p-4 text-sm text-slate-100"><code>${escapeHtml(code.trim())}</code></pre>`);
    return `{{CODE_BLOCK_${codeBlocks.length - 1}}}`;
  });

  processed = processed
    .replace(/^###\s+(.+)$/gm, '<h3 class="text-xl font-semibold text-slate-800 dark:text-slate-100">$1</h3>')
    .replace(/^##\s+(.+)$/gm, '<h2 class="text-2xl font-semibold text-slate-900 dark:text-white">$1</h2>')
    .replace(/^#\s+(.+)$/gm, '<h1 class="text-3xl font-bold text-slate-900 dark:text-white">$1</h1>');

  processed = processed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, rawText, rawHref) => {
    const text = rawText.trim();
    const href = rawHref.trim();
    if (!href) return `[${rawText}](${rawHref})`;
    const escapedHref = escapeHtml(href);
    return `<a class="text-sky-600 underline decoration-sky-500/40 underline-offset-2 transition-colors hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300" href="${escapedHref}" target="_blank" rel="noreferrer noopener">${text}</a>`;
  });

  processed = processed
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-slate-900 dark:text-white">$1</strong>')
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em class="text-slate-700 dark:text-slate-200">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="rounded bg-slate-200 px-1 py-0.5 text-sm text-slate-800 dark:bg-slate-800 dark:text-slate-100">$1</code>');

  processed = processed.replace(/^>\s+(.+)$/gm, '<blockquote class="border-l-2 border-slate-300 pl-4 text-slate-700 italic dark:border-slate-600 dark:text-slate-200">$1</blockquote>');

  processed = processed.replace(/^(?:-\s+.+\n?)+/gm, (match) => {
    const items = match
      .trim()
      .split(/\n/)
      .map((line) => line.replace(/^-\s+/, "").trim())
      .map((line) => `<li class="ml-6 list-disc text-slate-700 dark:text-slate-300">${line}</li>`)
      .join("");
    return `<ul class="my-4 space-y-2">${items}</ul>`;
  });

  processed = processed.replace(/^(?:\d+\.\s+.+\n?)+/gm, (match) => {
    const items = match
      .trim()
      .split(/\n/)
      .map((line) => line.replace(/^\d+\.\s+/, "").trim())
      .map((line) => `<li class="ml-6 list-decimal text-slate-700 dark:text-slate-300">${line}</li>`)
      .join("");
    return `<ol class="my-4 space-y-2">${items}</ol>`;
  });

  const blockRegex = /\n{2,}/;
  processed = processed
    .split(blockRegex)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("<h") || trimmed.startsWith("<ul") || trimmed.startsWith("<ol") || trimmed.startsWith("<pre") || trimmed.startsWith("<blockquote")) {
        return trimmed;
      }
      return `<p class="text-pretty text-slate-700 dark:text-slate-300">${trimmed.replace(/\n/g, "<br>")}</p>`;
    })
    .join("\n");

  processed = processed.replace(/{{CODE_BLOCK_(\d+)}}/g, (_, index) => codeBlocks[Number(index)] ?? "");

  return processed;
}

export function useBlogPosts() {
  return computed(() =>
    posts
      .slice()
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()),
  );
}
