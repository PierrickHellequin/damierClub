import sanitizeHtml from "sanitize-html";

const HTML_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "strong", "em", "u", "s", "code", "pre", "blockquote",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "ul", "ol", "li",
    "a", "img", "figure", "figcaption",
    "hr", "table", "thead", "tbody", "tr", "th", "td", "span", "div",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "title"],
    "*": ["class"],
    th: ["colspan", "rowspan"],
    td: ["colspan", "rowspan"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", {
      rel: "noopener noreferrer",
      target: "_blank",
    }),
  },
};

// Renders article content authored in the BO. Content is produced by trusted
// staff (auth required) but we still sanitize to defend against a compromised
// editor session or a future migration of the editor.
export function sanitizeArticleHtml(input: string | null | undefined): string {
  if (!input) return "";

  // The BO can store either raw HTML or Editor.js JSON. If it parses as JSON
  // and looks like an Editor.js payload, render a plain-text fallback rather
  // than dumping JSON to the page.
  const trimmed = input.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === "object" && "blocks" in parsed) {
        return renderEditorJsBlocks(parsed as { blocks: EditorJsBlock[] });
      }
    } catch {
      // Not JSON — fall through to HTML sanitization.
    }
  }

  return sanitizeHtml(input, HTML_OPTIONS);
}

interface EditorJsBlock {
  type: string;
  data: Record<string, unknown>;
}

function renderEditorJsBlocks(payload: { blocks: EditorJsBlock[] }): string {
  const out: string[] = [];
  for (const block of payload.blocks ?? []) {
    switch (block.type) {
      case "paragraph": {
        const text = sanitizeHtml(String(block.data.text ?? ""), HTML_OPTIONS);
        out.push(`<p>${text}</p>`);
        break;
      }
      case "header": {
        const level = Math.min(Math.max(Number(block.data.level ?? 2), 1), 6);
        const text = sanitizeHtml(String(block.data.text ?? ""), HTML_OPTIONS);
        out.push(`<h${level}>${text}</h${level}>`);
        break;
      }
      case "list": {
        const style = block.data.style === "ordered" ? "ol" : "ul";
        const items = (block.data.items as string[] | undefined) ?? [];
        out.push(
          `<${style}>${items
            .map((i) => `<li>${sanitizeHtml(i, HTML_OPTIONS)}</li>`)
            .join("")}</${style}>`,
        );
        break;
      }
      case "quote": {
        const text = sanitizeHtml(String(block.data.text ?? ""), HTML_OPTIONS);
        const caption = sanitizeHtml(String(block.data.caption ?? ""), HTML_OPTIONS);
        out.push(
          `<blockquote>${text}${caption ? `<footer>${caption}</footer>` : ""}</blockquote>`,
        );
        break;
      }
      case "code": {
        const code = String(block.data.code ?? "");
        out.push(`<pre><code>${escapeHtml(code)}</code></pre>`);
        break;
      }
      case "delimiter": {
        out.push("<hr/>");
        break;
      }
      case "image": {
        const url =
          (block.data as { file?: { url?: string }; url?: string }).file?.url ??
          (block.data as { url?: string }).url ??
          "";
        const caption = String(block.data.caption ?? "");
        if (url) {
          const safeUrl = sanitizeHtml(`<a href="${url}">x</a>`, HTML_OPTIONS).match(/href="([^"]*)"/)?.[1];
          if (safeUrl) {
            out.push(
              `<figure><img src="${escapeAttr(safeUrl)}" alt="${escapeAttr(caption)}"/>${caption ? `<figcaption>${sanitizeHtml(caption, HTML_OPTIONS)}</figcaption>` : ""}</figure>`,
            );
          }
        }
        break;
      }
      default: {
        // Unknown block — skip rather than risk leaking raw JSON.
        break;
      }
    }
  }
  return out.join("\n");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(s: string): string {
  return escapeHtml(s).replace(/"/g, "&quot;");
}
