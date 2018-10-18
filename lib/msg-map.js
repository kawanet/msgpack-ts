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
var MsgMap = /** @class */ (function () {
    function MsgMap() {
        this.array = [];
    }
    MsgMap.prototype.set = function (key, value) {
        this.array.push(key, value);
        this.msgpackLength += key.msgpackLength + value.msgpackLength;
    };
    MsgMap.prototype.valueOf = function () {
        var array = this.array;
        var length = array.length;
        var obj = {};
        for (var i = 0; i < length;) {
            var key = array[i++];
            var val = array[i++];
            obj[key.valueOf()] = val.valueOf();
        }
        return obj;
    };
    return MsgMap;
}());
var MsgFixMap = /** @class */ (function (_super) {
    __extends(MsgFixMap, _super);
    function MsgFixMap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MsgFixMap.prototype.writeMsgpackTo = function (buffer, offset) {
        offset |= 0;
        var length = this.array.length / 2;
        if (length > 15)
            throw new TypeError("Too many items: " + length);
        buffer[offset] = 0x80 | length;
        var pos = offset + 1;
        this.array.forEach(function (msg) { return pos += msg.writeMsgpackTo(buffer, pos); });
        return pos - offset;
    };
    return MsgFixMap;
}(MsgMap));
exports.MsgFixMap = MsgFixMap;
var MsgMap16 = /** @class */ (function (_super) {
    __extends(MsgMap16, _super);
    function MsgMap16() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MsgMap16.prototype.writeMsgpackTo = function (buffer, offset) {
        offset |= 0;
        var length = this.array.length / 2;
        if (length > 65535)
            throw new TypeError("Too many items: " + length);
        buffer[offset] = 0xde;
        var pos = buffer.writeUInt16BE(length, offset + 1);
        this.array.forEach(function (msg) { return pos += msg.writeMsgpackTo(buffer, pos); });
        return pos - offset;
    };
    return MsgMap16;
}(MsgMap));
exports.MsgMap16 = MsgMap16;
var MsgMap32 = /** @class */ (function (_super) {
    __extends(MsgMap32, _super);
    function MsgMap32() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MsgMap32.prototype.writeMsgpackTo = function (buffer, offset) {
        var length = this.array.length / 2;
        offset |= 0;
        buffer[offset] = 0xdf;
        var pos = buffer.writeUInt32BE(length, offset + 1);
        this.array.forEach(function (msg) { return pos += msg.writeMsgpackTo(buffer, pos); });
        return pos - offset;
    };
    return MsgMap32;
}(MsgMap));
exports.MsgMap32 = MsgMap32;
/**
 * constant length
 */
MsgFixMap.prototype.msgpackLength = 1;
MsgMap16.prototype.msgpackLength = 3;
MsgMap32.prototype.msgpackLength = 5;
