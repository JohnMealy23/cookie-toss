import {
    get,
    set,
    AppConfigGetterOptions,
    AppConfigSetterOptions,
} from "../../src";
import { exampleDataKey, exampleIframeUrl, MyAppData } from "../exampleConfig";
import { insertTag } from "../common/insertTag";

export const appConfigForCustomGetter: AppConfigGetterOptions = {

    // The URL of the iframe living on the central domain where
    // all data will be stored:
    iframeUrl: exampleIframeUrl,

    // Name of data stored on hub site:
    dataKey: exampleDataKey,

    // Test payload:
    handlerPayload: {
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
    data: [
        { well: 'hello there' },
        { testValue: 5 }
    ]

}

export const configWithNoDataSet: AppConfigGetterOptions = {

    // The URL of the iframe living on the central domain where
    // all data will be stored:
    iframeUrl: exampleIframeUrl,

    // Name of data stored on hub site:
    dataKey: 'null-test',

}

const test1 = async () => {
    insertTag('Test 1 - Get Data with Custom Getter in Iframe', 'h2')

    insertTag('Request 1', 'h3')
    insertTag('Inside of satellite app.  About to send request to the iframe.')
    appConfigForCustomGetter.resetData = true
    insertTag('Resetting the data this time, to have a clean slate for testing.')
    insertTag({ appConfigForCustomGetter }, 'pre')
    const get1Result = await get(appConfigForCustomGetter)
    try {
        document.getElementsByTagName('iframe')[0].style.display = 'block'
    } catch (e) {
        console.log('Failed to make the iframe visible.')
    }
    insertTag('Back in the app with the data retrieved from the iframe:')
    insertTag({ get1Result }, 'pre')

    insertTag('Request 2', 'h3')
    insertTag('Retrieving the data again.  Turning off the dataReset this time, in order to pick up the initial data setting')
    appConfigForCustomGetter.resetData = false
    insertTag('Note that because we don\'t hit the iframe data getter this time (due to the data being set), you won\'t see the logs from that part of the code.')
    insertTag({ appConfigForCustomGetter }, 'pre')
    const get2Result = await get(appConfigForCustomGetter)
    insertTag('Back in the app with the data retrieved from the iframe.')
    insertTag('Behold!  The results were consistent between calls:')
    insertTag({ get1Result, get2Result }, 'pre')
}

const test2 = async () => {
    insertTag('Test 2 - Using simple getter and setter', 'h2')

    insertTag('Request 1', 'h3')
    insertTag('Inside of satellite app.  About to send a set request to the iframe.')
    insertTag({ appConfigForSimpleSetter }, 'pre')
    const setResult = await set(appConfigForSimpleSetter)
    insertTag('Back in the app with the data that\'s made the round-trip through the iframe:')
    insertTag({ setResult }, 'pre')

    insertTag('Request 2', 'h3')
    insertTag('Going back in, but with a get request this time...')
    const getResult = await get(appConfigForSimpleSetter)
    insertTag('Back from the iframe, and behold!  The results were consistent between calls:')
    insertTag({ setResult, getResult }, 'pre')
}

const test3 = async () => {
    insertTag('Test 3 - Retrieving Data When Not Set', 'h2')

    insertTag('Request 1', 'h3')
    insertTag('Inside of satellite app.  About to send a set request to the iframe.')
    insertTag({ configWithNoDataSet }, 'pre')
    const result = await get(configWithNoDataSet)
    insertTag('Back in the app after requesting data never set in the iframe. Should be null.')
    insertTag({ result }, 'pre')
}

(async () => {
    await test1()
    await test2()
    await test3()
})()
