"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MsgNil = /** @class */ (function () {
    function MsgNil() {
    }
    MsgNil.prototype.writeMsgpackTo = function (buffer, offset) {
        offset |= 0;
        buffer[offset] = 0xc0;
        return 1;
    };
    MsgNil.prototype.valueOf = function () {
        return null;
    };
    return MsgNil;
}());
exports.MsgNil = MsgNil;
/**
 * constant length
 */
MsgNil.prototype.msgpackLength = 1;
