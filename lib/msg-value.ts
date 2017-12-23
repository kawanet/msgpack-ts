import {Msg, MsgInterface} from "msg-interface";

export abstract class MsgValue extends Msg {
    constructor(value?: any) {
        super();
        this.value = value;
    }

    static decode(buffer: Buffer, offset?: number): MsgInterface {
        offset = +offset || 0;
        const token = buffer[offset];
        const f = decoders[token];
        if (f) return f(buffer, offset);
    }

    static encode(value: any): MsgInterface {
        const type = typeof value;
        const f = encoders[type];
        if (f) return f(value);
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
