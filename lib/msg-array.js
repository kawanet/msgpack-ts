"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var msg_interface_1 = require("msg-interface");
var msg_value_1 = require("./msg-value");
var MsgArray = /** @class */ (function (_super) {
    __extends(MsgArray, _super);
    function MsgArray(value) {
        var _this = _super.call(this) || this;
        if (!value)
            value = [];
        var array = _this.array = [].map.call(value, function (item) { return msg_value_1.MsgValue.encode(item); });
        _this.msgpackLength = array.reduce(function (total, msg) { return total + msg.msgpackLength; }, 5);
        return _this;
    }
    MsgArray.prototype.valueOf = function () {
        return this.array.map(function (msg) { return msg.valueOf(); });
    };
    MsgArray.prototype.writeMsgpackTo = function (buffer, offset) {
        var length = this.array.length;
        var C = (length < 16) ? MsgFixArray : (length < 65536) ? MsgArray16 : MsgArray32;
        return C.prototype.writeMsgpackTo.call(this, buffer, offset);
    };
    return MsgArray;
}(msg_interface_1.Msg));
exports.MsgArray = MsgArray;
var MsgFixArray = /** @class */ (function (_super) {
    __extends(MsgFixArray, _super);
    function MsgFixArray() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MsgFixArray.decode = function (buffer, offset) {
        var length = buffer[offset] & 0x0f;
        return read(new MsgFixArray(), buffer, offset, offset + 1, length);
    };
    MsgFixArray.prototype.writeMsgpackTo = function (buffer, offset) {
        buffer[offset] = 0x90 | this.array.length;
        return write(this, buffer, offset, offset + 1);
    };
    return MsgFixArray;
}(MsgArray));
exports.MsgFixArray = MsgFixArray;
var MsgArray16 = /** @class */ (function (_super) {
    __extends(MsgArray16, _super);
    function MsgArray16() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MsgArray16.decode = function (buffer, offset) {
        var length = buffer.readUInt16BE(offset + 1);
        return read(new MsgArray16(), buffer, offset, offset + 3, length);
    };
    MsgArray16.prototype.writeMsgpackTo = function (buffer, offset) {
        buffer[offset] = 0xdc;
        var pos = buffer.writeUInt16BE(this.array.length, offset + 1);
        return write(this, buffer, offset, pos);
    };
    return MsgArray16;
}(MsgArray));
exports.MsgArray16 = MsgArray16;
var MsgArray32 = /** @class */ (function (_super) {
    __extends(MsgArray32, _super);
    function MsgArray32() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MsgArray32.decode = function (buffer, offset) {
        var length = buffer.readUInt32BE(offset + 1);
        return read(new MsgArray32(), buffer, offset, offset + 5, length);
    };
    MsgArray32.prototype.writeMsgpackTo = function (buffer, offset) {
        buffer[offset] = 0xdd;
        var pos = buffer.writeUInt32BE(this.array.length, offset + 1);
        return write(this, buffer, offset, pos);
    };
    return MsgArray32;
}(MsgArray));
exports.MsgArray32 = MsgArray32;
function read(self, buffer, offset, start, length) {
    for (var i = 0; i < length; i++) {
        var msg = self.array[i] = msg_value_1.MsgValue.decode(buffer, start);
        start += msg.msgpackLength;
    }
    self.msgpackLength = start - offset;
    return self;
}
function write(self, buffer, offset, start) {
    return self.array.reduce(function (pos, msg) { return pos + msg.writeMsgpackTo(buffer, pos); }, start) - offset;
}
