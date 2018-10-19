/// <reference types="node" />
import { MsgInterface } from "msg-interface";
interface MsgStringInterface extends MsgInterface {
    valueOf(): string;
}
export declare class MsgString implements MsgStringInterface {
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
export declare class MsgStringBuffer implements MsgStringInterface {
    protected buffer: Buffer;
    protected offset: number;
    protected skip: number;
    msgpackLength: number;
    constructor(buffer: Buffer, offset: number, skip: number, size: number);
    valueOf(): string;
    writeMsgpackTo(buffer: Buffer, offset: number): number;
}
export {};
