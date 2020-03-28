import { IframeRoutes, RequestTypes } from '../types';
import { iframeEndpointFactory } from './endpointFactory';
import { CookieConfig } from '../types';
import { getRequestKey } from '../utils';
import { setCookie, getCookie } from './cookieGetAndSet';

/**
 * In this file, we create a map of which request receivers.
 * These receivers will sit inside of the iframe, waiting for calls
 * from the dependent sites.
 *
 * When the iframe receives a request, this map will allow it to route
 * it to the appropriate user-defined data getter for the cookie.
 */

const routes = {
    [RequestTypes.REQUEST_TYPE_GET]: getCookie,
    [RequestTypes.REQUEST_TYPE_SET]: setCookie,
}

export const createIframeRoutes = (
    cookieConfigs: CookieConfig[],
): IframeRoutes => cookieConfigs
    .reduce((routes: IframeRoutes, cookieConfig) => {
        const { cookieName } = cookieConfig
        const endpointKey = getRequestKey(cookieName)
        if (routes[endpointKey]) {
            throw new Error(`Multiple modules are attempting to define the ${cookieName} cookie.  Please ensure the getter for this is set once per implementation.`)
        }
        routes[endpointKey] = iframeEndpointFactory(cookieConfig)
        return routes
    }, routes)
