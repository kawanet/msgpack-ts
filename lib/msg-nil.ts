import {MsgValue} from "./msg-value";

export class MsgNil extends MsgValue {
    constructor() {
        super(null);
    }

    writeMsgpackTo(buffer: Buffer, offset: number) {
        buffer[offset] = 0xc0;
        return 1;
    }
}

/**
 * constant length
 */

MsgNil.prototype.msgpackLength = 1;
