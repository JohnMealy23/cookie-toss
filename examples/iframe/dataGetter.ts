import { StringifiableRequestData } from "../../src";

export const dataGetter = async (dataSentFromApp: StringifiableRequestData) => {
    console.log('Inside user-defined data getter in iframe.')
    console.log('Data sent from the app to the iframe:', dataSentFromApp)
    const result = await mockRequestDataFromServer()
    console.log('Sending data back to the app:', { result })
    return result
}

const mockRequestDataFromServer = async (): Promise<string> => `${Math.round(Math.random() * 1000000)}`
