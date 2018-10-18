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
var MsgArray = /** @class */ (function () {
    function MsgArray() {
        this.array = [];
    }
    MsgArray.prototype.add = function (value) {
        this.array.push(value);
        this.msgpackLength += value.msgpackLength;
    };
    MsgArray.prototype.valueOf = function () {
        return this.array.map(function (msg) { return msg.valueOf(); });
    };
    return MsgArray;
}());
var MsgFixArray = /** @class */ (function (_super) {
    __extends(MsgFixArray, _super);
    function MsgFixArray() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MsgFixArray.prototype.writeMsgpackTo = function (buffer, offset) {
        var length = this.array.length;
        if (length > 15)
            throw new TypeError("Too many items: " + length);
        offset |= 0;
        buffer[offset] = 0x90 | length;
        var pos = offset + 1;
        this.array.forEach(function (msg) { return pos += msg.writeMsgpackTo(buffer, pos); });
        return pos - offset;
    };
    return MsgFixArray;
}(MsgArray));
exports.MsgFixArray = MsgFixArray;
var MsgArray16 = /** @class */ (function (_super) {
    __extends(MsgArray16, _super);
    function MsgArray16() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MsgArray16.prototype.writeMsgpackTo = function (buffer, offset) {
        var length = this.array.length;
        if (length > 65535)
            throw new TypeError("Too many items: " + length);
        offset |= 0;
        buffer[offset] = 0xdc;
        var pos = buffer.writeUInt16BE(length, offset + 1);
        this.array.forEach(function (msg) { return pos += msg.writeMsgpackTo(buffer, pos); });
        return pos - offset;
    };
    return MsgArray16;
}(MsgArray));
exports.MsgArray16 = MsgArray16;
var MsgArray32 = /** @class */ (function (_super) {
    __extends(MsgArray32, _super);
    function MsgArray32() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MsgArray32.prototype.writeMsgpackTo = function (buffer, offset) {
        var length = this.array.length;
        offset |= 0;
        buffer[offset] = 0xdd;
        var pos = buffer.writeUInt32BE(length, offset + 1);
        this.array.forEach(function (msg) { return pos += msg.writeMsgpackTo(buffer, pos); });
        return pos - offset;
    };
    return MsgArray32;
}(MsgArray));
exports.MsgArray32 = MsgArray32;
/**
 * constant length
 */
MsgFixArray.prototype.msgpackLength = 1;
MsgArray16.prototype.msgpackLength = 3;
MsgArray32.prototype.msgpackLength = 5;
