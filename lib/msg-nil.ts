import {MsgValue} from "./msg-value";

export class MsgNil extends MsgValue {
    constructor() {
        super(null);
    }

    static decode(buffer: Buffer, offset: number) {
        return new MsgNil();
    }

    static encode(value: void) {
        return new MsgNil();
    }

    writeMsgpackTo(buffer: Buffer, offset: number) {
        buffer[offset] = 0xc0;
        return 1;
    }
}

((P) => {
    P.msgpackLength = 1;
    P.value = null;
})(MsgNil.prototype);
