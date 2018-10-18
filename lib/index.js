"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var msg_interface_1 = require("msg-interface");
var decoder_1 = require("./decoder");
var encoder_1 = require("./encoder");
__export(require("./msg-array"));
__export(require("./msg-binary"));
__export(require("./msg-boolean"));
__export(require("./msg-map"));
__export(require("./msg-nil"));
__export(require("./msg-number"));
__export(require("./msg-string"));
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
