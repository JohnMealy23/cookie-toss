import { SafeRequestData } from "../../src";

export const dataGetter = async (dataSentFromApp: SafeRequestData) => {
    console.log('Data sent from the app to the iframe:', dataSentFromApp)
    const data = await mockRequestDataFromServer()
    return data
}

const mockRequestDataFromServer = async (): Promise<string> => `serverResponse`
