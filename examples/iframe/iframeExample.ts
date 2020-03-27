import { createIframe, IframeConfig } from "../../src";
import { dataGetter } from "./dataGetter";
import { exampeDependentDomain, exampleCookieName } from "../exampleConfig";

export const iframeConfig: IframeConfig = {

    // List of approved URLs, from which cookies can be requested:
    dependentDomains: [
        exampeDependentDomain,
    ],

    // List of cookie getters to be executed inside the iframe,
    // upon request from the host app:
    cookieConfigs: [
        {
            cookieName: exampleCookieName,
            dataGetter,
            expires: Infinity
        }
    ]

}

createIframe(iframeConfig)
console.log('Iframe is created!')

