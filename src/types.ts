export interface Request {
    path: string;
    data?: {
        [prop: string]: any;
    }
}
export interface Response {
    path: string;
    data?: {
        [prop: string]: any;
    };
    error?: string;
}
export type ApiEndpoint = (origin: string, data?: any) => Promise<Response>;
export interface Api {
    [endpoint: string]: ApiEndpoint;
}
export interface ReceiverSpecs {
    origin: string;
    data: string;
}
export type Receiver = (specs: ReceiverSpecs) => Promise<void>;
export interface RequestData {
    [prop: string]: any;
}
