/// <reference types="node" />
export { MsgFixArray, MsgArray16, MsgArray32 } from "./msg-array";
export { MsgBinary } from "./msg-binary";
export { MsgBoolean } from "./msg-boolean";
export { MsgFixMap, MsgMap16, MsgMap32 } from "./msg-map";
export { MsgNil } from "./msg-nil";
export * from "msg-number";
export { MsgString, MsgFixString, MsgString8, MsgString16, MsgString32 } from "./msg-string";
export declare function encode(value: any): Buffer;
export declare function decode(buffer: Buffer, offset?: number): any;
