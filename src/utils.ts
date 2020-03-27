import UrlParser from 'url-parse';

const REQUEST_KEY_SUFFIX = '-request'
const RESPONSE_KEY_SUFFIX = '-response'

export const getBaseDomain = (origin: string): string => (new UrlParser(origin)).hostname;
export const getRequestKey = (cookieName: string) => `${cookieName}${REQUEST_KEY_SUFFIX}`
export const getResponseKey = (cookieName: string) => `${cookieName}${RESPONSE_KEY_SUFFIX}`
