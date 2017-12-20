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
var msg_int64_1 = require("msg-int64");
var UINT16_NEXT = 0x10000;
var UINT32_NEXT = 0x100000000;
var undef = void 0;
function encode(value) {
    var msg = createMsgpack(value);
    if (!msg)
        return;
    return msg.toMsgpack();
}
exports.encode = encode;
var MsgValue = /** @class */ (function (_super) {
    __extends(MsgValue, _super);
    function MsgValue(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    MsgValue.prototype.valueOf = function () {
        return this.value;
    };
    return MsgValue;
}(msg_interface_1.Msg));
(function (P) {
    P.value = undef;
})(MsgValue.prototype);
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
}(MsgValue));
exports.MsgBinary = MsgBinary;
var MsgArray = /** @class */ (function (_super) {
    __extends(MsgArray, _super);
    function MsgArray(value) {
        var _this = _super.call(this) || this;
        var array = _this.array = [].map.call(value, function (item) { return createMsgpack(item); });
        _this.msgpackLength = array.reduce(function (total, msg) { return total + msg.msgpackLength; }, 5);
        return _this;
    }
    MsgArray.prototype.writeMsgpackTo = function (buffer, offset) {
        var array = this.array;
        var length = array.length;
        var pos = offset;
        if (length < 16) {
            buffer[pos++] = 0x90 | length;
        }
        else if (length < 65536) {
            buffer[pos++] = 0xdc;
            pos = buffer.writeUInt16BE(length, pos);
        }
        else {
            buffer[pos++] = 0xdd;
            pos = buffer.writeUInt32BE(length, pos);
        }
        return array.reduce(function (pos, msg) { return pos + msg.writeMsgpackTo(buffer, pos); }, pos) - offset;
    };
    return MsgArray;
}(msg_interface_1.Msg));
exports.MsgArray = MsgArray;
var MsgMap = /** @class */ (function (_super) {
    __extends(MsgMap, _super);
    function MsgMap(value) {
        var _this = _super.call(this) || this;
        var array = _this.array = [];
        Object.keys(value).forEach(function (key) {
            var val = value[key];
            array.push(createMsgpack(key), createMsgpack(val));
        });
        _this.msgpackLength = array.reduce(function (total, msg) { return total + msg.msgpackLength; }, 5);
        return _this;
    }
    MsgMap.prototype.writeMsgpackTo = function (buffer, offset) {
        var array = this.array;
        var length = array.length / 2;
        var pos = offset;
        if (length < 16) {
            buffer[pos++] = 0x80 | length;
        }
        else if (length < 65536) {
            buffer[pos++] = 0xde;
            pos = buffer.writeUInt16BE(length, pos);
        }
        else {
            buffer[pos++] = 0xdf;
            pos = buffer.writeUInt32BE(length, pos);
        }
        return array.reduce(function (pos, msg) { return pos + msg.writeMsgpackTo(buffer, pos); }, pos) - offset;
    };
    return MsgMap;
}(msg_interface_1.Msg));
exports.MsgMap = MsgMap;
var MsgNil = /** @class */ (function (_super) {
    __extends(MsgNil, _super);
    function MsgNil() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MsgNil.prototype.writeMsgpackTo = function (buffer, offset) {
        buffer[offset] = 0xc0;
        return 1;
    };
    return MsgNil;
}(MsgValue));
exports.MsgNil = MsgNil;
var MsgBoolean = /** @class */ (function (_super) {
    __extends(MsgBoolean, _super);
    function MsgBoolean(value) {
        return _super.call(this, value) || this;
    }
    MsgBoolean.prototype.writeMsgpackTo = function (buffer, offset) {
        buffer[offset] = this.value ? 0xc3 : 0xc2;
        return 1;
    };
    return MsgBoolean;
}(MsgValue));
exports.MsgBoolean = MsgBoolean;
var MsgFixInt = /** @class */ (function (_super) {
    __extends(MsgFixInt, _super);
    function MsgFixInt(value) {
        return _super.call(this, value) || this;
    }
    MsgFixInt.prototype.writeMsgpackTo = function (buffer, offset) {
        buffer[offset] = this.value & 255;
        return 1;
    };
    return MsgFixInt;
}(MsgValue));
exports.MsgFixInt = MsgFixInt;
var MsgInt8 = /** @class */ (function (_super) {
    __extends(MsgInt8, _super);
    function MsgInt8(value) {
        return _super.call(this, value) || this;
    }
    MsgInt8.prototype.writeMsgpackTo = function (buffer, offset) {
        buffer[offset] = 0xd0;
        buffer.writeInt8(+this.value, offset + 1);
        return 2;
    };
    return MsgInt8;
}(MsgValue));
exports.MsgInt8 = MsgInt8;
var MsgUInt8 = /** @class */ (function (_super) {
    __extends(MsgUInt8, _super);
    function MsgUInt8(value) {
        return _super.call(this, value) || this;
    }
    MsgUInt8.prototype.writeMsgpackTo = function (buffer, offset) {
        buffer[offset] = 0xcc;
        buffer.writeUInt8(+this.value, offset + 1);
        return 2;
    };
    return MsgUInt8;
}(MsgValue));
exports.MsgUInt8 = MsgUInt8;
var MsgInt16 = /** @class */ (function (_super) {
    __extends(MsgInt16, _super);
    function MsgInt16(value) {
        return _super.call(this, value) || this;
    }
    MsgInt16.prototype.writeMsgpackTo = function (buffer, offset) {
        buffer[offset] = 0xd1;
        buffer.writeInt16BE(+this.value, offset + 1);
        return 3;
    };
    return MsgInt16;
}(MsgValue));
exports.MsgInt16 = MsgInt16;
var MsgUInt16 = /** @class */ (function (_super) {
    __extends(MsgUInt16, _super);
    function MsgUInt16(value) {
        return _super.call(this, value) || this;
    }
    MsgUInt16.prototype.writeMsgpackTo = function (buffer, offset) {
        buffer[offset] = 0xcd;
        buffer.writeUInt16BE(+this.value, offset + 1);
        return 3;
    };
    return MsgUInt16;
}(MsgValue));
exports.MsgUInt16 = MsgUInt16;
var MsgInt32 = /** @class */ (function (_super) {
    __extends(MsgInt32, _super);
    function MsgInt32(value) {
        return _super.call(this, value) || this;
    }
    MsgInt32.prototype.writeMsgpackTo = function (buffer, offset) {
        buffer[offset] = 0xd2;
        buffer.writeInt32BE(+this.value, offset + 1);
        return 5;
    };
    return MsgInt32;
}(MsgValue));
exports.MsgInt32 = MsgInt32;
var MsgUInt32 = /** @class */ (function (_super) {
    __extends(MsgUInt32, _super);
    function MsgUInt32(value) {
        return _super.call(this, value) || this;
    }
    MsgUInt32.prototype.writeMsgpackTo = function (buffer, offset) {
        buffer[offset] = 0xce;
        buffer.writeUInt32BE(+this.value, offset + 1);
        return 5;
    };
    return MsgUInt32;
}(MsgValue));
exports.MsgUInt32 = MsgUInt32;
var MsgFloat32 = /** @class */ (function (_super) {
    __extends(MsgFloat32, _super);
    function MsgFloat32(value) {
        return _super.call(this, value) || this;
    }
    MsgFloat32.prototype.writeMsgpackTo = function (buffer, offset) {
        buffer[offset] = 0xca;
        buffer.writeFloatBE(+this.value, offset + 1);
        return 5;
    };
    return MsgFloat32;
}(MsgValue));
exports.MsgFloat32 = MsgFloat32;
var MsgFloat64 = /** @class */ (function (_super) {
    __extends(MsgFloat64, _super);
    function MsgFloat64(value) {
        return _super.call(this, value) || this;
    }
    MsgFloat64.prototype.writeMsgpackTo = function (buffer, offset) {
        buffer[offset] = 0xcb;
        buffer.writeDoubleBE(+this.value, offset + 1);
        return 9;
    };
    return MsgFloat64;
}(MsgValue));
exports.MsgFloat64 = MsgFloat64;
var MsgString = /** @class */ (function (_super) {
    __extends(MsgString, _super);
    function MsgString(value) {
        var _this = _super.call(this, value) || this;
        // maximum byte length
        _this.msgpackLength = 5 + value.length * 3;
        return _this;
    }
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
}(MsgValue));
exports.MsgString = MsgString;
var MsgFixString = /** @class */ (function (_super) {
    __extends(MsgFixString, _super);
    function MsgFixString(value) {
        var _this = _super.call(this, value) || this;
        // maximum byte length
        _this.msgpackLength = 1 + value.length * 3;
        return _this;
    }
    MsgFixString.prototype.writeMsgpackTo = function (buffer, offset) {
        var length = buffer.write(this.value, offset + 1);
        buffer[offset] = 0xa0 | length;
        // actual byte length
        return 1 + length;
    };
    return MsgFixString;
}(MsgValue));
exports.MsgFixString = MsgFixString;
var MsgString8 = /** @class */ (function (_super) {
    __extends(MsgString8, _super);
    function MsgString8(value) {
        var _this = _super.call(this, value) || this;
        // maximum byte length
        _this.msgpackLength = 2 + value.length * 3;
        return _this;
    }
    MsgString8.prototype.writeMsgpackTo = function (buffer, offset) {
        buffer[offset] = 0xd9;
        var length = buffer.write(this.value, offset + 2);
        buffer.writeUInt8(length, offset + 1);
        // actual byte length
        return 2 + length;
    };
    return MsgString8;
}(MsgValue));
exports.MsgString8 = MsgString8;
var MsgString16 = /** @class */ (function (_super) {
    __extends(MsgString16, _super);
    function MsgString16(value) {
        var _this = _super.call(this, value) || this;
        // maximum byte length
        _this.msgpackLength = 3 + value.length * 3;
        return _this;
    }
    MsgString16.prototype.writeMsgpackTo = function (buffer, offset) {
        buffer[offset] = 0xda;
        var length = buffer.write(this.value, offset + 3);
        buffer.writeUInt16BE(length, offset + 1);
        // actual byte length
        return 3 + length;
    };
    return MsgString16;
}(MsgValue));
exports.MsgString16 = MsgString16;
var MsgString32 = /** @class */ (function (_super) {
    __extends(MsgString32, _super);
    function MsgString32(value) {
        var _this = _super.call(this, value) || this;
        // maximum byte length
        _this.msgpackLength = 5 + value.length * 3;
        return _this;
    }
    MsgString32.prototype.writeMsgpackTo = function (buffer, offset) {
        buffer[offset] = 0xdb;
        var length = buffer.write(this.value, offset + 5);
        buffer.writeUInt32BE(length, offset + 1);
        // actual byte length
        return 5 + length;
    };
    return MsgString32;
}(MsgValue));
exports.MsgString32 = MsgString32;
/**
 * constant length
 */
