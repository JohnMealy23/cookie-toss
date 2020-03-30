import { createIframe, IframeConfig } from "../../src";
import { handler } from "./handler";
import { exampleCookieName } from "../exampleConfig";

export const iframeConfig: IframeConfig = {

    // List of approved URLs, from which cookies can be requested:
    dependentDomains: [
        'dependant-site.com',
    ],

    // List of cookie getters to be executed inside the iframe,
    // upon request from the host app:
    cookieConfigs: [
        {
            cookieName: exampleCookieName,
            handler,
            expires: Infinity
        }
    ]

}

createIframe(iframeConfig)
console.log('Iframe is created!')

