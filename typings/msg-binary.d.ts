/// <reference types="node" />
import { MsgInterface } from "msg-interface";
export declare class MsgBinary implements MsgInterface {
    msgpackLength: number;
    protected value: Buffer;
    constructor(value: Buffer);
    valueOf(): Buffer;
    writeMsgpackTo(buffer: Buffer, offset: number): number;
}
