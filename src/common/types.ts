/**
 * Types to ensure only stringify-able data is passed:
 */
export type Primitive = Boolean | Number | String | null | void
export type PrimitiveArray = PrimitiveObject[] | Primitive[] | Primitive[][]
export type PrimitiveObject = { [k: string]: Primitive | PrimitiveObject | PrimitiveArray }
export type StringifiableRequestData = PrimitiveObject | PrimitiveArray | Primitive

/**
 * The listener in the satellite app, awaiting the iframe's response:
 */
export interface ListenerSpecs {
    origin: string;
    data: string;
};
export type AppListener = (specs: ListenerSpecs) => void;

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
export interface IframeSuccessResponse<AppData> {
    type: RequestTypeResponse;
    dataKey: string;
    data: AppData;
}
export interface IframeErrorResponse {
    type: RequestTypeResponse;
    dataKey: string;
    error: string;
}
export type IframeResponse<AppData = StringifiableRequestData> = IframeSuccessResponse<AppData> | IframeErrorResponse

/**
 * The signature of a single endpoint within the iframe.  Each endpoint
 * accepts requests, processes them, cache the retrieved value in
 * localStorage, and relays the response outward, back to the dependent app.
 */
export type IframeRouteEndpoint = (config: AppConfig) => Promise<IframeResponse> | IframeResponse;

export interface IframeRoutes {
    [endpoint: string]: IframeRouteEndpoint;
}

export type IframeListener = (specs: IframeListenerSpecs) => Promise<void>;

/**
 * An array of domains where satellite sites reside:
 */
export type DependentDomains = string[]

/**
 * The object the configures a single data endpoint within the iframe:
 */
export type DataConfig = {

    /**
     * The localStorage key on the hub domain under which the data will be stored:
     */
    dataKey: string;

    /**
     * A function that resides in the iframe, and retrieves the data that
     * will be stored in the data on the hub domain:
     */
    handler: (requestData?: StringifiableRequestData) => Promise<StringifiableRequestData>;

    /**
     * Optional data expiration settings:
     */
    expires?: number

}

export type AppConfigBase = {

    /**
     * Domain on which the iframe will be hosted.  This is where all
     * data will be stored:
     */
    iframeUrl: string;

    /**
     * The localStorage key on the hub domain under which the data will be stored:
     */
    dataKey: string;

}

/**
 * Configuration for the app's `get` requests to the iframe, where the
 * iframe holds a `handler` for the `dataKey` of the request:
 */
export type AppConfigGetterOptions<AppData = StringifiableRequestData> = AppConfigBase & {

    /**
     * Optional.  Purges the data on the hub domain when true.
     */
    resetData?: boolean

    /**
     * Optional argument sent to the iframe handler.  Note that once
     * the data has been set on the hub domain, this argument will not
     * come into play.
     *
     * Use the `resetData` option to purge the data from the hub,
     * thus bringing the `handlerPayload` back into play.
     */
    handlerPayload?: AppData;

}

/**
 * Configuration for the app's `set` requests to the iframe
 */
export type AppConfigSetterOptions<AppData = StringifiableRequestData> = AppConfigBase & {

    /**
     * Data to be stored on iframe domain.
     */
    data: AppData

    /**
     * Optional data expiration settings:
     */
    expires?: number

}

/**
 * A value to keep track of infinite cookie life, when being stored in localStorage:
 */
export type InfinityToken = 'INFINITY_TOKEN'

/**
 * The different request types the app can make to the iframe:
 */
export type RequestTypes = RequestTypeGet | RequestTypeSet | RequestTypeResponse
export type RequestTypeGet = 'get'
export type RequestTypeSet = 'set'
export type RequestTypeResponse = 'response'

/**
 * Typing for requests headed out of the app, and into the iframe:
 */
export type AppConfig<AppData = StringifiableRequestData> = AppConfigGetterOptions<AppData> | AppConfigSetterOptions<AppData>
export type AppRequest<AppData = StringifiableRequestData> = {
    type: RequestTypes;
    config: AppConfig<AppData>;
}

/**
 * Typing for the iframe's configuration:
 */
export type IframeConfig = {

    /**
     * An array of domains where satellite sites reside:
     */
    dependentDomains: DependentDomains;

    /**
     * The array of all data configurations:
     */
    dataConfigs?: DataConfig[]

}
