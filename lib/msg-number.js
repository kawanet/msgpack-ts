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
var MsgNumber = /** @class */ (function () {
    function MsgNumber(value) {
        this.value = +value;
    }
    MsgNumber.prototype.valueOf = function () {
        return this.value;
    };
    return MsgNumber;
}());
var MsgFixInt = /** @class */ (function (_super) {
    __extends(MsgFixInt, _super);
    function MsgFixInt() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MsgFixInt.prototype.writeMsgpackTo = function (buffer, offset) {
        offset |= 0;
        buffer[offset] = this.value & 255;
        return 1;
    };
    return MsgFixInt;
}(MsgNumber));
exports.MsgFixInt = MsgFixInt;
var MsgInt8 = /** @class */ (function (_super) {
    __extends(MsgInt8, _super);
    function MsgInt8() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MsgInt8.prototype.writeMsgpackTo = function (buffer, offset) {
        offset |= 0;
        buffer[offset] = 0xd0;
        buffer.writeInt8(+this.value, offset + 1);
        return 2;
    };
    return MsgInt8;
}(MsgNumber));
exports.MsgInt8 = MsgInt8;
var MsgUInt8 = /** @class */ (function (_super) {
    __extends(MsgUInt8, _super);
    function MsgUInt8() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MsgUInt8.prototype.writeMsgpackTo = function (buffer, offset) {
        offset |= 0;
        buffer[offset] = 0xcc;
        buffer.writeUInt8(+this.value, offset + 1);
        return 2;
    };
    return MsgUInt8;
}(MsgNumber));
exports.MsgUInt8 = MsgUInt8;
var MsgInt16 = /** @class */ (function (_super) {
    __extends(MsgInt16, _super);
    function MsgInt16() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MsgInt16.prototype.writeMsgpackTo = function (buffer, offset) {
        offset |= 0;
        buffer[offset] = 0xd1;
        buffer.writeInt16BE(+this.value, offset + 1);
        return 3;
    };
    return MsgInt16;
}(MsgNumber));
exports.MsgInt16 = MsgInt16;
var MsgUInt16 = /** @class */ (function (_super) {
    __extends(MsgUInt16, _super);
    function MsgUInt16() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MsgUInt16.prototype.writeMsgpackTo = function (buffer, offset) {
        offset |= 0;
        buffer[offset] = 0xcd;
        buffer.writeUInt16BE(+this.value, offset + 1);
        return 3;
    };
    return MsgUInt16;
}(MsgNumber));
exports.MsgUInt16 = MsgUInt16;
var MsgInt32 = /** @class */ (function (_super) {
    __extends(MsgInt32, _super);
    function MsgInt32() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MsgInt32.prototype.writeMsgpackTo = function (buffer, offset) {
        offset |= 0;
        buffer[offset] = 0xd2;
        buffer.writeInt32BE(+this.value, offset + 1);
        return 5;
    };
    return MsgInt32;
}(MsgNumber));
exports.MsgInt32 = MsgInt32;
var MsgUInt32 = /** @class */ (function (_super) {
    __extends(MsgUInt32, _super);
    function MsgUInt32() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MsgUInt32.prototype.writeMsgpackTo = function (buffer, offset) {
        offset |= 0;
        buffer[offset] = 0xce;
        buffer.writeUInt32BE(+this.value, offset + 1);
        return 5;
    };
    return MsgUInt32;
}(MsgNumber));
exports.MsgUInt32 = MsgUInt32;
var MsgFloat32 = /** @class */ (function (_super) {
    __extends(MsgFloat32, _super);
    function MsgFloat32() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MsgFloat32.prototype.writeMsgpackTo = function (buffer, offset) {
        offset |= 0;
        buffer[offset] = 0xca;
        buffer.writeFloatBE(+this.value, offset + 1);
        return 5;
    };
    return MsgFloat32;
}(MsgNumber));
exports.MsgFloat32 = MsgFloat32;
var MsgFloat64 = /** @class */ (function (_super) {
    __extends(MsgFloat64, _super);
    function MsgFloat64() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MsgFloat64.prototype.writeMsgpackTo = function (buffer, offset) {
        offset |= 0;
        buffer[offset] = 0xcb;
        buffer.writeDoubleBE(+this.value, offset + 1);
        return 9;
    };
    return MsgFloat64;
}(MsgNumber));
exports.MsgFloat64 = MsgFloat64;
/**
 * constant length
 */
(function (setMsgpackLength) {
    setMsgpackLength(MsgFixInt, 1);
    setMsgpackLength(MsgInt8, 2);
    setMsgpackLength(MsgUInt8, 2);
    setMsgpackLength(MsgInt16, 3);
    setMsgpackLength(MsgUInt16, 3);
    setMsgpackLength(MsgInt32, 5);
    setMsgpackLength(MsgUInt32, 5);
    setMsgpackLength(MsgFloat32, 5);
    setMsgpackLength(MsgFloat64, 9);
})(function (Class, length) { return Class.prototype.msgpackLength = length; });
