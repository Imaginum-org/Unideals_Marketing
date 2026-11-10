import type { MetadataRoute } from "next";

// Search engines AND AI assistants (ChatGPT, Claude, Perplexity, Gemini,
// Apple, Bing Copilot…) are welcome to crawl the public site so Unideals
// shows up in their answers. Only internal endpoints are off-limits.
const AI_AND_SEARCH_BOTS = [
  "Googlebot",
  "Bingbot",
  "DuckDuckBot",
  "Applebot",
  "Applebot-Extended",
  "Google-Extended",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "CCBot",
  "Amazonbot",
  "meta-externalagent",
  "YouBot",
];
const PRIVATE = ["/api/", "/email-preview"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: AI_AND_SEARCH_BOTS, allow: "/", disallow: PRIVATE },
      { userAgent: "*", allow: "/", disallow: PRIVATE },
    ],
    sitemap: "https://www.unideals.in/sitemap.xml",
    host: "https://www.unideals.in",
  };
}
