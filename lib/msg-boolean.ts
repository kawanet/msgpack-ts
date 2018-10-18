import {MsgValue} from "./msg-value";

export class MsgBoolean extends MsgValue {
    constructor(value: boolean) {
        super(value);
    }

    static from(buffer: Buffer, offset?: number) {
        const lsb = buffer[0 | offset as number] & 1;
        return new MsgBoolean(!!lsb);
    }

    writeMsgpackTo(buffer: Buffer, offset: number) {
        buffer[offset] = this.value ? 0xc3 : 0xc2;
        return 1;
    }
}

((P) => {
    P.msgpackLength = 1;
})(MsgBoolean.prototype);
