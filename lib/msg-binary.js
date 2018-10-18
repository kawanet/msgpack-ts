"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var msg_value_1 = require("./msg-value");
var MsgBinary = /** @class */ (function (_super) {
    __extends(MsgBinary, _super);
    function MsgBinary(value) {
        var _this = _super.call(this, value) || this;
        var length = value.length;
        _this.msgpackLength = (length < 256) ? 2 + length : (length < 65536) ? 3 + length : 5 + length;
        return _this;
    }
    MsgBinary.prototype.writeMsgpackTo = function (buffer, offset) {
        var value = this.value;
        var length = value.length;
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
}(msg_value_1.MsgValue));
exports.MsgBinary = MsgBinary;
