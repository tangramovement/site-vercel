import { readFile, writeFile } from 'node:fs/promises';

const content = JSON.parse(await readFile('content/site.json', 'utf8'));
const files = ['index.html', '404.html'];

const title = content.seo?.title?.pt || 'Tangram Movement';
const description = content.seo?.description?.pt || '';
const image = content.seo?.socialImage || '';

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function setTitle(html) {
  return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
}

function setMeta(html, attr, key, value) {
  if (!value) return html;
  const escaped = escapeHtml(value);
  const pattern = new RegExp(`(<meta\\s+${attr}=["']${key}["']\\s+content=["'])[\\s\\S]*?(["'][^>]*>)`, 'i');
  return html.replace(pattern, `$1${escaped}$2`);
}

for (const file of files) {
  let html = await readFile(file, 'utf8');
  html = setTitle(html);
  html = setMeta(html, 'name', 'description', description);
  html = setMeta(html, 'property', 'og:title', title);
  html = setMeta(html, 'property', 'og:description', description);
  html = setMeta(html, 'name', 'twitter:title', title);
  html = setMeta(html, 'name', 'twitter:description', description);
  html = setMeta(html, 'property', 'og:image', image);
  html = setMeta(html, 'name', 'twitter:image', image);
  await writeFile(file, html);
}
