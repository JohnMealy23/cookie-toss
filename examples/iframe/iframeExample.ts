import { createIframe, IframeConfig } from "../../lib";
import { handler } from "./handler";
import { exampleDataKey } from "../exampleConfig";

export const iframeConfig: IframeConfig = {

    // List of approved URLs, from which data can be requested:
    dependentDomains: [
        'dependant-site.com',
    ],

    // List of data getters to be executed inside the iframe,
    // upon request from the host app:
    dataConfigs: [
        {
            dataKey: exampleDataKey,
            handler,
            expires: 3
        }
    ]

}

createIframe(iframeConfig)
console.log('Iframe is created!')

