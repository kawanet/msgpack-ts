/// <reference types="node" />
import { MsgInterface } from "msg-interface";
export declare class MsgBoolean implements MsgInterface {
    msgpackLength: number;
    protected readonly value: boolean;
    constructor(value: boolean);
    valueOf(): boolean;
    writeMsgpackTo(buffer: Buffer, offset: number): number;
}
