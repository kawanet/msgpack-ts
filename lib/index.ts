"use strict";

import {msgToBuffer} from "msg-interface";

import {MsgValue} from "./msg-value";
import {encodeMsg} from "./encoder";

export * from "./msg-array";
export * from "./msg-binary";
export * from "./msg-boolean";
export * from "./msg-map";
export * from "./msg-nil";
export * from "./msg-number";
export * from "./msg-string";
export * from "./msg-value";

export function encode(value: any): Buffer {
    const msg = encodeMsg(value);
    return msg && msgToBuffer(msg);
}

export function decode(buffer: Buffer, offset?: number): any {
    const msg = MsgValue.parse(buffer, offset);
    if (!msg) return;
    return msg.valueOf();
}
