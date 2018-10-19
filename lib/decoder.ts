import {MsgExt} from "msg-ext";
import {MsgInterface} from "msg-interface";
import * as N from "msg-number";

import {MsgArrayInterface} from "./msg-array";
import {MsgBinary} from "./msg-binary";
import {MsgBoolean} from "./msg-boolean";
import {MsgMapInterface} from "./msg-map";
import {MsgNil} from "./msg-nil";
import {MsgString} from "./msg-string";

type Decoder = (buffer: Buffer, offset: number) => MsgInterface;

const UTF8 = "utf8";

const decoders = initDecoders();

export function decodeMsg(buffer: Buffer, offset?: number): MsgInterface {
    offset = 0 | offset as number;
    const token = buffer[offset];
    const f = decoders[token];
    return f && f(buffer, offset);
}

function initDecoders(): Decoder[] {
    const A = require("./msg-array");
    const M = require("./msg-map");
    const S = require("./msg-string");

    const decoders = new Array(256);

    decoders[0xc0] = (_buffer: Buffer, _offset: number) => new MsgNil();
    decoders[0xc2] = (_buffer: Buffer, _offset: number) => new MsgBoolean(false);
    decoders[0xc3] = (_buffer: Buffer, _offset: number) => new MsgBoolean(true);

    const decodeFixString = (buffer: Buffer, offset: number) => decodeString(buffer, offset, 1, buffer[offset] & 0x1f, str => new S.MsgFixString(str));
    const decodeFixArray = (buffer: Buffer, offset: number) => decodeArray(new A.MsgFixArray(), buffer, offset, 1, buffer[offset] & 0x0f);
    const decodeFixMap = (buffer: Buffer, offset: number) => decodeMap(new M.MsgFixMap(), buffer, offset, 1, buffer[offset] & 0x0f);

    let i;
    for (i = 0x00; i < 0x80; i++) decoders[i] = decodeFixInt;
    for (i = 0x80; i < 0x90; i++) decoders[i] = decodeFixMap;
    for (i = 0x90; i < 0xa0; i++) decoders[i] = decodeFixArray;
    for (i = 0xa0; i < 0xc0; i++) decoders[i] = decodeFixString;

    decoders[0xc4] = (buffer: Buffer, offset: number) => decodeBinary(buffer, offset, 2, buffer.readUInt8(offset + 1));
    decoders[0xc5] = (buffer: Buffer, offset: number) => decodeBinary(buffer, offset, 3, buffer.readUInt16BE(offset + 1));
    decoders[0xc6] = (buffer: Buffer, offset: number) => decodeBinary(buffer, offset, 5, buffer.readUInt32BE(offset + 1));

    decoders[0xc7] = (buffer: Buffer, offset: number) => decodeExt(buffer, offset, 2, buffer.readUInt8(offset + 1));
    decoders[0xc8] = (buffer: Buffer, offset: number) => decodeExt(buffer, offset, 3, buffer.readUInt16BE(offset + 1));
    decoders[0xc9] = (buffer: Buffer, offset: number) => decodeExt(buffer, offset, 5, buffer.readUInt32BE(offset + 1));

    decoders[0xca] = (buffer: Buffer, offset: number) => new N.MsgFloat32(buffer.readFloatBE(offset + 1));
    decoders[0xcb] = (buffer: Buffer, offset: number) => new N.MsgFloat32(buffer.readDoubleBE(offset + 1));
    decoders[0xcc] = (buffer: Buffer, offset: number) => new N.MsgUInt8(buffer.readUInt8(offset + 1));
    decoders[0xcd] = (buffer: Buffer, offset: number) => new N.MsgUInt16(buffer.readUInt16BE(offset + 1));
    decoders[0xce] = (buffer: Buffer, offset: number) => new N.MsgUInt32(buffer.readUInt32BE(offset + 1));
    decoders[0xcf] = (buffer: Buffer, offset: number) => new N.MsgUInt64(buffer, offset + 1);
    decoders[0xd0] = (buffer: Buffer, offset: number) => new N.MsgInt8(buffer.readInt8(offset + 1));
    decoders[0xd1] = (buffer: Buffer, offset: number) => new N.MsgInt16(buffer.readInt16BE(offset + 1));
    decoders[0xd2] = (buffer: Buffer, offset: number) => new N.MsgInt32(buffer.readInt32BE(offset + 1));
    decoders[0xd3] = (buffer: Buffer, offset: number) => new N.MsgInt64(buffer, offset + 1);

    decoders[0xd4] = (buffer: Buffer, offset: number) => decodeExt(buffer, offset, 1, 1);
    decoders[0xd5] = (buffer: Buffer, offset: number) => decodeExt(buffer, offset, 1, 2);
    decoders[0xd6] = (buffer: Buffer, offset: number) => decodeExt(buffer, offset, 1, 4);
    decoders[0xd7] = (buffer: Buffer, offset: number) => decodeExt(buffer, offset, 1, 8);
    decoders[0xd8] = (buffer: Buffer, offset: number) => decodeExt(buffer, offset, 1, 16);

    decoders[0xd9] = (buffer: Buffer, offset: number) => decodeString(buffer, offset, 2, buffer.readUInt8(offset + 1), str => new S.MsgString8(str));
    decoders[0xda] = (buffer: Buffer, offset: number) => decodeString(buffer, offset, 3, buffer.readUInt16BE(offset + 1), str => new S.MsgString16(str));
    decoders[0xdb] = (buffer: Buffer, offset: number) => decodeString(buffer, offset, 5, buffer.readUInt32BE(offset + 1), str => new S.MsgString32(str));

    decoders[0xdc] = (buffer: Buffer, offset: number) => decodeArray(new A.MsgArray16(), buffer, offset, 3, buffer.readUInt16BE(offset + 1));
    decoders[0xdd] = (buffer: Buffer, offset: number) => decodeArray(new A.MsgArray32(), buffer, offset, 5, buffer.readUInt32BE(offset + 1));

    decoders[0xde] = (buffer: Buffer, offset: number) => decodeMap(new M.MsgMap16(), buffer, offset, 3, buffer.readUInt16BE(offset + 1));
    decoders[0xdf] = (buffer: Buffer, offset: number) => decodeMap(new M.MsgMap32(), buffer, offset, 5, buffer.readUInt32BE(offset + 1));

    for (i = 0xe0; i < 0x100; i++) decoders[i] = decodeFixInt;

    return decoders;

    function decodeFixInt(buffer: Buffer, offset: number) {
        offset |= 0;
        let value = buffer[offset];
        if (value > 127) value -= 256;
        return new N.MsgFixInt(value);
    }
}

function decodeString(buffer: Buffer, offset: number, skip: number, length: number, create: ((str: string) => MsgString)) {
    const start = offset + skip;
    const end = start + length;
    const str = buffer.toString(UTF8, start, end);
    const msg = create(str);
    msg.msgpackLength = end - offset;
    return msg;
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
