import UrlParser from 'url-parse';

export const getBaseDomain = (origin: string): string => (new UrlParser(origin)).hostname;
