"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var encode_1 = require("./encode");
var decode_1 = require("./decode");
exportAll(require("./msg-array"));
exportAll(require("./msg-binary"));
exportAll(require("./msg-boolean"));
exportAll(require("./msg-map"));
exportAll(require("./msg-nil"));
exportAll(require("./msg-number"));
exportAll(require("./msg-string"));
exportAll(require("./msg-value"));
function exportAll(obj) {
    for (var key in obj) {
        exports[key] = obj[key];
    }
}
function encode(value) {
    var msg = encode_1.encodeMsgpack(value);
    if (!msg)
        return;
    return msg.toMsgpack();
}
exports.encode = encode;
function decode(buffer) {
    var msg = decode_1.decodeMsgpack(buffer);
    if (!msg)
        return;
    return msg.valueOf();
}
exports.decode = decode;
