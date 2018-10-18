import {Msg, MsgInterface} from "msg-interface";

export abstract class MsgValue extends Msg {
    constructor(value?: any) {
        super();
        this.value = value;
    }

    static parse(buffer: Buffer, offset?: number): MsgInterface {
        offset = 0 | offset as number;
        const token = buffer[offset];
        const f = decoders[token];
        return f && f(buffer, offset);
    }

    static fromAny(value: any): MsgInterface {
        const type = typeof value;
        const f = encoders[type];
        return f && f(value);
    }

    valueOf() {
        return this.value;
    }

    value: any;
}

MsgValue.prototype.value = void 0;

import {initDecoders} from "./decoder";
import {initEncoders} from "./encoder";

const decoders = initDecoders();
const encoders = initEncoders();
