import {Msg, MsgInterface} from "msg-interface";

import {MsgValue} from "./msg-value";
import {MsgString} from "./msg-string";

export class MsgMap extends Msg {
    constructor(value?: object) {
        super();
        if (!value) value = {};
        const array = this.array = [] as MsgInterface[];
        Object.keys(value).forEach((key: string) => {
            const val = MsgValue.fromAny((value as any)[key]);
            if (val) array.push(new MsgString(key), val);
        });
        this.msgpackLength = array.reduce((total: number, msg: MsgInterface) => total + msg.msgpackLength, 5);
    }

    valueOf() {
        const array = this.array;
        const length = array.length;
        const obj = {} as { [key: string]: any };
        for (let i = 0; i < length;) {
            const key = array[i++];
            const val = array[i++];
            obj[key.valueOf() as string] = val.valueOf();
        }
        return obj;
    }

    writeMsgpackTo(buffer: Buffer, offset: number): number {
        const length = this.array.length / 2;
        const C = (length < 16) ? MsgFixMap : (length < 65536) ? MsgMap16 : MsgMap32;
        return C.prototype.writeMsgpackTo.call(this, buffer, offset);
    }

    array: MsgInterface[];
}

export class MsgFixMap extends MsgMap {
    static parse(buffer: Buffer, offset: number): MsgFixMap {
        const length = buffer[offset] & 0x0f;
        return read(new MsgFixMap(), buffer, offset, offset + 1, length);
    }

    writeMsgpackTo(buffer: Buffer, offset: number): number {
        const length = this.array.length / 2;
        buffer[offset] = 0x80 | length;
        const pos = offset + 1;
        return write(this, buffer, offset, pos);
    }
}

export class MsgMap16 extends MsgMap {
    static parse(buffer: Buffer, offset: number): MsgMap16 {
        const length = buffer.readUInt16BE(offset + 1);
        return read(new MsgMap16(), buffer, offset, offset + 3, length);
    }

    writeMsgpackTo(buffer: Buffer, offset: number): number {
        const length = this.array.length / 2;
        buffer[offset] = 0xde;
        const pos = buffer.writeUInt16BE(length, offset + 1);
        return write(this, buffer, offset, pos);
    }
}

export class MsgMap32 extends MsgMap {
    static parse(buffer: Buffer, offset: number) {
        const length = buffer.readUInt32BE(offset + 1);
        return read(new MsgMap32(), buffer, offset, offset + 5, length);
    }

    writeMsgpackTo(buffer: Buffer, offset: number): number {
        const length = this.array.length / 2;
        buffer[offset] = 0xdf;
        const pos = buffer.writeUInt32BE(length, offset + 1);
        return write(this, buffer, offset, pos);
    }
}

function read(self: MsgMap, buffer: Buffer, offset: number, start: number, length: number) {
    const array = self.array;

    for (let i = 0; i < length; i++) {
        const key = MsgValue.parse(buffer, start);
        start += key.msgpackLength;
        const val = MsgValue.parse(buffer, start);
        start += val.msgpackLength;
        array.push(key, val);
    }

    self.msgpackLength = start - offset;

    return self;
}

function write(self: MsgMap, buffer: Buffer, offset: number, start: number): number {
    return self.array.reduce((pos, msg) => pos + msg.writeMsgpackTo(buffer, pos), start) - offset;
}
