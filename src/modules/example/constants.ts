export type WhitelistedSites = |
    'dependant-site.com';
    
export const whitelist = [
    // Adding 'dependant-site.com' to your etc/host file will allow you to test the cross-domain sharing, locally
    'dependant-site.com',
] as const;

export const iframeUrl = 'http://source-of-truth.com:3099/iframe.html' as const;

export const paths = {
    response: '/test-data-response',
    request: '/test-data-request',
} as const;
