export type RawNewsArticle = {
  id: number;
  headline?: string;
  summary?: string;
  source?: string;
  url?: string;
  datetime?: number;
  image?: string;
  category?: string;
  related?: string;
};

export type MarketNewsArticle = {
  id: number | string;
  headline: string;
  summary: string;
  source: string;
  url: string;
  datetime: number;
  image?: string;
  category?: string;
  related?: string;
};

export type UserForNewsEmail = {
  email: string;
  name?: string;
};

export type Alert = {
  alertType: "upper" | "lower";
  threshold: number;
};

export type FinnhubSearchResult = {
  symbol: string;
  description: string;
  displaySymbol?: string;
  type?: string;
};

export type FinnhubSearchResponse = {
  count: number;
  result: FinnhubSearchResult[];
};

export type StockWithWatchlistStatus = {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
  isInWatchlist: boolean;
};