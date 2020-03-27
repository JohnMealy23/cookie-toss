import * as pkg from './package.json'
import { whitelists } from "./src"
import { startServer } from './index'
const opn = require('opn');

const testFile = pkg.testHtml
const port = pkg.testPort

Object.entries(whitelists).forEach(([name, list]) => {
    console.log(`${list}:${port}/${testFile}`)

    startServer(port);

    opn(`${list}:${port}/${testFile}`)
})
