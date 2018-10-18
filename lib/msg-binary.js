"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MsgBinary = /** @class */ (function () {
    function MsgBinary(value) {
        this.value = value;
        var length = value.length;
        this.msgpackLength = (length < 256) ? 2 + length : (length < 65536) ? 3 + length : 5 + length;
    }
    MsgBinary.prototype.valueOf = function () {
        return this.value;
    };
    MsgBinary.prototype.writeMsgpackTo = function (buffer, offset) {
        var value = this.value;
        var length = value.length;
        offset |= 0;
        if (length < 256) {
            buffer[offset++] = 0xc4;
            buffer[offset++] = length;
        }
        else if (length < 65536) {
            buffer[offset++] = 0xc5;
            offset = buffer.writeUInt16BE(length, offset);
        }
        else {
            buffer[offset++] = 0xc6;
            offset = buffer.writeUInt32BE(length, offset);
        }
        offset += value.copy(buffer, offset);
        return offset;
    };
    return MsgBinary;
}());
exports.MsgBinary = MsgBinary;
