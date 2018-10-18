/// <reference types="node" />
import { MsgInterface } from "msg-interface";
export declare class MsgNil implements MsgInterface {
    msgpackLength: number;
    writeMsgpackTo(buffer: Buffer, offset: number): number;
    valueOf(): null;
}
