"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var msg_interface_1 = require("msg-interface");
var m = require("../");
var TITLE = __filename.split("/").pop();
describe(TITLE, function () {
    it("MsgNil", function () {
        var msg = new m.MsgNil();
        assert(msg_interface_1.isMsg(msg));
        assert.equal(msg.valueOf(), null);
        assert.equal(msg.msgpackLength, 1);
        assert.equal(atos(msg.toMsgpack()), "c0");
    });
    it("MsgBoolean(true)", function () {
        var msg = new m.MsgBoolean(true);
        assert(msg_interface_1.isMsg(msg));
        assert.equal(msg, true);
        assert.equal(msg.msgpackLength, 1);
        assert.equal(atos(msg.toMsgpack()), "c3");
    });
    it("MsgBoolean(false)", function () {
        var msg = new m.MsgBoolean(false);
        assert(msg_interface_1.isMsg(msg));
        assert.equal(msg, false);
        assert.equal(msg.msgpackLength, 1);
        assert.equal(atos(msg.toMsgpack()), "c2");
    });
    it("MsgFixInt", function () {
        var msg = new m.MsgFixInt(-1);
        assert(msg_interface_1.isMsg(msg));
        assert.equal(msg, -1);
        assert.equal(msg.msgpackLength, 1);
        assert.equal(atos(msg.toMsgpack()), "ff");
        assert.equal(atos(new m.MsgFixInt(0).toMsgpack()), "00");
        assert.equal(atos(new m.MsgFixInt(1).toMsgpack()), "01");
        assert.equal(atos(new m.MsgFixInt(127).toMsgpack()), "7f");
        assert.equal(atos(m.encode(127)), "7f");
    });
    it("MsgInt8", function () {
        var msg = new m.MsgInt8(-1);
        assert(msg_interface_1.isMsg(msg));
        assert.equal(msg, -1);
        assert.equal(msg.msgpackLength, 2);
        assert.equal(atos(msg.toMsgpack()), "d0-ff");
        assert.equal(atos(new m.MsgInt8(0).toMsgpack()), "d0-00");
        assert.equal(atos(new m.MsgInt8(1).toMsgpack()), "d0-01");
        assert.equal(atos(new m.MsgInt8(127).toMsgpack()), "d0-7f");
    });
    it("MsgUInt8", function () {
        var msg = new m.MsgUInt8(1);
        assert(msg_interface_1.isMsg(msg));
        assert.equal(msg, 1);
        assert.equal(msg.msgpackLength, 2);
        assert.equal(atos(msg.toMsgpack()), "cc-01");
        assert.equal(atos(new m.MsgUInt8(0).toMsgpack()), "cc-00");
        assert.equal(atos(new m.MsgUInt8(255).toMsgpack()), "cc-ff");
    });
    it("MsgInt16", function () {
        var msg = new m.MsgInt16(-1);
        assert(msg_interface_1.isMsg(msg));
        assert.equal(msg, -1);
        assert.equal(msg.msgpackLength, 3);
        assert.equal(atos(msg.toMsgpack()), "d1-ff-ff");
        assert.equal(atos(new m.MsgInt16(0).toMsgpack()), "d1-00-00");
        assert.equal(atos(new m.MsgInt16(32767).toMsgpack()), "d1-7f-ff");
        assert.equal(atos(new m.MsgInt16(-32768).toMsgpack()), "d1-80-00");
    });
    it("MsgUInt16", function () {
        var msg = new m.MsgUInt16(1);
        assert(msg_interface_1.isMsg(msg));
        assert.equal(msg, 1);
        assert.equal(msg.msgpackLength, 3);
        assert.equal(atos(msg.toMsgpack()), "cd-00-01");
        assert.equal(atos(new m.MsgUInt16(0).toMsgpack()), "cd-00-00");
        assert.equal(atos(new m.MsgUInt16(65535).toMsgpack()), "cd-ff-ff");
    });
    it("MsgInt32", function () {
        var msg = new m.MsgInt32(-1);
        assert(msg_interface_1.isMsg(msg));
        assert.equal(msg, -1);
        assert.equal(msg.msgpackLength, 5);
        assert.equal(atos(msg.toMsgpack()), "d2-ff-ff-ff-ff");
        assert.equal(atos(new m.MsgInt32(0).toMsgpack()), "d2-00-00-00-00");
        assert.equal(atos(new m.MsgInt32(2147483647).toMsgpack()), "d2-7f-ff-ff-ff");
        assert.equal(atos(new m.MsgInt32(-2147483648).toMsgpack()), "d2-80-00-00-00");
    });
    it("MsgUInt32", function () {
        var msg = new m.MsgUInt32(1);
        assert(msg_interface_1.isMsg(msg));
        assert.equal(msg, 1);
        assert.equal(msg.msgpackLength, 5);
        assert.equal(atos(msg.toMsgpack()), "ce-00-00-00-01");
        assert.equal(atos(new m.MsgUInt32(0).toMsgpack()), "ce-00-00-00-00");
        assert.equal(atos(new m.MsgUInt32(4294967295).toMsgpack()), "ce-ff-ff-ff-ff");
    });
    it("MsgFloat32", function () {
        var msg = new m.MsgFloat32(0.5);
        assert(msg_interface_1.isMsg(msg));
        assert.equal(msg, 0.5);
        assert.equal(msg.msgpackLength, 5);
        assert.equal(atos(msg.toMsgpack()), "ca-3f-00-00-00");
    });
    it("MsgFloat64", function () {
        var msg = new m.MsgFloat64(0.5);
        assert(msg_interface_1.isMsg(msg));
        assert.equal(msg, 0.5);
        assert.equal(msg.msgpackLength, 9);
        assert.equal(atos(msg.toMsgpack()), "cb-3f-e0-00-00-00-00-00-00");
    });
    it("MsgFixString", function () {
        var msg = new m.MsgFixString("ABC");
        assert(msg_interface_1.isMsg(msg));
        assert.equal(msg, "ABC");
        assert.equal(atos(msg.toMsgpack()), "a3-41-42-43");
    });
    it("MsgString8", function () {
        var msg = new m.MsgString8("ABC");
        assert(msg_interface_1.isMsg(msg));
        assert.equal(msg, "ABC");
        assert.equal(atos(msg.toMsgpack()), "d9-03-41-42-43");
    });
    it("MsgString16", function () {
        var msg = new m.MsgString16("ABC");
        assert(msg_interface_1.isMsg(msg));
        assert.equal(msg, "ABC");
        assert.equal(atos(msg.toMsgpack()), "da-00-03-41-42-43");
    });
    it("MsgString32", function () {
        var msg = new m.MsgString32("ABC");
        assert(msg_interface_1.isMsg(msg));
        assert.equal(msg, "ABC");
        assert.equal(atos(msg.toMsgpack()), "db-00-00-00-03-41-42-43");
    });
    it("MsgString", function () {
        var msg = new m.MsgString("ABC");
        assert(msg_interface_1.isMsg(msg));
        assert.equal(msg, "ABC");
        assert.equal(atos(msg.toMsgpack()), "a3-41-42-43");
    });
});
function atos(array) {
    return [].map.call(array, function (v) {
        return (v > 15 ? "" : "0") + v.toString(16);
    }).join("-");
}
