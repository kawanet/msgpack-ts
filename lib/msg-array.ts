import {Msg, MsgInterface} from "msg-interface";

import {MsgValue} from "./msg-value";

export class MsgArray extends Msg {
    constructor(value?: any[]) {
        super();
        if (!value) value = [];
        const array = this.array = [].map.call(value, (item: any) => MsgValue.fromAny(item));
        this.msgpackLength = array.reduce((total: number, msg: MsgInterface) => total + msg.msgpackLength, 5);
    }

    valueOf() {
        return this.array.map((msg) => msg.valueOf());
    }

    writeMsgpackTo(buffer: Buffer, offset: number): number {
        const length = this.array.length;
        const C = (length < 16) ? MsgFixArray : (length < 65536) ? MsgArray16 : MsgArray32;
        return C.prototype.writeMsgpackTo.call(this, buffer, offset);
    }

    array: MsgInterface[];
}

export class MsgFixArray extends MsgArray {

    static parse(buffer: Buffer, offset: number) {
        const length = buffer[offset] & 0x0f;
        return read(new MsgFixArray(), buffer, offset, offset + 1, length);
    }

    writeMsgpackTo(buffer: Buffer, offset: number): number {
        buffer[offset] = 0x90 | this.array.length;
        return write(this, buffer, offset, offset + 1);
    }
}

export class MsgArray16 extends MsgArray {

    static parse(buffer: Buffer, offset: number) {
        const length = buffer.readUInt16BE(offset + 1);
        return read(new MsgArray16(), buffer, offset, offset + 3, length);
    }

    writeMsgpackTo(buffer: Buffer, offset: number): number {
        buffer[offset] = 0xdc;
        const pos = buffer.writeUInt16BE(this.array.length, offset + 1);
        return write(this, buffer, offset, pos);
    }
}

export class MsgArray32 extends MsgArray {

    static parse(buffer: Buffer, offset: number) {
        const length = buffer.readUInt32BE(offset + 1);
        return read(new MsgArray32(), buffer, offset, offset + 5, length);
    }

    writeMsgpackTo(buffer: Buffer, offset: number): number {
        buffer[offset] = 0xdd;
        const pos = buffer.writeUInt32BE(this.array.length, offset + 1);
        return write(this, buffer, offset, pos);
    }
}

function read(self: MsgArray, buffer: Buffer, offset: number, start: number, length: number) {
    for (let i = 0; i < length; i++) {
        const msg = self.array[i] = MsgValue.parse(buffer, start);
        start += msg.msgpackLength;
    }

    self.msgpackLength = start - offset;

    return self;
}

function write(self: MsgArray, buffer: Buffer, offset: number, start: number): number {
    return self.array.reduce((pos, msg) => pos + msg.writeMsgpackTo(buffer, pos), start) - offset;
}
