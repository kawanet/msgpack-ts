"use strict";

import {msgToBuffer} from "msg-interface";

import {decodeMsg} from "./decoder";
import {encodeMsg} from "./encoder";

export * from "./msg-array";
export * from "./msg-binary";
export * from "./msg-boolean";
export * from "./msg-map";
export * from "./msg-nil";
export * from "./msg-number";
export * from "./msg-string";

export function encode(value: any): Buffer {
    const msg = encodeMsg(value);
    return msg && msgToBuffer(msg);
}

export function decode(buffer: Buffer, offset?: number): any {
    const msg = decodeMsg(buffer, offset);
    return msg && msg.valueOf();
}
