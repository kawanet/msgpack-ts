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
        const length = this.array.length;
        buffer[offset] = 0x90 | length;
        let pos = offset + 1;
        this.array.forEach(msg => pos += msg.writeMsgpackTo(buffer, pos));
        return pos - offset;
    }
}

export class MsgArray16 extends MsgArray {
    msgpackLength = 3;

    writeMsgpackTo(buffer: Buffer, offset: number): number {
        buffer[offset] = 0xdc;
        let pos = buffer.writeUInt16BE(this.array.length, offset + 1);
        this.array.forEach(msg => pos += msg.writeMsgpackTo(buffer, pos));
        return pos - offset;
    }
}

export class MsgArray32 extends MsgArray {
    writeMsgpackTo(buffer: Buffer, offset: number): number {
        buffer[offset] = 0xdd;
        let pos = buffer.writeUInt32BE(this.array.length, offset + 1);
        this.array.forEach(msg => pos += msg.writeMsgpackTo(buffer, pos));
        return pos - offset;
    }
}
