"use strict";

import {encodeMsgpack} from "./encode";
import {decodeMsgpack} from "./decode";

exportAll(require("./msg-array"));
exportAll(require("./msg-binary"));
exportAll(require("./msg-boolean"));
exportAll(require("./msg-map"));
exportAll(require("./msg-nil"));
exportAll(require("./msg-number"));
exportAll(require("./msg-string"));
exportAll(require("./msg-value"));

function exportAll(obj) {
    for (const key in obj) {
        exports[key] = obj[key];
    }
}

export function encode(value: any): Buffer {
    const msg = encodeMsgpack(value);
    if (!msg) return;
    return msg.toMsgpack();
}

export function decode(buffer: Buffer): any {
    const msg = decodeMsgpack(buffer);
    if (!msg) return;
    return msg.valueOf();
}
