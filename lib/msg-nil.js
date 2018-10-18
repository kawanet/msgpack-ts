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
var MsgNil = /** @class */ (function (_super) {
    __extends(MsgNil, _super);
    function MsgNil() {
        return _super.call(this, null) || this;
    }
    MsgNil.from = function (_buffer, _offset) {
        return new MsgNil();
    };
    MsgNil.encode = function (_value) {
        return new MsgNil();
    };
    MsgNil.prototype.writeMsgpackTo = function (buffer, offset) {
        buffer[offset] = 0xc0;
        return 1;
    };
    return MsgNil;
}(msg_value_1.MsgValue));
exports.MsgNil = MsgNil;
(function (P) {
    P.msgpackLength = 1;
    P.value = null;
})(MsgNil.prototype);
