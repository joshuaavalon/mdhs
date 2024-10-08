import { LoggableError } from "#error";

import type { EpisodeScraperContext, EpisodeScraperEpisodeContext, EpisodeScraperPlugin } from "#episode";
import type { ScrapedEpisode } from "#schema";


type KeyOfType<T, V> = keyof {
  [P in keyof T as T[P] extends V ? P : never]: any
};

export interface ValidationPluginOptions {
}

function validateNotEmpty<T extends KeyOfType<ScrapedEpisode, string>>(key: T): (ctx: EpisodeScraperContext, epCtx: EpisodeScraperEpisodeContext) => void {
  return (_ctx, epCtx) => {
    const { result } = epCtx;
    if (!result[key]) {
      throw new LoggableError({ result }, `${key} is empty`);
    }
  };
}

export const validationPlugin: EpisodeScraperPlugin<ValidationPluginOptions> = async scraper => {
  scraper.on("postScrapeName", validateNotEmpty("name"));
  scraper.on("postScrapeSortName", validateNotEmpty("sortName"));
  scraper.on("postScrapeTvSeason", validateNotEmpty("tvSeason"));
  scraper.on("postScrapeLanguage", validateNotEmpty("language"));
  scraper.on("postScrapeCountry", validateNotEmpty("country"));
  scraper.on("postScrapeAirDate", (_ctx, epCtx) => {
    const { airDate } = epCtx.result;
    if (!airDate) {
      return;
    }
    if (!airDate.isValid) {
      throw new LoggableError({ }, airDate.invalidReason ?? "Invalid airDate");
    }
  });
};

