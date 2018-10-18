"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var msg_interface_1 = require("msg-interface");
var m = require("../");
var TITLE = __filename.split("/").pop();
var atos = function (array) { return [].map.call(array, function (v) { return (v > 15 ? "" : "0") + v.toString(16); }).join("-"); };
var mtos = function (msg) { return atos(msg_interface_1.msgToBuffer(msg)); };
describe(TITLE, function () {
    it("MsgNil", function () {
        var msg = new m.MsgNil();
        assert(msg_interface_1.isMsg(msg));
        assert.equal(msg.valueOf(), null);
        assert.equal(msg.msgpackLength, 1);
        assert.equal(mtos(msg), "c0");
    });
    it("MsgBoolean(true)", function () {
        var msg = new m.MsgBoolean(true);
        assert(msg_interface_1.isMsg(msg));
        assert.equal(msg, true);
        assert.equal(msg.msgpackLength, 1);
        assert.equal(mtos(msg), "c3");
    });
    it("MsgBoolean(false)", function () {
        var msg = new m.MsgBoolean(false);
        assert(msg_interface_1.isMsg(msg));
        assert.equal(msg, false);
        assert.equal(msg.msgpackLength, 1);
        assert.equal(mtos(msg), "c2");
    });
    it("MsgFixInt", function () {
        var msg = new m.MsgFixInt(-1);
        assert(msg_interface_1.isMsg(msg));
        assert.equal(msg, -1);
        assert.equal(msg.msgpackLength, 1);
        assert.equal(mtos(msg), "ff");
        assert.equal(mtos(new m.MsgFixInt(0)), "00");
        assert.equal(mtos(new m.MsgFixInt(1)), "01");
        assert.equal(mtos(new m.MsgFixInt(127)), "7f");
        assert.equal(atos(m.encode(127)), "7f");
    });
    it("MsgInt8", function () {
        var msg = new m.MsgInt8(-1);
        assert(msg_interface_1.isMsg(msg));
        assert.equal(msg, -1);
        assert.equal(msg.msgpackLength, 2);
        assert.equal(mtos(msg), "d0-ff");
        assert.equal(mtos(new m.MsgInt8(0)), "d0-00");
        assert.equal(mtos(new m.MsgInt8(1)), "d0-01");
        assert.equal(mtos(new m.MsgInt8(127)), "d0-7f");
    });
    it("MsgUInt8", function () {
        var msg = new m.MsgUInt8(1);
        assert(msg_interface_1.isMsg(msg));
        assert.equal(msg, 1);
        assert.equal(msg.msgpackLength, 2);
        assert.equal(mtos(msg), "cc-01");
        assert.equal(mtos(new m.MsgUInt8(0)), "cc-00");
        assert.equal(mtos(new m.MsgUInt8(255)), "cc-ff");
    });
    it("MsgInt16", function () {
        var msg = new m.MsgInt16(-1);
        assert(msg_interface_1.isMsg(msg));
        assert.equal(msg, -1);
        assert.equal(msg.msgpackLength, 3);
        assert.equal(mtos(msg), "d1-ff-ff");
        assert.equal(mtos(new m.MsgInt16(0)), "d1-00-00");
        assert.equal(mtos(new m.MsgInt16(32767)), "d1-7f-ff");
        assert.equal(mtos(new m.MsgInt16(-32768)), "d1-80-00");
    });
    it("MsgUInt16", function () {
        var msg = new m.MsgUInt16(1);
        assert(msg_interface_1.isMsg(msg));
        assert.equal(msg, 1);
        assert.equal(msg.msgpackLength, 3);
        assert.equal(mtos(msg), "cd-00-01");
        assert.equal(mtos(new m.MsgUInt16(0)), "cd-00-00");
        assert.equal(mtos(new m.MsgUInt16(65535)), "cd-ff-ff");
    });
    it("MsgInt32", function () {
        var msg = new m.MsgInt32(-1);
        assert(msg_interface_1.isMsg(msg));
        assert.equal(msg, -1);
        assert.equal(msg.msgpackLength, 5);
        assert.equal(mtos(msg), "d2-ff-ff-ff-ff");
        assert.equal(mtos(new m.MsgInt32(0)), "d2-00-00-00-00");
        assert.equal(mtos(new m.MsgInt32(2147483647)), "d2-7f-ff-ff-ff");
        assert.equal(mtos(new m.MsgInt32(-2147483648)), "d2-80-00-00-00");
    });
    it("MsgUInt32", function () {
        var msg = new m.MsgUInt32(1);
        assert(msg_interface_1.isMsg(msg));
        assert.equal(msg, 1);
        assert.equal(msg.msgpackLength, 5);
        assert.equal(mtos(msg), "ce-00-00-00-01");
        assert.equal(mtos(new m.MsgUInt32(0)), "ce-00-00-00-00");
        assert.equal(mtos(new m.MsgUInt32(4294967295)), "ce-ff-ff-ff-ff");
    });
    it("MsgFloat32", function () {
        var msg = new m.MsgFloat32(0.5);
        assert(msg_interface_1.isMsg(msg));
        assert.equal(msg, 0.5);
        assert.equal(msg.msgpackLength, 5);
        assert.equal(mtos(msg), "ca-3f-00-00-00");
    });
    it("MsgFloat64", function () {
        var msg = new m.MsgFloat64(0.5);
        assert(msg_interface_1.isMsg(msg));
        assert.equal(msg, 0.5);
        assert.equal(msg.msgpackLength, 9);
        assert.equal(mtos(msg), "cb-3f-e0-00-00-00-00-00-00");
    });
    it("MsgFixString", function () {
        var msg = new m.MsgFixString("ABC");
        assert(msg_interface_1.isMsg(msg));
        assert.equal(msg, "ABC");
        assert.equal(mtos(msg), "a3-41-42-43");
    });
    it("MsgString8", function () {
        var msg = new m.MsgString8("ABC");
        assert(msg_interface_1.isMsg(msg));
        assert.equal(msg, "ABC");
        assert.equal(mtos(msg), "d9-03-41-42-43");
    });
    it("MsgString16", function () {
        var msg = new m.MsgString16("ABC");
        assert(msg_interface_1.isMsg(msg));
        assert.equal(msg, "ABC");
        assert.equal(mtos(msg), "da-00-03-41-42-43");
    });
    it("MsgString32", function () {
        var msg = new m.MsgString32("ABC");
        assert(msg_interface_1.isMsg(msg));
        assert.equal(msg, "ABC");
        assert.equal(mtos(msg), "db-00-00-00-03-41-42-43");
    });
    it("MsgString", function () {
        var msg = new m.MsgString("ABC");
        assert(msg_interface_1.isMsg(msg));
        assert.equal(msg, "ABC");
        assert.equal(mtos(msg), "a3-41-42-43");
    });
});
