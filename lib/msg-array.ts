import {MsgInterface} from "msg-interface";

export interface MsgArrayInterface extends MsgInterface {
    add(value: MsgInterface): void;
}

abstract class MsgArray implements MsgArrayInterface {
    msgpackLength: number;

    protected array = [] as MsgInterface[];

    abstract writeMsgpackTo(buffer: Buffer, offset?: number): number;

    add(value: MsgInterface) {
        this.array.push(value);
        this.msgpackLength += value.msgpackLength;
    }

    valueOf() {
        return this.array.map((msg) => msg.valueOf());
    }
}

export class MsgFixArray extends MsgArray {
    writeMsgpackTo(buffer: Buffer, offset: number): number {
        const length = this.array.length;
        if (length > 15) throw new TypeError("Too many items: " + length);

        buffer[offset] = 0x90 | length;
        let pos = offset + 1;

        this.array.forEach(msg => pos += msg.writeMsgpackTo(buffer, pos));
        return pos - offset;
    }
}

export class MsgArray16 extends MsgArray {
    writeMsgpackTo(buffer: Buffer, offset: number): number {
        const length = this.array.length;
        if (length > 65535) throw new TypeError("Too many items: " + length);

        buffer[offset] = 0xdc;
        let pos = buffer.writeUInt16BE(length, offset + 1);

        this.array.forEach(msg => pos += msg.writeMsgpackTo(buffer, pos));
        return pos - offset;
    }
}

export class MsgArray32 extends MsgArray {
    writeMsgpackTo(buffer: Buffer, offset: number): number {
        const length = this.array.length;

        buffer[offset] = 0xdd;
        let pos = buffer.writeUInt32BE(length, offset + 1);

        this.array.forEach(msg => pos += msg.writeMsgpackTo(buffer, pos));
        return pos - offset;
    }
}

setMsgpackLength(MsgFixArray, 1);
setMsgpackLength(MsgArray16, 3);
setMsgpackLength(MsgArray32, 5);

function setMsgpackLength(msgClass: Function, msgpackLength: number) {
    msgClass.prototype.msgpackLength = msgpackLength;
}
