import {Msg} from "msg-interface";

export abstract class MsgValue extends Msg {
    constructor(value?: any) {
        super();
        this.value = value;
    }

    valueOf() {
        return this.value;
    }

    value: any;
}

MsgValue.prototype.value = void 0;
