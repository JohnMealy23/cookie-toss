/**
 * Types to ensure only stringify-able data is passed:
 */
export type Primitive = Boolean | Number | String | void
export type PrimitiveArray = PrimitiveObject[] | Primitive[] | PrimitiveArray[]
export type PrimitiveObject = { [k: string]: Primitive | PrimitiveObject | PrimitiveArray }
export type SafeRequestData = PrimitiveObject | PrimitiveArray | Primitive | undefined
export type AppRequest = {
    key: string;
    data?: SafeRequestData
}

/**
 * The object the iframe will receive from the app's post request:
 */
export interface IframeListenerSpecs {
    origin: string;
    // `data` here will be a stringified `AppRequest` objects:
    data: string;
}

/**
 * The possible responses from the iframe:
 */
export interface IframeSuccessResponse {
    key: string;
    data: string;
}
export interface IframeErrorResponse {
    key: string;
    error: string;
}
export type IframeResponse = IframeSuccessResponse | IframeErrorResponse

/**
 * The signature of a single endpoint within the iframe.  Each endpoint
 * accepts requrests, processes them, cookies the retrieved value, and
 * relays the response outward, back to the dependent app.
 */
export type IframeRouteEndpoint = (data: SafeRequestData) => Promise<IframeResponse>;

export interface IframeRoutes {
    [endpoint: string]: IframeRouteEndpoint;
}

export type IframeListener = (specs: IframeListenerSpecs) => Promise<void>;


/**
 * An array of domains where satelite sites reside:
 */
export type DependentDomains = string[]

/**
 * The object the configures a single cookie endpoint within the iframe:
 */
export type CookieConfig = {

    /**
     * The cookie name on the hub domain where the cookie will be stored:
     */
    cookieName: string;

    /**
     * A function that resides in the iframe, and retrieves the data that
     * will be stored in the cookie on the hub domain:
     */
    dataGetter: (requestData?: SafeRequestData) => Promise<string>;

    /**
     * Optional cookie expiration settings:
     */
    expires?: number | Date

}

export type AppConfig = {

    /**
     * Domain on which the iframe will be hosted.  This is where all
     * cookies will be stored.
     */
    iframeUrl: string;

    /**
     * The cookie name on the hub domain where the cookie will be stored:
     */
    cookieName: string;

}

export type IframeConfig = {

    /**
     * An array of domains where satelite sites reside:
     */
    dependentDomains: DependentDomains;

    /**
     * The array of all cookie configurations:
     */
    cookieConfigs: CookieConfig[]

}
