import * as assert from "assert";
import {isMsg, MsgInterface, msgToBuffer} from "msg-interface";
import * as m from "../";

const TITLE = __filename.split("/").pop() as string;

const atos = (array: any) => [].map.call(array, (v: number) => (v > 15 ? "" : "0") + v.toString(16)).join("-");
const mtos = (msg: MsgInterface) => atos(msgToBuffer(msg));

describe(TITLE, () => {
    it("MsgNil", () => {
        const msg = new m.MsgNil();
        assert(isMsg(msg));
        assert.equal(msg.valueOf(), null);
        assert.equal(msg.msgpackLength, 1);
        assert.equal(mtos(msg), "c0");
    });

    it("MsgBoolean(true)", () => {
        const msg = new m.MsgBoolean(true);
        assert(isMsg(msg));
        assert.equal(msg, true);
        assert.equal(msg.msgpackLength, 1);
        assert.equal(mtos(msg), "c3");
    });

    it("MsgBoolean(false)", () => {
        const msg = new m.MsgBoolean(false);
        assert(isMsg(msg));
        assert.equal(msg, false);
        assert.equal(msg.msgpackLength, 1);
        assert.equal(mtos(msg), "c2");
    });

    it("MsgFixInt", () => {
        const msg = new m.MsgFixInt(-1);
        assert(isMsg(msg));
        assert.equal(msg, -1);
        assert.equal(msg.msgpackLength, 1);
        assert.equal(mtos(msg), "ff");

        assert.equal(mtos(new m.MsgFixInt(0)), "00");
        assert.equal(mtos(new m.MsgFixInt(1)), "01");
        assert.equal(mtos(new m.MsgFixInt(127)), "7f");

        assert.equal(atos(m.encode(127)), "7f");
    });

    it("MsgInt8", () => {
        const msg = new m.MsgInt8(-1);
        assert(isMsg(msg));
        assert.equal(msg, -1);
        assert.equal(msg.msgpackLength, 2);
        assert.equal(mtos(msg), "d0-ff");

        assert.equal(mtos(new m.MsgInt8(0)), "d0-00");
        assert.equal(mtos(new m.MsgInt8(1)), "d0-01");
        assert.equal(mtos(new m.MsgInt8(127)), "d0-7f");
    });

    it("MsgUInt8", () => {
        const msg = new m.MsgUInt8(1);
        assert(isMsg(msg));
        assert.equal(msg, 1);
        assert.equal(msg.msgpackLength, 2);
        assert.equal(mtos(msg), "cc-01");

        assert.equal(mtos(new m.MsgUInt8(0)), "cc-00");
        assert.equal(mtos(new m.MsgUInt8(255)), "cc-ff");
    });

    it("MsgInt16", () => {
        const msg = new m.MsgInt16(-1);
        assert(isMsg(msg));
        assert.equal(msg, -1);
        assert.equal(msg.msgpackLength, 3);
        assert.equal(mtos(msg), "d1-ff-ff");

        assert.equal(mtos(new m.MsgInt16(0)), "d1-00-00");
        assert.equal(mtos(new m.MsgInt16(32767)), "d1-7f-ff");
        assert.equal(mtos(new m.MsgInt16(-32768)), "d1-80-00");
    });

    it("MsgUInt16", () => {
        const msg = new m.MsgUInt16(1);
        assert(isMsg(msg));
        assert.equal(msg, 1);
        assert.equal(msg.msgpackLength, 3);
        assert.equal(mtos(msg), "cd-00-01");

        assert.equal(mtos(new m.MsgUInt16(0)), "cd-00-00");
        assert.equal(mtos(new m.MsgUInt16(65535)), "cd-ff-ff");
    });

    it("MsgInt32", () => {
        const msg = new m.MsgInt32(-1);
        assert(isMsg(msg));
        assert.equal(msg, -1);
        assert.equal(msg.msgpackLength, 5);
        assert.equal(mtos(msg), "d2-ff-ff-ff-ff");

        assert.equal(mtos(new m.MsgInt32(0)), "d2-00-00-00-00");
        assert.equal(mtos(new m.MsgInt32(2147483647)), "d2-7f-ff-ff-ff");
        assert.equal(mtos(new m.MsgInt32(-2147483648)), "d2-80-00-00-00");
    });

    it("MsgUInt32", () => {
        const msg = new m.MsgUInt32(1);
        assert(isMsg(msg));
        assert.equal(msg, 1);
        assert.equal(msg.msgpackLength, 5);
        assert.equal(mtos(msg), "ce-00-00-00-01");

        assert.equal(mtos(new m.MsgUInt32(0)), "ce-00-00-00-00");
        assert.equal(mtos(new m.MsgUInt32(4294967295)), "ce-ff-ff-ff-ff");
    });

    it("MsgFloat32", () => {
        const msg = new m.MsgFloat32(0.5);
        assert(isMsg(msg));
        assert.equal(msg, 0.5);
        assert.equal(msg.msgpackLength, 5);
        assert.equal(mtos(msg), "ca-3f-00-00-00");
    });

    it("MsgFloat64", () => {
        const msg = new m.MsgFloat64(0.5);
        assert(isMsg(msg));
        assert.equal(msg, 0.5);
        assert.equal(msg.msgpackLength, 9);
        assert.equal(mtos(msg), "cb-3f-e0-00-00-00-00-00-00");
    });

    it("MsgFixString", () => {
        const msg = new m.MsgFixString("ABC");
        assert(isMsg(msg));
        assert.equal(msg, "ABC");
        assert.equal(mtos(msg), "a3-41-42-43");
    });

    it("MsgString8", () => {
        const msg = new m.MsgString8("ABC");
        assert(isMsg(msg));
        assert.equal(msg, "ABC");
        assert.equal(mtos(msg), "d9-03-41-42-43");
    });

    it("MsgString16", () => {
        const msg = new m.MsgString16("ABC");
        assert(isMsg(msg));
        assert.equal(msg, "ABC");
        assert.equal(mtos(msg), "da-00-03-41-42-43");
    });

    it("MsgString32", () => {
        const msg = new m.MsgString32("ABC");
        assert(isMsg(msg));
        assert.equal(msg, "ABC");
        assert.equal(mtos(msg), "db-00-00-00-03-41-42-43");
    });

    it("MsgString", () => {
        const msg = new m.MsgString("ABC");
        assert(isMsg(msg));
        assert.equal(msg, "ABC");
        assert.equal(mtos(msg), "a3-41-42-43");
    });
});
