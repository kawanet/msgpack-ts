import {MsgInt64, MsgUInt64} from "msg-int64";
import {isMsg, MsgInterface} from "msg-interface";
import {MsgValue} from "./msg-value";
import {MsgArray} from "./msg-array";
import {MsgMap} from "./msg-map";

export function encodeObject(value: object): MsgInterface {
    if (value == null) {
        return new MsgNil();
    }

    if (isMsg(value)) {
        return value as MsgInterface;
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

export class MsgNil extends MsgValue {
    writeMsgpackTo(buffer: Buffer, offset?: number) {
        buffer[offset] = 0xc0;
        return 1;
    }
}

MsgNil.prototype.msgpackLength = 1;

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
