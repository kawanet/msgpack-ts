/// <reference types="node" />
export * from "./msg-array";
export * from "./msg-binary";
export * from "./msg-boolean";
export * from "./msg-map";
export * from "./msg-nil";
export * from "./msg-number";
export * from "./msg-string";
export declare function encode(value: any): Buffer;
export declare function decode(buffer: Buffer, offset?: number): any;
