"use strict";

import {isMsg, Msg, MsgInterface} from "msg-interface";
import {MsgUInt64, MsgInt64} from "msg-int64";

const UINT16_NEXT = 0x10000;
const UINT32_NEXT = 0x100000000;
const undef = void 0;

/**
 *
 */

abstract class MsgValue extends Msg {
    constructor(value?: any) {
        super();
        this.value = value;
    }

    valueOf() {
        return this.value;
    }

    value: any;
}

((P) => {
    P.value = undef;
})(MsgValue.prototype);

export class Msgpack {
    static from(value: any): MsgInterface {
        const type = typeof value;
        const f = typeMap[type];
        if (f) return f(value);
    }
}

const typeMap = {
    number: fromNumber,
    boolean: fromBoolean,
    string: fromString,
    object: fromObject,
};

function fromObject(value: object) {
    if (value == null) {
        return new MsgNil();
    }

    if (isMsg(value)) {
        return value;
    }

    if (Array.isArray(value)) {
        return new MsgArray(value);
    }

    if (Buffer.isBuffer(value)) {
        return new MsgBinary(value);
    }

    if (MsgInt64.isInt64BE(value)) {
        return new MsgInt64(value.toBuffer());
    }

    if (MsgUInt64.isUint64BE(value)) {
        return new MsgUInt64(value.toBuffer());
    }

    return new MsgMap(value);
}

export class MsgBinary extends MsgValue {
    constructor(value: Buffer) {
        super(value);
        const length = value.length;
        this.msgpackLength = (length < 256) ? 2 + length : (length < 65536) ? 3 + length : 5 + length;
    }

    writeMsgpackTo(buffer: Buffer, offset?: number) {
        const value = this.value;
        const length = value.length;
        if (length < 256) {
            buffer[offset++] = 0xc4;
            buffer[offset++] = length;
        } else if (length < 65536) {
            buffer[offset++] = 0xc5;
            offset = buffer.writeUInt16BE(length, offset);
        } else {
            buffer[offset++] = 0xc6;
            offset = buffer.writeUInt32BE(length, offset);
        }
        offset += value.copy(buffer, offset);
        return offset;
    }

    value: Buffer;
}

export class MsgArray extends Msg {
    constructor(value: any[]) {
        super();
        const array = this.array = [].map.call(value, (item) => Msgpack.from(item));
        this.msgpackLength = array.reduce((total: number, msg: MsgInterface) => total + msg.msgpackLength, 5);
    }

    writeMsgpackTo(buffer: Buffer, offset?: number) {
        const array = this.array;
        const length = array.length;
        let pos = offset;
        if (length < 16) {
            buffer[pos++] = 0x90 | length;
        } else if (length < 65536) {
            buffer[pos++] = 0xdc;
            pos = buffer.writeUInt16BE(length, pos);
        } else {
            buffer[pos++] = 0xdd;
            pos = buffer.writeUInt32BE(length, pos);
        }
        return array.reduce((pos, msg) => pos + msg.writeMsgpackTo(buffer, pos), pos) - offset;
    }

    array: MsgInterface[];
}

export class MsgMap extends Msg {
    constructor(value: object) {
        super();
        const array = this.array = [];
        Object.keys(value).forEach((key) => {
            const val = value[key];
            array.push(Msgpack.from(key), Msgpack.from(val));
        });
        this.msgpackLength = array.reduce((total: number, msg: MsgInterface) => total + msg.msgpackLength, 5);
    }

    writeMsgpackTo(buffer: Buffer, offset?: number) {
        const array = this.array;
        const length = array.length / 2;
        let pos = offset;
        if (length < 16) {
            buffer[pos++] = 0x80 | length;
        } else if (length < 65536) {
            buffer[pos++] = 0xde;
            pos = buffer.writeUInt16BE(length, pos);
        } else {
            buffer[pos++] = 0xdf;
            pos = buffer.writeUInt32BE(length, pos);
        }
        return array.reduce((pos, msg) => pos + msg.writeMsgpackTo(buffer, pos), pos) - offset;
    }

    array: MsgInterface[];
}

function fromBoolean(value: boolean) {
    return new MsgBoolean(value);
}

function fromString(value: string) {
    return new MsgString(value);
}

