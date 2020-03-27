import { setIframeListener } from './iframeListener';
import { createIframeRoutes } from './createIframeRoutes';
import { IframeConfig } from '../types';

export const createIframe = ({
    cookieConfigs,
    dependentDomains,
}: IframeConfig) => {
    const routes = createIframeRoutes(cookieConfigs)
    setIframeListener(routes, dependentDomains);
}
