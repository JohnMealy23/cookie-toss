import { setIframeListener } from './iframeListener';
import { createIframeRoutes } from './createIframeRoutes';
import { IframeConfig } from '../types';

export const createIframe = ({
    dependentDomains,
    cookieConfigs = [],
}: IframeConfig) => {
    const routes = createIframeRoutes(cookieConfigs)
    setIframeListener(routes, dependentDomains);
}
