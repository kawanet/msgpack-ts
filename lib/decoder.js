"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var msg_interface_1 = require("msg-interface");
var msg_int64_1 = require("msg-int64");
var msg_binary_1 = require("./msg-binary");
function initDecoders() {
    var ARR = require("./msg-array");
    var BOO = require("./msg-boolean");
    var MAP = require("./msg-map");
    var NIL = require("./msg-nil");
    var NUM = require("./msg-number");
    var STR = require("./msg-string");
    var decoders = new Array(256);
    decoders[0xc0] = NIL.MsgNil.decode;
    decoders[0xc2] = BOO.MsgBoolean.decode;
    decoders[0xc3] = BOO.MsgBoolean.decode;
    var i;
    for (i = 0x00; i < 0x80; i++)
        decoders[i] = NUM.MsgFixInt.decode;
    for (i = 0x80; i < 0x90; i++)
        decoders[i] = MAP.MsgFixMap.decode;
    for (i = 0x90; i < 0xa0; i++)
        decoders[i] = ARR.MsgFixArray.decode;
    for (i = 0xa0; i < 0xc0; i++)
        decoders[i] = STR.MsgFixString.decode;
    decoders[0xc4] = function (buffer, offset) { return decodeBinary(buffer, offset, 2, buffer.readUInt8(offset + 1)); };
    decoders[0xc5] = function (buffer, offset) { return decodeBinary(buffer, offset, 3, buffer.readUInt16BE(offset + 1)); };
    decoders[0xc6] = function (buffer, offset) { return decodeBinary(buffer, offset, 5, buffer.readUInt32BE(offset + 1)); };
    decoders[0xc7] = function (buffer, offset) { return decodeExt(buffer, offset, 2, buffer.readUInt8(offset + 1)); };
    decoders[0xc8] = function (buffer, offset) { return decodeExt(buffer, offset, 3, buffer.readUInt16BE(offset + 1)); };
    decoders[0xc9] = function (buffer, offset) { return decodeExt(buffer, offset, 5, buffer.readUInt32BE(offset + 1)); };
    decoders[0xca] = NUM.MsgFloat32.decode;
    decoders[0xcb] = NUM.MsgFloat64.decode;
    decoders[0xcc] = NUM.MsgUInt8.decode;
    decoders[0xcd] = NUM.MsgUInt16.decode;
    decoders[0xce] = NUM.MsgUInt32.decode;
    decoders[0xcf] = function (buffer, offset) { return new msg_int64_1.MsgUInt64(buffer, offset + 1); };
    decoders[0xd0] = NUM.MsgInt8.decode;
    decoders[0xd1] = NUM.MsgInt16.decode;
    decoders[0xd2] = NUM.MsgInt32.decode;
    decoders[0xd3] = function (buffer, offset) { return new msg_int64_1.MsgInt64(buffer, offset + 1); };
    decoders[0xd4] = function (buffer, offset) { return decodeExt(buffer, offset, 1, 1); };
    decoders[0xd5] = function (buffer, offset) { return decodeExt(buffer, offset, 1, 2); };
    decoders[0xd6] = function (buffer, offset) { return decodeExt(buffer, offset, 1, 4); };
    decoders[0xd7] = function (buffer, offset) { return decodeExt(buffer, offset, 1, 8); };
    decoders[0xd8] = function (buffer, offset) { return decodeExt(buffer, offset, 1, 16); };
    decoders[0xd9] = STR.MsgString8.decode;
    decoders[0xda] = STR.MsgString16.decode;
    decoders[0xdb] = STR.MsgString32.decode;
    decoders[0xdc] = ARR.MsgArray16.decode;
    decoders[0xdd] = ARR.MsgArray32.decode;
    decoders[0xde] = MAP.MsgMap16.decode;
    decoders[0xdf] = MAP.MsgMap32.decode;
    for (i = 0xe0; i < 0x100; i++)
        decoders[i] = NUM.MsgFixInt.decode;
    return decoders;
}
exports.initDecoders = initDecoders;
function decodeBinary(buffer, offset, skip, length) {
    var start = offset + skip;
    var end = start + length;
    var payload = buffer.slice(start, end);
    var msg = new msg_binary_1.MsgBinary(payload);
    msg.msgpackLength = end - offset;
    return msg;
}
function decodeExt(buffer, offset, skip, length) {
    var start = offset + skip;
    var type = buffer[start++];
    var end = start + length;
    var payload = buffer.slice(start, end);
    var msg = new msg_interface_1.MsgExt(payload, type);
    msg.msgpackLength = end - offset;
    return msg;
}