setMsgpackLength(MsgNil, 1);
setMsgpackLength(MsgBoolean, 1);
setMsgpackLength(MsgFixInt, 1);
setMsgpackLength(MsgInt8, 2);
setMsgpackLength(MsgUInt8, 2);
setMsgpackLength(MsgInt16, 3);
setMsgpackLength(MsgUInt16, 3);
setMsgpackLength(MsgInt32, 5);
setMsgpackLength(MsgUInt32, 5);
setMsgpackLength(msg_int64_1.MsgUInt64, 9);
setMsgpackLength(msg_int64_1.MsgInt64, 9);
setMsgpackLength(MsgFloat32, 5);
setMsgpackLength(MsgFloat64, 9);
/**
 * @private
 */
var typeMap = {
    boolean: fromBoolean,
    number: fromNumber,
    object: fromObject,
    string: fromString,
};
function createMsgpack(value) {
    var type = typeof value;
    var f = typeMap[type];
    if (!f)
        return;
    return f(value);
}
function fromBoolean(value) {
    return new MsgBoolean(value);
}
function fromString(value) {
    return new MsgString(value);
}
function fromObject(value) {
    if (value == null) {
        return new MsgNil();
    }
    if (msg_interface_1.isMsg(value)) {
        return value;
    }
    if (Array.isArray(value)) {
        return new MsgArray(value);
    }
    if (Buffer.isBuffer(value)) {
        return new MsgBinary(value);
    }
    if (msg_int64_1.MsgInt64.isInt64BE(value)) {
        return new msg_int64_1.MsgInt64(value.toBuffer());
    }
    if (msg_int64_1.MsgUInt64.isUint64BE(value)) {
        return new msg_int64_1.MsgUInt64(value.toBuffer());
    }
    return new MsgMap(value);
}
function fromNumber(value) {
    var isInteger = ((value | 0) === value) || (0 < value && value < UINT32_NEXT && !(value % 1));
    if (!isInteger) {
        return new MsgFloat64(value);
    }
    else if (-33 < value && value < 128) {
        return new MsgFixInt(value);
    }
    else if (value > 0) {
        if (value < 256) {
            return new MsgUInt8(value);
        }
        else if (value < UINT16_NEXT) {
            return new MsgUInt16(value);
        }
        else if (value < UINT32_NEXT) {
            return new MsgUInt32(value);
        }
    }
    else if (value < 0) {
        if (-129 < value) {
            return new MsgInt8(value);
        }
        else if (-32769 < value) {
            return new MsgInt16(value);
        }
        else {
            return new MsgInt32(value);
        }
    }
}
function setMsgpackLength(msgClass, msgpackLength) {
    msgClass.prototype.msgpackLength = msgpackLength;
}
