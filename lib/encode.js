"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var msg_boolean_1 = require("./msg-boolean");
var msg_number_1 = require("./msg-number");
var msg_object_1 = require("./msg-object");
var msg_string_1 = require("./msg-string");
function encode(value) {
    var msg = encodeMsgpack(value);
    if (!msg)
        return;
    return msg.toMsgpack();
}
exports.encode = encode;
/**
 * @private
 */
var typeMap = {
    boolean: msg_boolean_1.encodeBoolean,
    number: msg_number_1.encodeNumber,
    object: msg_object_1.encodeObject,
    string: msg_string_1.encodeString,
};
function encodeMsgpack(value) {
    var type = typeof value;
    var f = typeMap[type];
    if (!f)
        return;
    return f(value);
}
exports.encodeMsgpack = encodeMsgpack;
