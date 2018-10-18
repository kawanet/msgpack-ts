/// <reference types="node" />
import { MsgInterface } from "msg-interface";
export interface MsgArrayInterface extends MsgInterface {
    add(value: MsgInterface): void;
}
declare abstract class MsgArray implements MsgArrayInterface {
    msgpackLength: number;
    protected array: MsgInterface[];
    abstract writeMsgpackTo(buffer: Buffer, offset: number): number;
    add(value: MsgInterface): void;
    valueOf(): Object[];
}
export declare class MsgFixArray extends MsgArray {
    writeMsgpackTo(buffer: Buffer, offset: number): number;
}
export declare class MsgArray16 extends MsgArray {
    writeMsgpackTo(buffer: Buffer, offset: number): number;
}
export declare class MsgArray32 extends MsgArray {
    writeMsgpackTo(buffer: Buffer, offset: number): number;
}
export {};
