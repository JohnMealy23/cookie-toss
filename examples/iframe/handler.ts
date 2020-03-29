import { MyAppData } from "../exampleConfig";

export const handler = async (dataSentFromApp: MyAppData) => {
    console.log('Inside user-defined data getter in iframe.')
    console.log('Data sent from the app to the iframe:', dataSentFromApp)
    const result = await mockRequestDataFromServer(dataSentFromApp.appId)
    console.log('Sending data back to the app:', { result })
    return result
}

const mockRequestDataFromServer = async (prefix: string): Promise<string> => `${prefix}:${Math.round(Math.random() * 1000000)}`
