"use strict";

import {MsgValue} from "./msg-value";

export * from "./msg-array";
export * from "./msg-binary";
export * from "./msg-boolean";
export * from "./msg-map";
export * from "./msg-nil";
export * from "./msg-number";
export * from "./msg-string";
export * from "./msg-value";

export function encode(value: any): Buffer {
    const msg = MsgValue.fromAny(value);
    if (!msg) return;
    return msg.toMsgpack();
}

export function decode(buffer: Buffer, offset?: number): any {
    offset = +offset || 0;
    const msg = MsgValue.parse(buffer, offset);
    if (!msg) return;
    return msg.valueOf();
}
