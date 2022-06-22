import { BrowserHandler } from "./structs/BrowserHandler";
import * as utils from "./utils"
/*
 ESModule / CJS compatibility layer
*/

const toExport = { BrowserHandler, utils };
// @ts-ignore
BrowserHandler.default = toExport;

// @ts-ignore
BrowserHandler.__esModule = true;

// @ts-ignore
export = toExport;
