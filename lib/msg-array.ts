import {Msg, MsgInterface} from "msg-interface";

export class MsgArray extends Msg {
    msgpackLength = 5;
    protected array = [] as MsgInterface[];

    add(value: MsgInterface) {
        this.array.push(value);
        this.msgpackLength += value.msgpackLength;
    }

    valueOf() {
        return this.array.map((msg) => msg.valueOf());
    }

    writeMsgpackTo(buffer: Buffer, offset: number): number {
        const length = this.array.length;
        const C = (length < 16) ? MsgFixArray : (length < 65536) ? MsgArray16 : MsgArray32;
        return C.prototype.writeMsgpackTo.call(this, buffer, offset);
    }
}

export class MsgFixArray extends MsgArray {
    msgpackLength = 1;

    writeMsgpackTo(buffer: Buffer, offset: number): number {
        buffer[offset] = 0x90 | this.array.length;
        return write(this.array, buffer, offset, offset + 1);
    }
}

export class MsgArray16 extends MsgArray {
    msgpackLength = 3;

    writeMsgpackTo(buffer: Buffer, offset: number): number {
        buffer[offset] = 0xdc;
        const pos = buffer.writeUInt16BE(this.array.length, offset + 1);
        return write(this.array, buffer, offset, pos);
    }
}

export class MsgArray32 extends MsgArray {
    writeMsgpackTo(buffer: Buffer, offset: number): number {
        buffer[offset] = 0xdd;
        const pos = buffer.writeUInt32BE(this.array.length, offset + 1);
        return write(this.array, buffer, offset, pos);
    }
}

function write(array: MsgInterface[], buffer: Buffer, offset: number, start: number): number {
    return array.reduce((pos, msg) => pos + msg.writeMsgpackTo(buffer, pos), start) - offset;
}
