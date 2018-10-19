import {MsgExt} from "msg-ext";
import {MsgInterface} from "msg-interface";
import * as N from "msg-number";

import {MsgFixArray, MsgArray16, MsgArray32, MsgArrayInterface} from "./msg-array";
import {MsgBinary} from "./msg-binary";
import {MsgBoolean} from "./msg-boolean";
import {MsgFixMap, MsgMap16, MsgMap32, MsgMapInterface} from "./msg-map";
import {MsgNil} from "./msg-nil";
import {MsgStringBuffer} from "./msg-string";

type Decoder = (buffer: Buffer, offset: number) => MsgInterface;

const decoders = initDecoders();

export function decodeMsg(buffer: Buffer, offset?: number): MsgInterface {
    offset = 0 | offset as number;
    const token = buffer[offset];
    const f = decoders[token];
    return f && f(buffer, offset);
}

function initDecoders(): Decoder[] {
    const decoders: Decoder[] = new Array(256);

    decoders[0xc0] = (_buffer, _offset) => new MsgNil();
    decoders[0xc2] = (_buffer, _offset) => new MsgBoolean(false);
    decoders[0xc3] = (_buffer, _offset) => new MsgBoolean(true);

    const decodeString: Decoder = (buffer, offset) => new MsgStringBuffer(buffer, offset, 1, buffer[offset] & 0x1f);
    const decodeFixArray: Decoder = (buffer, offset) => decodeArray(new MsgFixArray(), buffer, offset, 1, buffer[offset] & 0x0f);
    const decodeFixMap: Decoder = (buffer, offset) => decodeMap(new MsgFixMap(), buffer, offset, 1, buffer[offset] & 0x0f);

    let i;
    for (i = 0x00; i < 0x80; i++) decoders[i] = decodeFixInt;
    for (i = 0x80; i < 0x90; i++) decoders[i] = decodeFixMap;
    for (i = 0x90; i < 0xa0; i++) decoders[i] = decodeFixArray;
    for (i = 0xa0; i < 0xc0; i++) decoders[i] = decodeString;

    decoders[0xc4] = (buffer, offset) => decodeBinary(buffer, offset, 2, buffer.readUInt8(offset + 1));
    decoders[0xc5] = (buffer, offset) => decodeBinary(buffer, offset, 3, buffer.readUInt16BE(offset + 1));
    decoders[0xc6] = (buffer, offset) => decodeBinary(buffer, offset, 5, buffer.readUInt32BE(offset + 1));

    decoders[0xc7] = (buffer, offset) => decodeExt(buffer, offset, 2, buffer.readUInt8(offset + 1));
    decoders[0xc8] = (buffer, offset) => decodeExt(buffer, offset, 3, buffer.readUInt16BE(offset + 1));
    decoders[0xc9] = (buffer, offset) => decodeExt(buffer, offset, 5, buffer.readUInt32BE(offset + 1));

    decoders[0xca] = (buffer, offset) => new N.MsgFloat32(buffer.readFloatBE(offset + 1));
    decoders[0xcb] = (buffer, offset) => new N.MsgFloat32(buffer.readDoubleBE(offset + 1));
    decoders[0xcc] = (buffer, offset) => new N.MsgUInt8(buffer.readUInt8(offset + 1));
    decoders[0xcd] = (buffer, offset) => new N.MsgUInt16(buffer.readUInt16BE(offset + 1));
    decoders[0xce] = (buffer, offset) => new N.MsgUInt32(buffer.readUInt32BE(offset + 1));
    decoders[0xcf] = (buffer, offset) => new N.MsgUInt64(buffer, offset + 1);
    decoders[0xd0] = (buffer, offset) => new N.MsgInt8(buffer.readInt8(offset + 1));
    decoders[0xd1] = (buffer, offset) => new N.MsgInt16(buffer.readInt16BE(offset + 1));
    decoders[0xd2] = (buffer, offset) => new N.MsgInt32(buffer.readInt32BE(offset + 1));
    decoders[0xd3] = (buffer, offset) => new N.MsgInt64(buffer, offset + 1);

    decoders[0xd4] = (buffer, offset) => decodeExt(buffer, offset, 1, 1);
    decoders[0xd5] = (buffer, offset) => decodeExt(buffer, offset, 1, 2);
    decoders[0xd6] = (buffer, offset) => decodeExt(buffer, offset, 1, 4);
    decoders[0xd7] = (buffer, offset) => decodeExt(buffer, offset, 1, 8);
    decoders[0xd8] = (buffer, offset) => decodeExt(buffer, offset, 1, 16);

    decoders[0xd9] = (buffer, offset) => new MsgStringBuffer(buffer, offset, 2, buffer.readUInt8(offset + 1));
    decoders[0xda] = (buffer, offset) => new MsgStringBuffer(buffer, offset, 3, buffer.readUInt16BE(offset + 1));
    decoders[0xdb] = (buffer, offset) => new MsgStringBuffer(buffer, offset, 5, buffer.readUInt32BE(offset + 1));

    decoders[0xdc] = (buffer, offset) => decodeArray(new MsgArray16(), buffer, offset, 3, buffer.readUInt16BE(offset + 1));
    decoders[0xdd] = (buffer, offset) => decodeArray(new MsgArray32(), buffer, offset, 5, buffer.readUInt32BE(offset + 1));

    decoders[0xde] = (buffer, offset) => decodeMap(new MsgMap16(), buffer, offset, 3, buffer.readUInt16BE(offset + 1));
    decoders[0xdf] = (buffer, offset) => decodeMap(new MsgMap32(), buffer, offset, 5, buffer.readUInt32BE(offset + 1));

    for (i = 0xe0; i < 0x100; i++) decoders[i] = decodeFixInt;

    return decoders;

    function decodeFixInt(buffer: Buffer, offset: number) {
        offset |= 0;
        let value = buffer[offset];
        if (value > 127) value -= 256;
        return new N.MsgFixInt(value);
    }
}

function decodeArray(msg: MsgArrayInterface, buffer: Buffer, offset: number, skip: number, length: number) {
    let start = offset + skip;

    for (let i = 0; i < length; i++) {
        const item = decodeMsg(buffer, start);
        start += item.msgpackLength;
        msg.add(item);
    }

    return msg;
}

function decodeMap(msg: MsgMapInterface, buffer: Buffer, offset: number, skip: number, length: number) {
    let start = offset + skip;

    for (let i = 0; i < length; i++) {
        const key = decodeMsg(buffer, start);
        start += key.msgpackLength;
        const val = decodeMsg(buffer, start);
        start += val.msgpackLength;
        msg.set(key, val);
    }

    return msg;
}

function decodeBinary(buffer: Buffer, offset: number, skip: number, length: number) {
    const start = offset + skip;
    const end = start + length;
    const payload = buffer.slice(start, end);
    const msg = new MsgBinary(payload);
    msg.msgpackLength = end - offset;
    return msg;
}

function decodeExt(buffer: Buffer, offset: number, skip: number, length: number) {
    let start = offset + skip;
    const type = buffer[start++];
    const end = start + length;
    const payload = buffer.slice(start, end);
    const msg = new MsgExt(payload, type);
    msg.msgpackLength = end - offset;
    return msg;
}
