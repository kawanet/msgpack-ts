import {MsgInterface} from "msg-interface";

export abstract class MsgValue implements MsgInterface {
    protected constructor(value?: any) {
        this.value = value;
    }

    abstract writeMsgpackTo(buffer: Buffer, offset?: number): number;

    valueOf() {
        return this.value;
    }

    value: any;

    msgpackLength: number;
}

MsgValue.prototype.value = void 0;
