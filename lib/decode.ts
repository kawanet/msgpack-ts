import {MsgExt, MsgInterface} from "msg-interface";
import {MsgBoolean} from "./msg-boolean";
import {MsgBinary} from "./msg-binary";
import {MsgNil} from "./msg-nil";

type Decoder = (buffer: Buffer, offset: number) => MsgInterface;

export function decodeMsgpack(buffer: Buffer, offset?: number): MsgInterface {
    offset = +offset || 0;
    const token = buffer[offset];
    const f: Decoder = tokenMap[token];
    if (f) return f(buffer, offset);
}

const tokenMap = initTokenMap();

function initTokenMap() {
    const A = require("./msg-array");
    const I = require("msg-int64");
    const M = require("./msg-map");
    const N = require("./msg-number");
    const S = require("./msg-string");

    const decoders: Decoder[] = new Array(256);

    decoders[0xc0] = MsgNil.decode;
    decoders[0xc2] = MsgBoolean.decode;
    decoders[0xc3] = MsgBoolean.decode;

    let i;
    for (i = 0x00; i < 0x80; i++) decoders[i] = N.MsgFixInt.decode;
    for (i = 0x80; i < 0x90; i++) decoders[i] = M.MsgFixMap.decode;
    for (i = 0x90; i < 0xa0; i++) decoders[i] = A.MsgFixArray.decode;
    for (i = 0xa0; i < 0xc0; i++) decoders[i] = S.MsgFixString.decode;

    decoders[0xc4] = (buffer, offset) => decodeBinary(buffer, offset, 2, buffer.readUInt8(offset + 1));
    decoders[0xc5] = (buffer, offset) => decodeBinary(buffer, offset, 3, buffer.readUInt16BE(offset + 1));
    decoders[0xc6] = (buffer, offset) => decodeBinary(buffer, offset, 5, buffer.readUInt32BE(offset + 1));

    decoders[0xc7] = (buffer, offset) => decodeExt(buffer, offset, 2, buffer.readUInt8(offset + 1));
    decoders[0xc8] = (buffer, offset) => decodeExt(buffer, offset, 3, buffer.readUInt16BE(offset + 1));
    decoders[0xc9] = (buffer, offset) => decodeExt(buffer, offset, 5, buffer.readUInt32BE(offset + 1));

    decoders[0xca] = N.MsgFloat32.decode;
    decoders[0xcb] = N.MsgFloat64.decode;
    decoders[0xcc] = N.MsgUInt8.decode;
    decoders[0xcd] = N.MsgUInt16.decode;
    decoders[0xce] = N.MsgUInt32.decode;
    decoders[0xcf] = (buffer, offset) => new I.MsgUInt64(buffer, offset + 1);
    decoders[0xd0] = N.MsgInt8.decode;
    decoders[0xd1] = N.MsgInt16.decode;
    decoders[0xd2] = N.MsgInt32.decode;
    decoders[0xd3] = (buffer, offset) => new I.MsgInt64(buffer, offset + 1);

    decoders[0xd4] = (buffer, offset) => decodeExt(buffer, offset, 1, 1);
    decoders[0xd5] = (buffer, offset) => decodeExt(buffer, offset, 1, 2);
    decoders[0xd6] = (buffer, offset) => decodeExt(buffer, offset, 1, 4);
    decoders[0xd7] = (buffer, offset) => decodeExt(buffer, offset, 1, 8);
    decoders[0xd8] = (buffer, offset) => decodeExt(buffer, offset, 1, 16);

    decoders[0xd9] = S.MsgString8.decode;
    decoders[0xda] = S.MsgString16.decode;
    decoders[0xdb] = S.MsgString32.decode;

    decoders[0xdc] = A.MsgArray16.decode;
    decoders[0xdd] = A.MsgArray32.decode;

    decoders[0xde] = M.MsgMap16.decode;
    decoders[0xdf] = M.MsgMap32.decode;

    for (i = 0xe0; i < 0x100; i++) decoders[i] = N.MsgFixInt.decode;

    return decoders;
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
