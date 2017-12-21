"use strict";

import {MsgInterface} from "msg-interface";
import {encodeBoolean} from "./msg-boolean";
import {encodeNumber} from "./msg-number";
import {encodeObject} from "./msg-object";
import {encodeString} from "./msg-string";

export function encode(value: any): Buffer {
    const msg = encodeMsgpack(value);
    if (!msg) return;
    return msg.toMsgpack();
}

/**
 * @private
 */

const typeMap = {
    boolean: encodeBoolean,
    number: encodeNumber,
    object: encodeObject,
    string: encodeString,
};

export function encodeMsgpack(value: any): MsgInterface {
    const type = typeof value;
    const f = typeMap[type];
    if (!f) return;
    return f(value);
}
