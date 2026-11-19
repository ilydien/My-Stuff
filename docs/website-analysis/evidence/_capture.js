async (page) => {
  // pipelined capture: scroll to trigger reveals, then full-page or segmented screenshots
  const cfg = globalThis.__capture || {};
  const out = cfg.out || '/tmp/shot';
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 800) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(110);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(900);
  if (h <= 24000) {
    await page.screenshot({ path: out + '.png', fullPage: true });
    return { mode: 'full', h };
  }
  const spots = [
    ['top', 0],
    ['mid', Math.floor(h / 2)],
    ['bottom', h - 900]
  ];
  for (const [suffix, y] of spots) {
    await page.evaluate((v) => window.scrollTo(0, v), Math.max(0, y));
    await page.waitForTimeout(700);
    await page.screenshot({ path: out + '-' + suffix + '.png' });
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  return { mode: 'segmented', h };
}
