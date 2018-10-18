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
var msg_interface_1 = require("msg-interface");
var MsgValue = /** @class */ (function (_super) {
    __extends(MsgValue, _super);
    function MsgValue(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    MsgValue.parse = function (buffer, offset) {
        offset = 0 | offset;
        var token = buffer[offset];
        var f = decoders[token];
        return f && f(buffer, offset);
    };
    MsgValue.fromAny = function (value) {
        var type = typeof value;
        var f = encoders[type];
        return f && f(value);
    };
    MsgValue.prototype.valueOf = function () {
        return this.value;
    };
    return MsgValue;
}(msg_interface_1.Msg));
exports.MsgValue = MsgValue;
MsgValue.prototype.value = void 0;
var decoder_1 = require("./decoder");
var encoder_1 = require("./encoder");
var decoders = decoder_1.initDecoders();
var encoders = encoder_1.initEncoders();
