import {MsgValue} from "./msg-value";

abstract class MsgNumber extends MsgValue {
    constructor(value: number) {
        super(value);
    }
}

export class MsgFixInt extends MsgNumber {
    static parse(buffer: Buffer, offset?: number) {
        let value = buffer[0 | offset as number];
        if (value > 127) value -= 256;
        return new MsgFixInt(value);
    }

    writeMsgpackTo(buffer: Buffer, offset: number) {
        buffer[offset] = this.value & 255;
        return 1;
    }
}

export class MsgInt8 extends MsgNumber {
    static parse(buffer: Buffer, offset: number) {
        return new MsgInt8(buffer.readInt8(offset + 1));
    }

    writeMsgpackTo(buffer: Buffer, offset: number) {
        buffer[offset] = 0xd0;
        buffer.writeInt8(+this.value, offset + 1);
        return 2;
    }
}

export class MsgUInt8 extends MsgNumber {
    static parse(buffer: Buffer, offset: number) {
        return new MsgUInt8(buffer.readUInt8(offset + 1));
    }

    writeMsgpackTo(buffer: Buffer, offset: number) {
        buffer[offset] = 0xcc;
        buffer.writeUInt8(+this.value, offset + 1);
        return 2;
    }
}

export class MsgInt16 extends MsgNumber {
    static parse(buffer: Buffer, offset: number) {
        return new MsgInt16(buffer.readInt16BE(offset + 1));
    }

    writeMsgpackTo(buffer: Buffer, offset: number) {
        buffer[offset] = 0xd1;
        buffer.writeInt16BE(+this.value, offset + 1);
        return 3;
    }
}

export class MsgUInt16 extends MsgNumber {
    static parse(buffer: Buffer, offset: number) {
        return new MsgUInt16(buffer.readUInt16BE(offset + 1));
    }

    writeMsgpackTo(buffer: Buffer, offset: number) {
        buffer[offset] = 0xcd;
        buffer.writeUInt16BE(+this.value, offset + 1);
        return 3;
    }
}

export class MsgInt32 extends MsgNumber {
    static parse(buffer: Buffer, offset: number) {
        return new MsgInt32(buffer.readInt32BE(offset + 1));
    }

    writeMsgpackTo(buffer: Buffer, offset: number) {
        buffer[offset] = 0xd2;
        buffer.writeInt32BE(+this.value, offset + 1);
        return 5;
    }
}

export class MsgUInt32 extends MsgNumber {
    static parse(buffer: Buffer, offset: number) {
        return new MsgUInt32(buffer.readUInt32BE(offset + 1));
    }

    writeMsgpackTo(buffer: Buffer, offset: number) {
        buffer[offset] = 0xce;
        buffer.writeUInt32BE(+this.value, offset + 1);
        return 5;
    }
}

export class MsgFloat32 extends MsgNumber {
    static parse(buffer: Buffer, offset: number) {
        return new MsgFloat32(buffer.readFloatBE(offset + 1));
    }

    writeMsgpackTo(buffer: Buffer, offset: number) {
        buffer[offset] = 0xca;
        buffer.writeFloatBE(+this.value, offset + 1);
        return 5;
    }
}

export class MsgFloat64 extends MsgNumber {
    static parse(buffer: Buffer, offset: number) {
        return new MsgFloat32(buffer.readDoubleBE(offset + 1));
    }

    writeMsgpackTo(buffer: Buffer, offset: number) {
        buffer[offset] = 0xcb;
        buffer.writeDoubleBE(+this.value, offset + 1);
        return 9;
    }
}

/**
 * constant length
 */

setMsgpackLength(MsgFixInt, 1);
setMsgpackLength(MsgInt8, 2);
setMsgpackLength(MsgUInt8, 2);
setMsgpackLength(MsgInt16, 3);
setMsgpackLength(MsgUInt16, 3);
setMsgpackLength(MsgInt32, 5);
setMsgpackLength(MsgUInt32, 5);
setMsgpackLength(MsgFloat32, 5);
setMsgpackLength(MsgFloat64, 9);

function setMsgpackLength(msgClass: Function, msgpackLength: number) {
    msgClass.prototype.msgpackLength = msgpackLength;
}
