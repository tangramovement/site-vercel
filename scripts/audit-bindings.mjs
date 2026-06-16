import { chromium } from 'playwright';

const url = process.argv[2] || 'http://127.0.0.1:8787/';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: 'networkidle' });

const result = await page.evaluate(async () => {
  const contentResponse = await fetch('/content/site.json', { cache: 'no-store' });
  const content = await contentResponse.json();
  window.TangramBindings.applyAll(document, content);

  const visible = (element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== 'none'
      && style.visibility !== 'hidden'
      && Number(style.opacity) !== 0
      && rect.width > 0
      && rect.height > 0;
  };

  const visibleTexts = Array.from(document.querySelectorAll('p,h1,h2,h3,h4,h5,h6,span,a,button,label,summary,option'))
    .filter((element) => visible(element) && element.children.length === 0)
    .map((element) => element.textContent.trim())
    .filter(Boolean);

  const links = Array.from(document.querySelectorAll('a[href]'))
    .filter(visible)
    .map((anchor) => ({
      text: anchor.textContent.trim(),
      href: anchor.getAttribute('href')
    }));

  const placeholders = Array.from(document.querySelectorAll('input[placeholder], textarea[placeholder]'))
    .filter(visible)
    .map((field) => field.getAttribute('placeholder'));

  const bindings = window.TangramBindings.bindings;
  const missingTargets = bindings
    .filter((binding) => binding.preview !== false)
    .map((binding) => ({
      path: binding.path,
      target: Boolean(window.TangramBindings.findTarget(document, binding.path, content, { mode: 'preview' }))
    }))
    .filter((row) => !row.target)
    .map((row) => row.path);

  return {
    bindingCount: bindings.length,
    missingTargets,
    visibleTextCount: visibleTexts.length,
    uniqueVisibleTexts: Array.from(new Set(visibleTexts)).sort(),
    links,
    placeholders
  };
});

await browser.close();

console.log(JSON.stringify(result, null, 2));
if (result.missingTargets.length) {
  process.exitCode = 1;
}
