// This file is imported by the application wishing to request the Test data from the main site's cookie space.

import { iframeUrl, paths } from "./constants";
import { TestData } from './iframe';
import { getBaseDomain } from "../../utils/getBaseDomain";

type GetTestData = () => Promise<TestData>

interface ReceiveMessageSpecs {
    origin: string;
    data: string;
};
type ReceiveMessage = (specs: ReceiveMessageSpecs) => void;
export const appAdapter: GetTestData = () => new Promise((resolve) => {
    // Create and attach listener, to relay iframe response to caller
    const receiveMessage: ReceiveMessage = ({ origin, data }) => {
        try {
            const responseData = JSON.parse(data);
            const originBaseDomain = getBaseDomain(origin);
            const expectedBaseDomain = getBaseDomain(iframeUrl);
            if (
                // Ensure the caller is the main site's iframe
                originBaseDomain === expectedBaseDomain &&
                // and that the path is intended for this module
                responseData.path === paths.response
            ) {
                // Clean up:
                window.removeEventListener('message', receiveMessage);
                window.document.body.removeChild(iframe);

                // Relay the data to the caller:
                resolve(responseData.data);
            }
        } catch (e) { }
    };
    window.addEventListener('message', receiveMessage, false);

    // Create the request for Test data
    const dataRequest = {
        path: paths.request,
    };

    // Create iframe
    const iframe = document.createElement('iframe')
    iframe.src = iframeUrl;
    iframe.style.display = 'none';

    // Send the iframe the request upon load into the DOM:
    iframe.onload = () => iframe && iframe.contentWindow && iframe.contentWindow.postMessage(JSON.stringify(dataRequest), iframeUrl);

    // Inject the iframe:
    window.document.body.appendChild(iframe);
});
