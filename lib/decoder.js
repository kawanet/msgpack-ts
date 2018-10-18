"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var msg_interface_1 = require("msg-interface");
var msg_int64_1 = require("msg-int64");
var msg_binary_1 = require("./msg-binary");
var msg_boolean_1 = require("./msg-boolean");
var msg_nil_1 = require("./msg-nil");
var UTF8 = "utf8";
var decoders = initDecoders();
function decodeMsg(buffer, offset) {
    offset = 0 | offset;
    var token = buffer[offset];
    var f = decoders[token];
    return f && f(buffer, offset);
}
exports.decodeMsg = decodeMsg;
function initDecoders() {
    var A = require("./msg-array");
    var M = require("./msg-map");
    var N = require("./msg-number");
    var S = require("./msg-string");
    var decoders = new Array(256);
    decoders[0xc0] = function (_buffer, _offset) { return new msg_nil_1.MsgNil(); };
    decoders[0xc2] = function (_buffer, _offset) { return new msg_boolean_1.MsgBoolean(false); };
    decoders[0xc3] = function (_buffer, _offset) { return new msg_boolean_1.MsgBoolean(true); };
    var decodeFixString = function (buffer, offset) { return decodeString(buffer, offset, 1, buffer[offset] & 0x1f, function (str) { return new S.MsgFixString(str); }); };
    var decodeFixArray = function (buffer, offset) { return decodeArray(new A.MsgFixArray(), buffer, offset, 1, buffer[offset] & 0x0f); };
    var decodeFixMap = function (buffer, offset) { return decodeMap(new M.MsgFixMap(), buffer, offset, 1, buffer[offset] & 0x0f); };
    var i;
    for (i = 0x00; i < 0x80; i++)
        decoders[i] = decodeFixInt;
    for (i = 0x80; i < 0x90; i++)
        decoders[i] = decodeFixMap;
    for (i = 0x90; i < 0xa0; i++)
        decoders[i] = decodeFixArray;
    for (i = 0xa0; i < 0xc0; i++)
        decoders[i] = decodeFixString;
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
    decoders[0xcf] = function (buffer, offset) { return new msg_int64_1.MsgUInt64(buffer, offset + 1); };
    decoders[0xd0] = function (buffer, offset) { return new N.MsgInt8(buffer.readInt8(offset + 1)); };
    decoders[0xd1] = function (buffer, offset) { return new N.MsgInt16(buffer.readInt16BE(offset + 1)); };
    decoders[0xd2] = function (buffer, offset) { return new N.MsgInt32(buffer.readInt32BE(offset + 1)); };
    decoders[0xd3] = function (buffer, offset) { return new msg_int64_1.MsgInt64(buffer, offset + 1); };
    decoders[0xd4] = function (buffer, offset) { return decodeExt(buffer, offset, 1, 1); };
    decoders[0xd5] = function (buffer, offset) { return decodeExt(buffer, offset, 1, 2); };
    decoders[0xd6] = function (buffer, offset) { return decodeExt(buffer, offset, 1, 4); };
    decoders[0xd7] = function (buffer, offset) { return decodeExt(buffer, offset, 1, 8); };
    decoders[0xd8] = function (buffer, offset) { return decodeExt(buffer, offset, 1, 16); };
    decoders[0xd9] = function (buffer, offset) { return decodeString(buffer, offset, 2, buffer.readUInt8(offset + 1), function (str) { return new S.MsgString8(str); }); };
    decoders[0xda] = function (buffer, offset) { return decodeString(buffer, offset, 3, buffer.readUInt16BE(offset + 1), function (str) { return new S.MsgString16(str); }); };
    decoders[0xdb] = function (buffer, offset) { return decodeString(buffer, offset, 5, buffer.readUInt32BE(offset + 1), function (str) { return new S.MsgString32(str); }); };
    decoders[0xdc] = function (buffer, offset) { return decodeArray(new A.MsgArray16(), buffer, offset, 3, buffer.readUInt16BE(offset + 1)); };
    decoders[0xdd] = function (buffer, offset) { return decodeArray(new A.MsgArray32(), buffer, offset, 5, buffer.readUInt32BE(offset + 1)); };
    decoders[0xde] = function (buffer, offset) { return decodeMap(new M.MsgMap16(), buffer, offset, 3, buffer.readUInt16BE(offset + 1)); };
    decoders[0xdf] = function (buffer, offset) { return decodeMap(new M.MsgMap32(), buffer, offset, 5, buffer.readUInt32BE(offset + 1)); };
    for (i = 0xe0; i < 0x100; i++)
        decoders[i] = decodeFixInt;
    return decoders;
    function decodeFixInt(buffer, offset) {
        offset |= 0;
        var value = buffer[offset];
        if (value > 127)
            value -= 256;
        return new N.MsgFixInt(value);
    }
}
exports.initDecoders = initDecoders;
function decodeString(buffer, offset, skip, length, create) {
    var start = offset + skip;
    var end = start + length;
    var str = buffer.toString(UTF8, start, end);
    var msg = create(str);
    msg.msgpackLength = end - offset;
    return msg;
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
    var msg = new msg_interface_1.MsgExt(payload, type);
    msg.msgpackLength = end - offset;
    return msg;
}
