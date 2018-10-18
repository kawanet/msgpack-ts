/// <reference types="node" />
import { MsgInterface } from "msg-interface";
declare abstract class MsgNumber implements MsgInterface {
    msgpackLength: number;
    protected value: number;
    abstract writeMsgpackTo(buffer: Buffer, offset: number): number;
    constructor(value: number);
    valueOf(): number;
}
export declare class MsgFixInt extends MsgNumber {
    writeMsgpackTo(buffer: Buffer, offset: number): number;
}
export declare class MsgInt8 extends MsgNumber {
    writeMsgpackTo(buffer: Buffer, offset: number): number;
}
export declare class MsgUInt8 extends MsgNumber {
    writeMsgpackTo(buffer: Buffer, offset: number): number;
}
export declare class MsgInt16 extends MsgNumber {
    writeMsgpackTo(buffer: Buffer, offset: number): number;
}
export declare class MsgUInt16 extends MsgNumber {
    writeMsgpackTo(buffer: Buffer, offset: number): number;
}
export declare class MsgInt32 extends MsgNumber {
    writeMsgpackTo(buffer: Buffer, offset: number): number;
}
export declare class MsgUInt32 extends MsgNumber {
    writeMsgpackTo(buffer: Buffer, offset: number): number;
}
export declare class MsgFloat32 extends MsgNumber {
    writeMsgpackTo(buffer: Buffer, offset: number): number;
}
export declare class MsgFloat64 extends MsgNumber {
    writeMsgpackTo(buffer: Buffer, offset: number): number;
}
export {};
