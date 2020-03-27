// This file runs each iframe injection, outputting the result to the DOM for smoke testing
import { adapters } from ".";

type AppAdapter = () => Promise<any>
type AppAdapterSpecs = [string, AppAdapter]
type AppAdapterExecutor = (appAdapterSpecs: AppAdapterSpecs) => Promise<void>

export const appAdapterExecutor: AppAdapterExecutor = async ([name, appAdapter]) => {
    const data = await appAdapter();
    const elem = document.createElement('div');
    elem.id = name;

    const h2 = document.createElement('h2');
    h2.innerText = name;

    const p = document.createElement('p');
    p.innerText = JSON.stringify(data, null, 4);

    elem.appendChild(h2);
    elem.appendChild(p);
    window.document.body.appendChild(elem);
}

Object.entries((adapters)).forEach(appAdapterExecutor)
