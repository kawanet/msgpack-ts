import {MsgValue} from "./msg-value";
import {MsgInterface} from "msg-interface";

export function encodeBoolean(value: boolean): MsgInterface {
    return new MsgBoolean(value);
}

export class MsgBoolean extends MsgValue {
    constructor(value: boolean) {
        super(value);
    }

    writeMsgpackTo(buffer: Buffer, offset?: number) {
        buffer[offset] = this.value ? 0xc3 : 0xc2;
        return 1;
    }
}

MsgBoolean.prototype.msgpackLength = 1;
