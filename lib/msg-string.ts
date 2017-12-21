import {MsgValue} from "./msg-value";
import {MsgInterface} from "msg-interface";

export function encodeString(value: string): MsgInterface {
    return new MsgString(value);
}

export class MsgString extends MsgValue {
    constructor(value: string) {
        super(value);

        // maximum byte length
        this.msgpackLength = 5 + value.length * 3;
    }

    writeMsgpackTo(buffer: Buffer, offset?: number) {
        const length = this.value.length * 3;
        const expect = (length < 32) ? MsgFixString : (length < 256) ? MsgString8 : (length < 65536) ? MsgString16 : MsgString32;
        const bytes = expect.prototype.writeMsgpackTo.call(this, buffer, offset);
        const actual = (bytes < 2 + 32) ? MsgFixString : (bytes < 3 + 256) ? MsgString8 : (bytes < 5 + 65536) ? MsgString16 : MsgString32;
        if (expect === actual) return bytes;
        return actual.prototype.writeMsgpackTo.call(this, buffer, offset);
    }
}

export class MsgFixString extends MsgValue {
    constructor(value: string) {
        super(value);
        // maximum byte length
        this.msgpackLength = 1 + value.length * 3;
    }

    writeMsgpackTo(buffer: Buffer, offset?: number) {
        const length = buffer.write(this.value, offset + 1);
        buffer[offset] = 0xa0 | length;
        // actual byte length
        return 1 + length;
    }
}

export class MsgString8 extends MsgValue {
    constructor(value: string) {
        super(value);
        // maximum byte length
        this.msgpackLength = 2 + value.length * 3;
    }

    writeMsgpackTo(buffer: Buffer, offset?: number) {
        buffer[offset] = 0xd9;
        const length = buffer.write(this.value, offset + 2);
        buffer.writeUInt8(length, offset + 1);
        // actual byte length
        return 2 + length;
    }
}

export class MsgString16 extends MsgValue {
    constructor(value: string) {
        super(value);
        // maximum byte length
        this.msgpackLength = 3 + value.length * 3;
    }

    writeMsgpackTo(buffer: Buffer, offset?: number) {
        buffer[offset] = 0xda;
        const length = buffer.write(this.value, offset + 3);
        buffer.writeUInt16BE(length, offset + 1);
        // actual byte length
        return 3 + length;
    }
}

export class MsgString32 extends MsgValue {
    constructor(value: string) {
        super(value);
        // maximum byte length
        this.msgpackLength = 5 + value.length * 3;
    }

    writeMsgpackTo(buffer: Buffer, offset?: number) {
        buffer[offset] = 0xdb;
        const length = buffer.write(this.value, offset + 5);
        buffer.writeUInt32BE(length, offset + 1);
        // actual byte length
        return 5 + length;
    }
}
