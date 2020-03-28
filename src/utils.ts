import UrlParser from 'url-parse';
import { REQUEST_KEY_SUFFIX, RESPONSE_KEY_SUFFIX } from './constants';

export const getBaseDomain = (origin: string): string => (new UrlParser(origin)).hostname;
export const getRequestKey = (cookieName: string) => `${cookieName}${REQUEST_KEY_SUFFIX}`
export const getResponseKey = (cookieName: string) => `${cookieName}${RESPONSE_KEY_SUFFIX}`
