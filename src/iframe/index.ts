import { setIframeListener } from './iframeListener';
import { createIframeRoutes } from './createIframeRoutes';
import { IframeConfig, DependentDomainSpecs } from '../common/types';
import { getHostnameAndPort } from '../common/urlUtils';

export const createIframe = ({
    dependentDomains,
    dataConfigs = [],
}: IframeConfig) => {

    // Create routes for default and custom data getters.
    const routes = createIframeRoutes(dataConfigs)

    // Extract hostname and port from each dependent, for use in future matching.
    // Add the local domain to the access-listed domains by default.
    const dependentDomainSpecs: DependentDomainSpecs = [origin, ...dependentDomains].map(domain => getHostnameAndPort(domain))

    // Create the listener, which picks up requests, filters
    // out non-accesslisted domains, and receives data based on
    // the dataKey of the response:
    setIframeListener({ routes, dependentDomainSpecs });
}
