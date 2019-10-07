import { Api, Receiver, RequestData } from '../types';

export const setReceiver = (api: Api) => {
    const receiveMessage: Receiver = async ({ origin, data: dataStr }) => {
        let data: RequestData;
        try {
            // If data was relayed as JSON, parse it
            data = JSON.parse(dataStr);
            const response = await api[data.path](origin, data);
            window.parent.postMessage(JSON.stringify(response), origin);
        } catch (e) {}
    };
    window.addEventListener('message', receiveMessage, false);
}
