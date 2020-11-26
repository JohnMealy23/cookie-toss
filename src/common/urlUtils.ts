import UrlParser from 'url-parse';
import { HostSpecs } from './types';

export const getHostnameAndPort = (origin: string): HostSpecs => {
    // If an origin was entered without protocol, prepend with one to allow for parsing
    if (!/^http/.test(origin)) {
        origin = `http://${origin}`
    }
    const { hostname, port } = new UrlParser(origin);
    return { hostname, port }
}

export const getDomainAndPath = (origin: string): string => {
    const urlParts = new UrlParser(origin)
    return `${urlParts.host}${urlParts.pathname}`
};
