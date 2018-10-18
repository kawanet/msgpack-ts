/// <reference types="node" />
import { MsgInterface } from "msg-interface";
export declare class MsgString implements MsgInterface {
    msgpackLength: number;
    protected value: string;
    constructor(value: string);
    valueOf(): string;
    writeMsgpackTo(buffer: Buffer, offset: number): number;
}
export declare class MsgFixString extends MsgString {
    writeMsgpackTo(buffer: Buffer, offset: number): number;
}
export declare class MsgString8 extends MsgString {
    writeMsgpackTo(buffer: Buffer, offset: number): number;
}
export declare class MsgString16 extends MsgString {
    writeMsgpackTo(buffer: Buffer, offset: number): number;
}
export declare class MsgString32 extends MsgString {
    writeMsgpackTo(buffer: Buffer, offset: number): number;
}
