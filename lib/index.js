"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var msg_interface_1 = require("msg-interface");
var decoder_1 = require("./decoder");
var encoder_1 = require("./encoder");
var msg_array_1 = require("./msg-array");
exports.MsgFixArray = msg_array_1.MsgFixArray;
exports.MsgArray16 = msg_array_1.MsgArray16;
exports.MsgArray32 = msg_array_1.MsgArray32;
var msg_binary_1 = require("./msg-binary");
exports.MsgBinary = msg_binary_1.MsgBinary;
var msg_boolean_1 = require("./msg-boolean");
exports.MsgBoolean = msg_boolean_1.MsgBoolean;
var msg_map_1 = require("./msg-map");
exports.MsgFixMap = msg_map_1.MsgFixMap;
exports.MsgMap16 = msg_map_1.MsgMap16;
exports.MsgMap32 = msg_map_1.MsgMap32;
var msg_nil_1 = require("./msg-nil");
exports.MsgNil = msg_nil_1.MsgNil;
__export(require("msg-number"));
var msg_string_1 = require("./msg-string");
exports.MsgString = msg_string_1.MsgString;
exports.MsgFixString = msg_string_1.MsgFixString;
exports.MsgString8 = msg_string_1.MsgString8;
exports.MsgString16 = msg_string_1.MsgString16;
exports.MsgString32 = msg_string_1.MsgString32;
function encode(value) {
    var msg = encoder_1.encodeMsg(value);
    return msg && msg_interface_1.msgToBuffer(msg);
}
exports.encode = encode;
function decode(buffer, offset) {
    var msg = decoder_1.decodeMsg(buffer, offset);
    return msg && msg.valueOf();
}
exports.decode = decode;
