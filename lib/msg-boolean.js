"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MsgBoolean = /** @class */ (function () {
    function MsgBoolean(value) {
        this.value = !!value;
    }
    MsgBoolean.prototype.valueOf = function () {
        return this.value;
    };
    MsgBoolean.prototype.writeMsgpackTo = function (buffer, offset) {
        offset |= 0;
        buffer[offset] = this.value ? 0xc3 : 0xc2;
        return 1;
    };
    return MsgBoolean;
}());
exports.MsgBoolean = MsgBoolean;
/**
 * constant length
 */
MsgBoolean.prototype.msgpackLength = 1;
