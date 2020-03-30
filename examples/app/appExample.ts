import {
    get,
    set,
    AppConfigGetterOptions,
    AppConfigSetterOptions,
} from "../../src";
import { exampleDataKey, exampleIframeUrl, MyAppData } from "../exampleConfig";

export const appConfigForCustomGetter: AppConfigGetterOptions<MyAppData> = {

    // The URL of the iframe living on the central domain where
    // all data will be stored:
    iframeUrl: exampleIframeUrl,

    // Name of data stored on hub site:
    dataKey: exampleDataKey,

    // Test payload:
    handlerPayload: {
        reason: 'Not sure why anyone would use this',
        but: 'just in case...',
        makesItToIframe: true,
        appId: 'app-123'
    }

}


export const appConfigForSimpleSetter: AppConfigSetterOptions = {

    // The URL of the iframe living on the central domain where
    // all data will be stored:
    iframeUrl: exampleIframeUrl,

    // Name of data stored on hub site:
    dataKey: 'data-set-by-app',

    // Test payload:
    data: [{ well: 'hello there' }]

}

const insertTag = (value: string | { [x: string]: any }, type: string = 'p') => {
    if (typeof value !== 'string') {
        value = JSON.stringify(value, null, 4)
    }
    const p = document.createElement(type)
    p.innerText = value
    document.body.appendChild(p)
}

const test1 = async () => {
    insertTag('Test 1 - Get Data with Custom Getter in Iframe', 'h2')

    insertTag('Request 1', 'h3')
    insertTag('Inside of satellite app.  About to send request to the iframe.')
    appConfigForCustomGetter.resetData = true
    insertTag('Resetting the data this time, to have a clean slate for testing.')
    insertTag({ appConfigForCustomGetter }, 'pre')
    const result1 = await get(appConfigForCustomGetter)
    insertTag('Back in the app with the data retrieved from the iframe:')
    insertTag({ result1 }, 'pre')

    insertTag('Request 2', 'h3')
    insertTag('Retrieving the data again.  Turning off the dataReset this time, in order to pick up the initial data setting')
    appConfigForCustomGetter.resetData = false
    insertTag('Note that because we don\'t hit the iframe data getter this time (due to the data being set), you won\'t see the logs from that part of the code.')
    insertTag({ appConfigForCustomGetter }, 'pre')
    const result2 = await get(appConfigForCustomGetter)
    insertTag('Back in the app with the data retrieved from the iframe.')
    insertTag('Behold!  The results were consistent between calls:')
    insertTag({ result1, result2 }, 'pre')
}

const test2 = async () => {
    insertTag('Test 2 - Using simple getter and setter', 'h2')

    insertTag('Request 1', 'h3')
    insertTag('Inside of satellite app.  About to send a set request to the iframe.')
    insertTag({ appConfigForSimpleSetter }, 'pre')
    const result3 = await set(appConfigForSimpleSetter)
    insertTag('Back in the app with the data retrieved from the iframe:')
    insertTag({ result3 }, 'pre')
    insertTag('Going in with a get request, now...')

    insertTag('Request 2', 'h3')
    const result4 = await get(appConfigForSimpleSetter)
    insertTag('Behold!  The results were consistent between calls:')
    insertTag({ result3, result4 }, 'pre')
}

(async () => {
    await test1()
    await test2()
})()
