export const insertTag = (value: string | { [x: string]: any }, type: string = 'p') => {
    if (typeof value !== 'string') {
        value = JSON.stringify(value, null, 4)
    }
    const p = document.createElement(type)
    p.innerText = value
    document.body.appendChild(p)
}
