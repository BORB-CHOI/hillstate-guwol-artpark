import { site } from "@/lib/site";

export default function sitemap() {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${site.url}/lookup`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
}
