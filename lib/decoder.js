"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var msg_ext_1 = require("msg-ext");
var N = require("msg-number");
var msg_array_1 = require("./msg-array");
var msg_binary_1 = require("./msg-binary");
var msg_boolean_1 = require("./msg-boolean");
var msg_map_1 = require("./msg-map");
var msg_nil_1 = require("./msg-nil");
var msg_string_1 = require("./msg-string");
var decoders = initDecoders();
function decodeMsg(buffer, offset) {
    offset = 0 | offset;
    var token = buffer[offset];
    var f = decoders[token];
    return f && f(buffer, offset);
}
exports.decodeMsg = decodeMsg;
function initDecoders() {
    var decoders = new Array(256);
    var cacheMsg = new Array(256);
    var cacheChr = new Array(256);
    var decodeFixString = function (buffer, offset) { return new msg_string_1.MsgStringBuffer(buffer, offset, 1, buffer[offset] & 0x1f); };
    var decodeFixArray = function (buffer, offset) { return decodeArray(new msg_array_1.MsgFixArray(), buffer, offset, 1, buffer[offset] & 0x0f); };
    var decodeFixMap = function (buffer, offset) { return decodeMap(new msg_map_1.MsgFixMap(), buffer, offset, 1, buffer[offset] & 0x0f); };
    var i;
    for (i = 0x00; i < 0x80; i++)
        decoders[i] = decodeFixInt(i);
    for (i = 0x81; i < 0x90; i++)
        decoders[i] = decodeFixMap;
    for (i = 0x91; i < 0xa0; i++)
        decoders[i] = decodeFixArray;
    for (i = 0xa2; i < 0xc0; i++)
        decoders[i] = decodeFixString;
    // empty
    decoders[0x80] = function (_buffer, _offset) { return cacheMsg[0x80] || (cacheMsg[0x80] = new msg_map_1.MsgFixMap()); };
    decoders[0x90] = function (_buffer, _offset) { return cacheMsg[0x90] || (cacheMsg[0x90] = new msg_array_1.MsgFixArray()); };
    decoders[0xa0] = function (_buffer, _offset) { return cacheMsg[0xa0] || (cacheMsg[0xa0] = new msg_string_1.MsgStringBuffer(Buffer.from([0xa0]), 0, 1, 0)); };
    // single character string
    decoders[0xa1] = function (buffer, offset) {
        var code = buffer[offset + 1];
        return cacheChr[code] || (cacheChr[code] = new msg_string_1.MsgStringBuffer(Buffer.from([0xa1, code]), 0, 1, 1));
    };
    decoders[0xc0] = function (_buffer, _offset) { return cacheMsg[0xc0] || (cacheMsg[0xc0] = new msg_nil_1.MsgNil()); };
    decoders[0xc2] = function (_buffer, _offset) { return cacheMsg[0xc2] || (cacheMsg[0xc2] = new msg_boolean_1.MsgBoolean(false)); };
    decoders[0xc3] = function (_buffer, _offset) { return cacheMsg[0xc3] || (cacheMsg[0xc3] = new msg_boolean_1.MsgBoolean(true)); };
    decoders[0xc4] = function (buffer, offset) { return decodeBinary(buffer, offset, 2, buffer.readUInt8(offset + 1)); };
    decoders[0xc5] = function (buffer, offset) { return decodeBinary(buffer, offset, 3, buffer.readUInt16BE(offset + 1)); };
    decoders[0xc6] = function (buffer, offset) { return decodeBinary(buffer, offset, 5, buffer.readUInt32BE(offset + 1)); };
    decoders[0xc7] = function (buffer, offset) { return decodeExt(buffer, offset, 2, buffer.readUInt8(offset + 1)); };
    decoders[0xc8] = function (buffer, offset) { return decodeExt(buffer, offset, 3, buffer.readUInt16BE(offset + 1)); };
    decoders[0xc9] = function (buffer, offset) { return decodeExt(buffer, offset, 5, buffer.readUInt32BE(offset + 1)); };
    decoders[0xca] = function (buffer, offset) { return new N.MsgFloat32(buffer.readFloatBE(offset + 1)); };
    decoders[0xcb] = function (buffer, offset) { return new N.MsgFloat32(buffer.readDoubleBE(offset + 1)); };
    decoders[0xcc] = function (buffer, offset) { return new N.MsgUInt8(buffer.readUInt8(offset + 1)); };
    decoders[0xcd] = function (buffer, offset) { return new N.MsgUInt16(buffer.readUInt16BE(offset + 1)); };
    decoders[0xce] = function (buffer, offset) { return new N.MsgUInt32(buffer.readUInt32BE(offset + 1)); };
    decoders[0xcf] = function (buffer, offset) { return new N.MsgUInt64(buffer, offset + 1); };
    decoders[0xd0] = function (buffer, offset) { return new N.MsgInt8(buffer.readInt8(offset + 1)); };
    decoders[0xd1] = function (buffer, offset) { return new N.MsgInt16(buffer.readInt16BE(offset + 1)); };
    decoders[0xd2] = function (buffer, offset) { return new N.MsgInt32(buffer.readInt32BE(offset + 1)); };
    decoders[0xd3] = function (buffer, offset) { return new N.MsgInt64(buffer, offset + 1); };
    decoders[0xd4] = function (buffer, offset) { return decodeExt(buffer, offset, 1, 1); };
    decoders[0xd5] = function (buffer, offset) { return decodeExt(buffer, offset, 1, 2); };
    decoders[0xd6] = function (buffer, offset) { return decodeExt(buffer, offset, 1, 4); };
    decoders[0xd7] = function (buffer, offset) { return decodeExt(buffer, offset, 1, 8); };
    decoders[0xd8] = function (buffer, offset) { return decodeExt(buffer, offset, 1, 16); };
    decoders[0xd9] = function (buffer, offset) { return new msg_string_1.MsgStringBuffer(buffer, offset, 2, buffer.readUInt8(offset + 1)); };
    decoders[0xda] = function (buffer, offset) { return new msg_string_1.MsgStringBuffer(buffer, offset, 3, buffer.readUInt16BE(offset + 1)); };
    decoders[0xdb] = function (buffer, offset) { return new msg_string_1.MsgStringBuffer(buffer, offset, 5, buffer.readUInt32BE(offset + 1)); };
    decoders[0xdc] = function (buffer, offset) { return decodeArray(new msg_array_1.MsgArray16(), buffer, offset, 3, buffer.readUInt16BE(offset + 1)); };
    decoders[0xdd] = function (buffer, offset) { return decodeArray(new msg_array_1.MsgArray32(), buffer, offset, 5, buffer.readUInt32BE(offset + 1)); };
    decoders[0xde] = function (buffer, offset) { return decodeMap(new msg_map_1.MsgMap16(), buffer, offset, 3, buffer.readUInt16BE(offset + 1)); };
    decoders[0xdf] = function (buffer, offset) { return decodeMap(new msg_map_1.MsgMap32(), buffer, offset, 5, buffer.readUInt32BE(offset + 1)); };
    for (i = 0xe0; i < 0x100; i++)
        decoders[i] = decodeFixInt(i);
    return decoders;
    function decodeFixInt(i) {
        return function (_buffer, _offset) { return cacheMsg[i] || (cacheMsg[i] = new N.MsgFixInt(i > 127 ? i - 256 : i)); };
    }
}
function decodeArray(msg, buffer, offset, skip, length) {
    var start = offset + skip;
    for (var i = 0; i < length; i++) {
        var item = decodeMsg(buffer, start);
        start += item.msgpackLength;
        msg.add(item);
    }
    return msg;
}
function decodeMap(msg, buffer, offset, skip, length) {
    var start = offset + skip;
    for (var i = 0; i < length; i++) {
        var key = decodeMsg(buffer, start);
        start += key.msgpackLength;
        var val = decodeMsg(buffer, start);
        start += val.msgpackLength;
        msg.set(key, val);
    }
    return msg;
}
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
    var msg = new msg_ext_1.MsgExt(payload, type);
    msg.msgpackLength = end - offset;
    return msg;
}
