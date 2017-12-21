import {Msg, MsgInterface} from "msg-interface";
import {encodeMsgpack} from "./encode";

export class MsgArray extends Msg {
    constructor(value: any[]) {
        super();
        const array = this.array = [].map.call(value, (item) => encodeMsgpack(item));
        this.msgpackLength = array.reduce((total: number, msg: MsgInterface) => total + msg.msgpackLength, 5);
    }

    writeMsgpackTo(buffer: Buffer, offset?: number) {
        const array = this.array;
        const length = array.length;
        let pos = offset;
        if (length < 16) {
            buffer[pos++] = 0x90 | length;
        } else if (length < 65536) {
            buffer[pos++] = 0xdc;
            pos = buffer.writeUInt16BE(length, pos);
        } else {
            buffer[pos++] = 0xdd;
            pos = buffer.writeUInt32BE(length, pos);
        }
        return array.reduce((pos, msg) => pos + msg.writeMsgpackTo(buffer, pos), pos) - offset;
    }

    array: MsgInterface[];
}
