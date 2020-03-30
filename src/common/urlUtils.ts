import UrlParser from 'url-parse';

export const getHostname = (origin: string): string => (new UrlParser(origin)).hostname;

export const getDomainAndPath = (origin: string): string => {
    const urlParts = new UrlParser(origin)
    return `${urlParts.host}${urlParts.pathname}`
};
