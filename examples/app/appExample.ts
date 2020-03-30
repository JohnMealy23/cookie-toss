import {
    get,
    set,
    AppConfigGetterOptions,
    AppConfigSetterOptions,
} from "../../lib";
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

const test1 = async () => {
    // Request 1
    console.log('########## Test 1 - Get Data with Custom Getter in Iframe ##########')
    console.log('Inside of satellite app.  About to send request to the iframe.')
    appConfigForCustomGetter.resetData = true
    console.log('Resetting the data this time, to have a clean slate for testing.')
    console.log({ appConfigForCustomGetter })
    const result1 = await get(appConfigForCustomGetter)
    console.log('Back in the app with the data retrieved from the iframe:', { result1 })

    // Request 2
    console.log('Retrieving the data again.  Turning off the dataReset this time, in order to pick up the initial data setting')
    appConfigForCustomGetter.resetData = false
    console.log('Note that because we don\'t hit the iframe data getter this time (due to the data being set), you won\'t see the logs from that part of the code.')
    console.log({ appConfigForCustomGetter })
    const result2 = await get(appConfigForCustomGetter)
    console.log('Back in the app with the data retrieved from the iframe.')
    console.log('Behold!  The results were consistent between calls:', { result1, result2 })
}

const test2 = async () => {
    console.log('\n########## Test 2 - Using simple getter and setter ##########')
    // Request 1
    console.log('Inside of satellite app.  About to send a set request to the iframe.')
    console.log({ appConfigForSimpleSetter })
    const result3 = await set(appConfigForSimpleSetter)
    console.log('Back in the app with the data retrieved from the iframe:', { result3 })
    console.log('Going in with a get request, now...')
    // Request 2
    const result4 = await get(appConfigForSimpleSetter)
    console.log('Behold!  The results were consistent between calls:', { result3, result4 })
}

(async () => {
    await test1()
    await test2()
})()
