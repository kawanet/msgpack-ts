"use strict";

import {isMsg, MsgInterface} from "msg-interface";
import * as N from "msg-number";

import {MsgArray16, MsgArray32, MsgFixArray} from "./msg-array";
import {MsgBinary} from "./msg-binary";
import {MsgBoolean} from "./msg-boolean";
import {MsgFixMap, MsgMap16, MsgMap32} from "./msg-map";
import {MsgNil} from "./msg-nil";
import {MsgString} from "./msg-string";

const UINT16_NEXT = 0x10000;
const UINT32_NEXT = 0x100000000;

type Encoder = (value: any) => MsgInterface;
type Encoders = { [type: string]: Encoder };

const encoders: Encoders = {
    boolean: (value: boolean) => new MsgBoolean(value),
    number: encodeNumber,
    object: encodeObject,
    string: (value: string) => new MsgString(value),
};

export function encodeMsg(value: any): MsgInterface {
    const type = typeof value;
    const f = encoders[type];
    return f && f(value);
}

function encodeNumber(value: number): MsgInterface {
    const isInteger = ((value | 0) === value) || (0 < value && value < UINT32_NEXT && !(value % 1));

    if (isInteger) {
        if (-33 < value && value < 128) {
            return new N.MsgFixInt(value);
        } else if (value > 0) {
            if (value < 256) {
                return new N.MsgUInt8(value);
            } else if (value < UINT16_NEXT) {
                return new N.MsgUInt16(value);
            } else if (value < UINT32_NEXT) {
                return new N.MsgUInt32(value);
            }
        } else if (value < 0) {
            if (-129 < value) {
                return new N.MsgInt8(value);
            } else if (-32769 < value) {
                return new N.MsgInt16(value);
            } else {
                return new N.MsgInt32(value);
            }
        }
    }

    return new N.MsgFloat64(value);
}

function encodeObject(value: object): MsgInterface {
    if (value == null) {
        return new MsgNil();
    }

    if (isMsg(value)) {
        return value as MsgInterface;
    }

    if (Array.isArray(value)) {
        const length = value.length;
        const MsgArray = (length < 16) ? MsgFixArray : (length < 65536) ? MsgArray16 : MsgArray32;
        const msg = new MsgArray();
        value.forEach(item => msg.add(encodeMsg(item)));
        return msg;
    }

    if (Buffer.isBuffer(value)) {
        return new MsgBinary(value);
    }

    if (N.MsgInt64.isInt64BE(value)) {
        return new N.MsgInt64(value.toBuffer());
    }

    if (N.MsgUInt64.isUint64BE(value)) {
        return new N.MsgUInt64(value.toBuffer());
    }

    {
        const array = Object.keys(value);
        const length = array.length / 2;
        const MsgMap = (length < 16) ? MsgFixMap : (length < 65536) ? MsgMap16 : MsgMap32;
        const msg = new MsgMap();
        array.forEach(key => msg.set(encodeMsg(key), encodeMsg((value as any)[key])));
        return msg;
    }
}
