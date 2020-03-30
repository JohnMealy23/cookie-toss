import { IframeRoutes } from '../types';
import { iframeEndpointFactory } from './endpointFactory';
import { DataConfig } from '../types';
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
 * the iframe to direct the request to the appropriate user-defined
 * or default handler for the data type.
 */

const routes = {
    [REQUEST_TYPE_GET]: getData,
    [REQUEST_TYPE_SET]: setData
}

export const createIframeRoutes = (
    dataConfigs: DataConfig[],
): IframeRoutes => dataConfigs
    .reduce((routes: IframeRoutes, dataConfigs) => {
        const { dataKey } = dataConfigs
        if (routes[dataKey]) {
            throw new Error(`Multiple modules are attempting to define the ${dataKey} DataConfig.  Please ensure the configuration for this dataKey is set once per implementation.`)
        }
        routes[dataKey] = iframeEndpointFactory(dataConfigs)
        return routes
    }, routes)
