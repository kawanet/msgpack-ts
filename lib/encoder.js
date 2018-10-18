"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var msg_interface_1 = require("msg-interface");
var msg_int64_1 = require("msg-int64");
var msg_array_1 = require("./msg-array");
var msg_binary_1 = require("./msg-binary");
var msg_boolean_1 = require("./msg-boolean");
var msg_map_1 = require("./msg-map");
var N = require("./msg-number");
var msg_nil_1 = require("./msg-nil");
var msg_string_1 = require("./msg-string");
var UINT16_NEXT = 0x10000;
var UINT32_NEXT = 0x100000000;
var encoders = {
    boolean: function (value) { return new msg_boolean_1.MsgBoolean(value); },
    number: encodeNumber,
    object: encodeObject,
    string: function (value) { return new msg_string_1.MsgString(value); },
};
function encodeMsg(value) {
    var type = typeof value;
    var f = encoders[type];
    return f && f(value);
}
exports.encodeMsg = encodeMsg;
function encodeNumber(value) {
    var isInteger = ((value | 0) === value) || (0 < value && value < UINT32_NEXT && !(value % 1));
    if (isInteger) {
        if (-33 < value && value < 128) {
            return new N.MsgFixInt(value);
        }
        else if (value > 0) {
            if (value < 256) {
                return new N.MsgUInt8(value);
            }
            else if (value < UINT16_NEXT) {
                return new N.MsgUInt16(value);
            }
            else if (value < UINT32_NEXT) {
                return new N.MsgUInt32(value);
            }
        }
        else if (value < 0) {
            if (-129 < value) {
                return new N.MsgInt8(value);
            }
            else if (-32769 < value) {
                return new N.MsgInt16(value);
            }
            else {
                return new N.MsgInt32(value);
            }
        }
    }
    return new N.MsgFloat64(value);
}
function encodeObject(value) {
    if (value == null) {
        return new msg_nil_1.MsgNil();
    }
    if (msg_interface_1.isMsg(value)) {
        return value;
    }
    if (Array.isArray(value)) {
        var length_1 = value.length;
        var MsgArray = (length_1 < 16) ? msg_array_1.MsgFixArray : (length_1 < 65536) ? msg_array_1.MsgArray16 : msg_array_1.MsgArray32;
        var msg_1 = new MsgArray();
        value.forEach(function (item) { return msg_1.add(encodeMsg(item)); });
        return msg_1;
    }
    if (Buffer.isBuffer(value)) {
        return new msg_binary_1.MsgBinary(value);
    }
    if (msg_int64_1.MsgInt64.isInt64BE(value)) {
        return new msg_int64_1.MsgInt64(value.toBuffer());
    }
    if (msg_int64_1.MsgUInt64.isUint64BE(value)) {
        return new msg_int64_1.MsgUInt64(value.toBuffer());
    }
    {
        var array = Object.keys(value);
        var length_2 = array.length / 2;
        var MsgMap = (length_2 < 16) ? msg_map_1.MsgFixMap : (length_2 < 65536) ? msg_map_1.MsgMap16 : msg_map_1.MsgMap32;
        var msg_2 = new MsgMap();
        array.forEach(function (key) { return msg_2.set(encodeMsg(key), encodeMsg(value[key])); });
        return msg_2;
    }
}
