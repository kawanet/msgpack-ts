/// <reference types="node" />
import { MsgInterface } from "msg-interface";
export interface MsgMapInterface extends MsgInterface {
    set(key: MsgInterface, value: MsgInterface): void;
}
declare abstract class MsgMap implements MsgMapInterface {
    msgpackLength: number;
    protected array: MsgInterface[];
    abstract writeMsgpackTo(buffer: Buffer, offset: number): number;
    set(key: MsgInterface, value: MsgInterface): void;
    valueOf(): {
        [key: string]: any;
    };
}
export declare class MsgFixMap extends MsgMap {
    writeMsgpackTo(buffer: Buffer, offset: number): number;
}
export declare class MsgMap16 extends MsgMap {
    writeMsgpackTo(buffer: Buffer, offset: number): number;
}
export declare class MsgMap32 extends MsgMap {
    writeMsgpackTo(buffer: Buffer, offset: number): number;
}
export {};
