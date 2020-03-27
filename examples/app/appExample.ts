import { AppConfig, gimmeThatCookieGoodness } from "../../src";
import { exampleCookieName, exampeIframeUrl } from "../exampleConfig";

export const appConfig: AppConfig = {

    // The URL of the iframe living on the central domain where
    // all cookies will be stored:
    iframeUrl: exampeIframeUrl,

    // Name of cookie stored on hub site:
    cookieName: exampleCookieName,

    // Test payload:
    data: {
        reason: 'Not sure why anyone would use this',
        but: 'just in case...',
        makesItToIframe: true,
        loneliestNumber: 1
    }

}

    ; (async () => {
        // Request 1
        console.log('########## Test 1 ##########')
        console.log('Inside of satelite app.  About to send request to the iframe.')
        appConfig.resetCookie = true
        console.log('Resetting the cookie this time, to have a clean slate for testing.')
        console.log({ appConfig })
        const result1 = await gimmeThatCookieGoodness(appConfig)
        console.log('Back in the app with the data retrieved from the iframe:', { result1 })

        // Request 2
        console.log('\n########## Test 2 ##########')
        console.log('Retrieving the cookie again.  Turning off the cookieReset this time, in order to pick up the first cookieing')
        appConfig.resetCookie = false
        console.log('Note that because we don\'t hit the iframe data getter this time (due to the cookie being set), you won\'t see the logs from that part of the code.')
        console.log({ appConfig })
        const result2 = await gimmeThatCookieGoodness(appConfig)
        console.log('Back in the app with the data retrieved from the iframe.'
        console.log('Behold!  The results were consistent between calls:'), { result1, result2 })
    })()
