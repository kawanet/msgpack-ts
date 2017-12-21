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
var msg_value_1 = require("./msg-value");
var UINT16_NEXT = 0x10000;
var UINT32_NEXT = 0x100000000;
function encodeNumber(value) {
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
exports.encodeNumber = encodeNumber;
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
}(msg_value_1.MsgValue));
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
}(msg_value_1.MsgValue));
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
}(msg_value_1.MsgValue));
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
}(msg_value_1.MsgValue));
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
}(msg_value_1.MsgValue));
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
}(msg_value_1.MsgValue));
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
}(msg_value_1.MsgValue));
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
}(msg_value_1.MsgValue));
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
}(msg_value_1.MsgValue));
exports.MsgFloat64 = MsgFloat64;
/**
 * constant length
 */
setMsgpackLength(MsgFixInt, 1);
setMsgpackLength(MsgInt8, 2);
setMsgpackLength(MsgUInt8, 2);
setMsgpackLength(MsgInt16, 3);
setMsgpackLength(MsgUInt16, 3);
setMsgpackLength(MsgInt32, 5);
setMsgpackLength(MsgUInt32, 5);
setMsgpackLength(MsgFloat32, 5);
setMsgpackLength(MsgFloat64, 9);
function setMsgpackLength(msgClass, msgpackLength) {
    msgClass.prototype.msgpackLength = msgpackLength;
}
