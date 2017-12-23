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
var MsgMap = /** @class */ (function (_super) {
    __extends(MsgMap, _super);
    function MsgMap(value) {
        var _this = _super.call(this) || this;
        if (!value)
            value = {};
        var array = _this.array = [];
        Object.keys(value).forEach(function (key) {
            var val = value[key];
            array.push(msg_value_1.MsgValue.encode(key), msg_value_1.MsgValue.encode(val));
        });
        _this.msgpackLength = array.reduce(function (total, msg) { return total + msg.msgpackLength; }, 5);
        return _this;
    }
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
    MsgMap.prototype.writeMsgpackTo = function (buffer, offset) {
        var length = this.array.length / 2;
        var C = (length < 16) ? MsgFixMap : (length < 65536) ? MsgMap16 : MsgMap32;
        return C.prototype.writeMsgpackTo.call(this, buffer, offset);
    };
    return MsgMap;
}(msg_interface_1.Msg));
exports.MsgMap = MsgMap;
var MsgFixMap = /** @class */ (function (_super) {
    __extends(MsgFixMap, _super);
    function MsgFixMap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MsgFixMap.decode = function (buffer, offset) {
        var length = buffer[offset] & 0x0f;
        return read(new MsgFixMap(), buffer, offset, offset + 1, length);
    };
    MsgFixMap.prototype.writeMsgpackTo = function (buffer, offset) {
        var length = this.array.length / 2;
        buffer[offset] = 0x80 | length;
        var pos = offset + 1;
        return write(this, buffer, offset, pos);
    };
    return MsgFixMap;
}(MsgMap));
exports.MsgFixMap = MsgFixMap;
var MsgMap16 = /** @class */ (function (_super) {
    __extends(MsgMap16, _super);
    function MsgMap16() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MsgMap16.decode = function (buffer, offset) {
        var length = buffer.readUInt16BE(offset + 1);
        return read(new MsgMap16(), buffer, offset, offset + 3, length);
    };
    MsgMap16.prototype.writeMsgpackTo = function (buffer, offset) {
        var length = this.array.length / 2;
        buffer[offset] = 0xde;
        var pos = buffer.writeUInt16BE(length, offset + 1);
        return write(this, buffer, offset, pos);
    };
    return MsgMap16;
}(MsgMap));
exports.MsgMap16 = MsgMap16;
var MsgMap32 = /** @class */ (function (_super) {
    __extends(MsgMap32, _super);
    function MsgMap32() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MsgMap32.decode = function (buffer, offset) {
        var length = buffer.readUInt32BE(offset + 1);
        return read(new MsgMap32(), buffer, offset, offset + 5, length);
    };
    MsgMap32.prototype.writeMsgpackTo = function (buffer, offset) {
        var length = this.array.length / 2;
        buffer[offset] = 0xdf;
        var pos = buffer.writeUInt32BE(length, offset + 1);
        return write(this, buffer, offset, pos);
    };
    return MsgMap32;
}(MsgMap));
exports.MsgMap32 = MsgMap32;
function read(self, buffer, offset, start, length) {
    var array = self.array;
    for (var i = 0; i < length; i++) {
        var key = msg_value_1.MsgValue.decode(buffer, start);
        start += key.msgpackLength;
        var val = msg_value_1.MsgValue.decode(buffer, start);
        start += val.msgpackLength;
        array.push(key, val);
    }
    self.msgpackLength = start - offset;
    return self;
}
function write(self, buffer, offset, start) {
    return self.array.reduce(function (pos, msg) { return pos + msg.writeMsgpackTo(buffer, pos); }, start) - offset;
}