export class MsgNil extends MsgValue {
    writeMsgpackTo(buffer: Buffer, offset?: number) {
        buffer[offset] = 0xc0;
        return 1;
    }
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

export class MsgFixInt extends MsgValue {
    constructor(value: number) {
        super(value);
    }

    writeMsgpackTo(buffer: Buffer, offset?: number) {
        buffer[offset] = this.value & 255;
        return 1;
    }
}

export class MsgInt8 extends MsgValue {
    constructor(value: number) {
        super(value);
    }

    writeMsgpackTo(buffer: Buffer, offset?: number) {
        buffer[offset] = 0xd0;
        buffer.writeInt8(+this.value, offset + 1);
        return 2;
    }
}

export class MsgUInt8 extends MsgValue {
    constructor(value: number) {
        super(value);
    }

    writeMsgpackTo(buffer: Buffer, offset?: number) {
        buffer[offset] = 0xcc;
        buffer.writeUInt8(+this.value, offset + 1);
        return 2;
    }
}

export class MsgInt16 extends MsgValue {
    constructor(value: number) {
        super(value);
    }

    writeMsgpackTo(buffer: Buffer, offset?: number) {
        buffer[offset] = 0xd1;
        buffer.writeInt16BE(+this.value, offset + 1);
        return 3;
    }
}

export class MsgUInt16 extends MsgValue {
    constructor(value: number) {
        super(value);
    }

    writeMsgpackTo(buffer: Buffer, offset?: number) {
        buffer[offset] = 0xcd;
        buffer.writeUInt16BE(+this.value, offset + 1);
        return 3;
    }
}

export class MsgInt32 extends MsgValue {
    constructor(value: number) {
        super(value);
    }

    writeMsgpackTo(buffer: Buffer, offset?: number) {
        buffer[offset] = 0xd2;
        buffer.writeInt32BE(+this.value, offset + 1);
        return 5;
    }
}

export class MsgUInt32 extends MsgValue {
    constructor(value: number) {
        super(value);
    }

    writeMsgpackTo(buffer: Buffer, offset?: number) {
        buffer[offset] = 0xce;
        buffer.writeUInt32BE(+this.value, offset + 1);
        return 5;
    }
}

export class MsgFloat32 extends MsgValue {
    constructor(value: number) {
        super(value);
    }

    writeMsgpackTo(buffer: Buffer, offset?: number) {
        buffer[offset] = 0xca;
        buffer.writeFloatBE(+this.value, offset + 1);
        return 5;
    }
}

export class MsgFloat64 extends MsgValue {
    constructor(value: number) {
        super(value);
    }

    writeMsgpackTo(buffer: Buffer, offset?: number) {
        buffer[offset] = 0xcb;
        buffer.writeDoubleBE(+this.value, offset + 1);
        return 9;
    }
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

/**
 * constant length
 */

setMsgpackLength(MsgNil, 1);
setMsgpackLength(MsgBoolean, 1);
setMsgpackLength(MsgFixInt, 1);
setMsgpackLength(MsgInt8, 2);
setMsgpackLength(MsgUInt8, 2);
setMsgpackLength(MsgInt16, 3);
setMsgpackLength(MsgUInt16, 3);
setMsgpackLength(MsgInt32, 5);
setMsgpackLength(MsgUInt32, 5);
setMsgpackLength(MsgUInt64, 9);
setMsgpackLength(MsgInt64, 9);
setMsgpackLength(MsgFloat32, 5);
setMsgpackLength(MsgFloat64, 9);

/**
 * @private
 */

function fromNumber(value: number) {
    const isInteger = ((value | 0) === value) || (0 < value && value < UINT32_NEXT && !(value % 1));

    if (!isInteger) {
        return new MsgFloat64(value);
    } else if (-33 < value && value < 128) {
        return new MsgFixInt(value);
    } else if (value > 0) {
        if (value < 256) {
            return new MsgUInt8(value);
        } else if (value < UINT16_NEXT) {
            return new MsgUInt16(value);
        } else if (value < UINT32_NEXT) {
            return new MsgUInt32(value);
        }
    } else if (value < 0) {
        if (-129 < value) {
            return new MsgInt8(value);
        } else if (-32769 < value) {
            return new MsgInt16(value);
        } else {
            return new MsgInt32(value);
        }
    }
}

function setMsgpackLength(msgClass: Function, msgpackLength: number) {
    msgClass.prototype.msgpackLength = msgpackLength;
}
