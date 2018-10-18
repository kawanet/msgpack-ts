import {MsgInterface} from "msg-interface";

export class MsgBoolean implements MsgInterface {
    msgpackLength: number;
    protected value: boolean;

    constructor(value: boolean) {
        this.value = !!value;
    }

    valueOf(): boolean {
        return this.value;
    }

    writeMsgpackTo(buffer: Buffer, offset: number): number {
        offset |= 0;
        buffer[offset] = this.value ? 0xc3 : 0xc2;
        return 1;
    }
}

/**
 * constant length
 */

MsgBoolean.prototype.msgpackLength = 1;
