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
var MsgString = /** @class */ (function () {
    function MsgString(value) {
        if (value == null)
            return;
        this.value = value;
        // maximum byte length
        this.msgpackLength = 5 + value.length * 3;
    }
    MsgString.prototype.valueOf = function () {
        return this.value;
    };
    MsgString.prototype.writeMsgpackTo = function (buffer, offset) {
        var length = this.value.length * 3;
        var expect = (length < 32) ? MsgFixString : (length < 256) ? MsgString8 : (length < 65536) ? MsgString16 : MsgString32;
        var bytes = expect.prototype.writeMsgpackTo.call(this, buffer, offset);
        var actual = (bytes < 2 + 32) ? MsgFixString : (bytes < 3 + 256) ? MsgString8 : (bytes < 5 + 65536) ? MsgString16 : MsgString32;
        if (expect === actual)
            return bytes;
        return actual.prototype.writeMsgpackTo.call(this, buffer, offset);
    };
    return MsgString;
}());
exports.MsgString = MsgString;
var MsgFixString = /** @class */ (function (_super) {
    __extends(MsgFixString, _super);
    function MsgFixString() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MsgFixString.prototype.writeMsgpackTo = function (buffer, offset) {
        offset |= 0;
        var length = buffer.write(this.value, offset + 1);
        if (length > 31)
            throw new TypeError("Too long string: " + length);
        buffer[offset] = 0xa0 | length;
        // actual byte length
        return 1 + length;
    };
    return MsgFixString;
}(MsgString));
exports.MsgFixString = MsgFixString;
var MsgString8 = /** @class */ (function (_super) {
    __extends(MsgString8, _super);
    function MsgString8() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MsgString8.prototype.writeMsgpackTo = function (buffer, offset) {
        offset |= 0;
        buffer[offset] = 0xd9;
        var length = buffer.write(this.value, offset + 2);
        if (length > 255)
            throw new TypeError("Too long string: " + length);
        buffer.writeUInt8(length, offset + 1);
        // actual byte length
        return 2 + length;
    };
    return MsgString8;
}(MsgString));
exports.MsgString8 = MsgString8;
var MsgString16 = /** @class */ (function (_super) {
    __extends(MsgString16, _super);
    function MsgString16() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MsgString16.prototype.writeMsgpackTo = function (buffer, offset) {
        offset |= 0;
        buffer[offset] = 0xda;
        var length = buffer.write(this.value, offset + 3);
        if (length > 65535)
            throw new TypeError("Too long string: " + length);
        buffer.writeUInt16BE(length, offset + 1);
        // actual byte length
        return 3 + length;
    };
    return MsgString16;
}(MsgString));
exports.MsgString16 = MsgString16;
var MsgString32 = /** @class */ (function (_super) {
    __extends(MsgString32, _super);
    function MsgString32() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MsgString32.prototype.writeMsgpackTo = function (buffer, offset) {
        offset |= 0;
        buffer[offset] = 0xdb;
        var length = buffer.write(this.value, offset + 5);
        buffer.writeUInt32BE(length, offset + 1);
        // actual byte length
        return 5 + length;
    };
    return MsgString32;
}(MsgString));
exports.MsgString32 = MsgString32;
var MsgStringBuffer = /** @class */ (function () {
    function MsgStringBuffer(buffer, offset, skip, size) {
        this.buffer = buffer;
        this.offset = offset;
        this.skip = skip;
        this.msgpackLength = skip + size;
    }
    MsgStringBuffer.prototype.valueOf = function () {
        var start = this.offset + this.skip;
        var end = this.offset + this.msgpackLength;
        return this.buffer.toString("UTF8", start, end);
    };
    MsgStringBuffer.prototype.writeMsgpackTo = function (buffer, offset) {
        var start = this.offset;
        var end = start + this.msgpackLength;
        this.buffer.copy(buffer, offset, start, end);
        return length;
    };
    return MsgStringBuffer;
}());
exports.MsgStringBuffer = MsgStringBuffer;
