import {MsgValue} from "./msg-value";

const UTF8 = "utf8";

export class MsgString extends MsgValue {
    constructor(value: string) {
        super(value);

        // maximum byte length
        this.msgpackLength = 5 + value.length * 3;
    }

    writeMsgpackTo(buffer: Buffer, offset: number) {
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

    static parse(buffer: Buffer, offset: number) {
        const length = buffer[offset] & 0x1f;
        const start = offset + 1;
        const end = start + length;
        const str = buffer.toString(UTF8, start, end);
        const msg = new MsgFixString(str);
        msg.msgpackLength = end - offset;
        return msg;
    }

    writeMsgpackTo(buffer: Buffer, offset: number) {
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

    static parse(buffer: Buffer, offset: number) {
        const length = buffer.readUInt8(offset + 1);
        const start = offset + 2;
        const end = start + length;
        const str = buffer.toString(UTF8, start, end);
        const msg = new MsgString8(str);
        msg.msgpackLength = end - offset;
        return msg;
    }

    writeMsgpackTo(buffer: Buffer, offset: number) {
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

    static parse(buffer: Buffer, offset: number) {
        const length = buffer.readUInt16BE(offset + 1);
        const start = offset + 3;
        const end = start + length;
        const str = buffer.toString(UTF8, start, end);
        const msg = new MsgString16(str);
        msg.msgpackLength = end - offset;
        return msg;
    }

    writeMsgpackTo(buffer: Buffer, offset: number) {
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

    static parse(buffer: Buffer, offset: number) {
        const length = buffer.readUInt32BE(offset + 1);
        const start = offset + 5;
        const end = start + length;
        const str = buffer.toString(UTF8, start, end);
        const msg = new MsgString32(str);
        msg.msgpackLength = end - offset;
        return msg;
    }

    writeMsgpackTo(buffer: Buffer, offset: number) {
        buffer[offset] = 0xdb;
        const length = buffer.write(this.value, offset + 5);
        buffer.writeUInt32BE(length, offset + 1);
        // actual byte length
        return 5 + length;
    }
}
