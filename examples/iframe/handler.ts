import { MyAppData } from "../exampleConfig";
import { insertTag } from "../common/insertTag";

export const handler = async (dataSentFromApp: MyAppData) => {
    insertTag('Inside user-defined handler in the iframe.', 'h3')
    insertTag('Usually the iframe is invisible, but for the sake the the test we\'ll let it be seen.')
    insertTag('Data sent from the app to the iframe:')
    insertTag({ dataSentFromApp }, 'pre')
    const result = await mockRequestDataFromServer(dataSentFromApp.appId)
    insertTag('Got the value for the request, and sending it back to the app:')
    insertTag({ result }, 'pre')
    return result
}

const mockRequestDataFromServer = async (prefix: string): Promise<string> => `${prefix}:${Math.round(Math.random() * 1000000)}`
