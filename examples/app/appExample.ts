import { AppConfig, gimmeThatCookieGoodness } from "../../src";
import { exampleCookieName, exampeIframeUrl } from "../exampleConfig";

export const appConfig: AppConfig = {

    // Replace this with the URL at which the iframe should live.
    // This should sit on the central domain, where all cookies will
    // be stored:
    iframeUrl: exampeIframeUrl,

    // Name of cookie stored on hub site:
    cookieName: exampleCookieName

}

;(async () => {
    const result = await gimmeThatCookieGoodness(appConfig)
    console.log({ result })
})
