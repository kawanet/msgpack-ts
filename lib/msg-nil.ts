import {MsgInterface} from "msg-interface";

export class MsgNil implements MsgInterface {
    msgpackLength: number;

    writeMsgpackTo(buffer: Buffer, offset: number): number {
        offset |= 0;
        buffer[offset] = 0xc0;
        return 1;
    }

    valueOf(): null {
        return null;
    }
}

/**
 * constant length
 */

MsgNil.prototype.msgpackLength = 1;
