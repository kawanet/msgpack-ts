"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var msg_value_1 = require("./msg-value");
__export(require("./msg-array"));
__export(require("./msg-binary"));
__export(require("./msg-boolean"));
__export(require("./msg-map"));
__export(require("./msg-nil"));
__export(require("./msg-number"));
__export(require("./msg-string"));
__export(require("./msg-value"));
function encode(value) {
    var msg = msg_value_1.MsgValue.encode(value);
    if (!msg)
        return;
    return msg.toMsgpack();
}
exports.encode = encode;
function decode(buffer, offset) {
    offset = +offset || 0;
    var msg = msg_value_1.MsgValue.decode(buffer, offset);
    if (!msg)
        return;
    return msg.valueOf();
}
exports.decode = decode;
