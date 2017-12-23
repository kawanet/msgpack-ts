"use strict";

import {isMsg, MsgInterface} from "msg-interface";
import {MsgInt64, MsgUInt64} from "msg-int64";

import {MsgArray} from "./msg-array";
import {MsgBinary} from "./msg-binary";
import {MsgBoolean} from "./msg-boolean";
import {MsgMap} from "./msg-map";
import * as N from "./msg-number";
import {MsgNil} from "./msg-nil";
import {MsgString} from "./msg-string";

const UINT16_NEXT = 0x10000;
const UINT32_NEXT = 0x100000000;

type Encoder = (value: any) => MsgInterface;

const typeMap = {
    boolean: MsgBoolean.encode,
    number: encodeNumber,
    object: encodeObject,
    string: (value: string) => new MsgString(value),
};

export function encodeMsgpack(value: any): MsgInterface {
    const type = typeof value;
    const f: Encoder = typeMap[type];
    if (f) return f(value);
}

function encodeNumber(value: number): MsgInterface {
    const isInteger = ((value | 0) === value) || (0 < value && value < UINT32_NEXT && !(value % 1));

    if (!isInteger) {
        return new N.MsgFloat64(value);
    } else if (-33 < value && value < 128) {
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

function encodeObject(value: object): MsgInterface {
    if (value == null) {
        return new MsgNil();
    }

    if (isMsg(value)) {
        return value as MsgInterface;
    }

    if (Array.isArray(value)) {
        return new MsgArray(value);
    }

    if (Buffer.isBuffer(value)) {
        return new MsgBinary(value);
    }

    if (MsgInt64.isInt64BE(value)) {
        return new MsgInt64(value.toBuffer());
    }

    if (MsgUInt64.isUint64BE(value)) {
        return new MsgUInt64(value.toBuffer());
    }

    return new MsgMap(value);
}
