import pkg from './package.json'
import opn from 'opn'
import { whitelistExample } from "./modules";
import { port } from './index'

const testFile = pkg.testFile

opn(`${whitelistExample}:${port}/${testFile}`);
