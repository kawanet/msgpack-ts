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
var encode_1 = require("./encode");
var MsgArray = /** @class */ (function (_super) {
    __extends(MsgArray, _super);
    function MsgArray(value) {
        var _this = _super.call(this) || this;
        var array = _this.array = [].map.call(value, function (item) { return encode_1.encodeMsgpack(item); });
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
