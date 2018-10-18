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
var MsgBoolean = /** @class */ (function (_super) {
    __extends(MsgBoolean, _super);
    function MsgBoolean(value) {
        return _super.call(this, value) || this;
    }
    MsgBoolean.from = function (buffer, offset) {
        var lsb = buffer[0 | offset] & 1;
        return new MsgBoolean(!!lsb);
    };
    MsgBoolean.encode = function (value) {
        return new MsgBoolean(value);
    };
    MsgBoolean.prototype.writeMsgpackTo = function (buffer, offset) {
        buffer[offset] = this.value ? 0xc3 : 0xc2;
        return 1;
    };
    return MsgBoolean;
}(msg_value_1.MsgValue));
exports.MsgBoolean = MsgBoolean;
(function (P) {
    P.msgpackLength = 1;
})(MsgBoolean.prototype);
