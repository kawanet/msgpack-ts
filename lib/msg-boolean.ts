import {MsgValue} from "./msg-value";

export class MsgBoolean extends MsgValue {
    constructor(value: boolean) {
        super(!!value);
    }

    writeMsgpackTo(buffer: Buffer, offset: number) {
        buffer[offset] = this.value ? 0xc3 : 0xc2;
        return 1;
    }
}

/**
 * constant length
 */

MsgBoolean.prototype.msgpackLength = 1;
