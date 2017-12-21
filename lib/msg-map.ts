import {Msg, MsgInterface} from "msg-interface";
import {encodeMsgpack} from "./encode";

export class MsgMap extends Msg {
    constructor(value: object) {
        super();
        const array = this.array = [];
        Object.keys(value).forEach((key) => {
            const val = value[key];
            array.push(encodeMsgpack(key), encodeMsgpack(val));
        });
        this.msgpackLength = array.reduce((total: number, msg: MsgInterface) => total + msg.msgpackLength, 5);
    }

    writeMsgpackTo(buffer: Buffer, offset?: number) {
        const array = this.array;
        const length = array.length / 2;
        let pos = offset;
        if (length < 16) {
            buffer[pos++] = 0x80 | length;
        } else if (length < 65536) {
            buffer[pos++] = 0xde;
            pos = buffer.writeUInt16BE(length, pos);
        } else {
            buffer[pos++] = 0xdf;
            pos = buffer.writeUInt32BE(length, pos);
        }
        return array.reduce((pos, msg) => pos + msg.writeMsgpackTo(buffer, pos), pos) - offset;
    }

    array: MsgInterface[];
}
