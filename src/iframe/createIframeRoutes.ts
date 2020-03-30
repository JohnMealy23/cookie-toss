import { IframeRoutes } from '../types';
import { iframeEndpointFactory } from './endpointFactory';
import { CookieConfig } from '../types';
import { REQUEST_TYPE_GET, REQUEST_TYPE_SET } from '../constants';
import { getData } from './getData';
import { setData } from './setData';

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
    [REQUEST_TYPE_GET]: getData,
    [REQUEST_TYPE_SET]: setData
}

export const createIframeRoutes = (
    cookieConfigs: CookieConfig[],
): IframeRoutes => cookieConfigs
    .reduce((routes: IframeRoutes, cookieConfig) => {
        const { cookieName } = cookieConfig
        if (routes[cookieName]) {
            throw new Error(`Multiple modules are attempting to define the ${cookieName} cookie.  Please ensure the getter for this is set once per implementation.`)
        }
        routes[cookieName] = iframeEndpointFactory(cookieConfig)
        return routes
    }, routes)
