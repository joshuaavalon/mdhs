import { chromium, firefox } from "playwright";

import type { Browser, LaunchOptions } from "playwright";
import type { EpisodeScraperPlugin } from "@mdhs/core";

export interface BrowserPluginOptions {
  type: "chromium" | "firefox";
  launchOptions: LaunchOptions;
}

export const browserPlugin: EpisodeScraperPlugin<BrowserPluginOptions> = async (scraper, opts) => {
  const { type, launchOptions } = opts;
  scraper.on("init", async (scraper, ctx) => {
    const { logger } = scraper;
    switch (type) {
      case "chromium": {
        const defaultOpts = {
          executablePath: "/usr/bin/chromium",
          args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"]
        } satisfies LaunchOptions;
        logger.info("Launch chromium");
        ctx.browser = await chromium.launch({ ...defaultOpts, ...launchOptions });
        break;
      }
      case "firefox": {
        const defaultOpts = {
          executablePath: "/usr/bin/firefox",
          args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"]
        } satisfies LaunchOptions;
        logger.info("Launch firefox");
        ctx.browser = await firefox.launch({ ...defaultOpts, ...launchOptions });
        break;
      }
      default:
        logger.warn({ type }, "Ignore unknown browser type");
    }
  });
};

export default browserPlugin;

declare module "@mdhs/core" {
  interface EpisodeScraperContext {
    browser: Browser;
  }
}
