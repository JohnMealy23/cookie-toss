import { IframeRoutes, RequestTypes } from '../types';
import { iframeEndpointFactory } from './endpointFactory';
import { CookieConfig } from '../types';
import { getRequestKey } from '../utils';
import { setCookie, getCookie } from './cookieGetAndSet';

/**
 * In this file, add the getter and setter routes for requests
 * incoming to the iframe.
 *
 * We also create a map of the custom endpoints the user has defined.
 *
 * When the iframe receives a request, this route map will allow
 * the iframe to route the request to the appropriate user-defined
 * or default data getter for the cookie.
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
