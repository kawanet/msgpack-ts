import {Msg, MsgInterface} from "msg-interface";

export class MsgMap extends Msg {
    msgpackLength = 5;
    protected array = [] as MsgInterface[];

    set(key: MsgInterface, value: MsgInterface) {
        this.array.push(key, value);
        this.msgpackLength += key.msgpackLength + value.msgpackLength;
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
}

export class MsgFixMap extends MsgMap {
    msgpackLength = 1;

    writeMsgpackTo(buffer: Buffer, offset: number): number {
        const length = this.array.length / 2;
        buffer[offset] = 0x80 | length;
        const pos = offset + 1;
        return write(this.array, buffer, offset, pos);
    }
}

export class MsgMap16 extends MsgMap {
    msgpackLength = 3;

    writeMsgpackTo(buffer: Buffer, offset: number): number {
        const length = this.array.length / 2;
        buffer[offset] = 0xde;
        const pos = buffer.writeUInt16BE(length, offset + 1);
        return write(this.array, buffer, offset, pos);
    }
}

export class MsgMap32 extends MsgMap {
    writeMsgpackTo(buffer: Buffer, offset: number): number {
        const length = this.array.length / 2;
        buffer[offset] = 0xdf;
        const pos = buffer.writeUInt32BE(length, offset + 1);
        return write(this.array, buffer, offset, pos);
    }
}

function write(array: MsgInterface[], buffer: Buffer, offset: number, start: number): number {
    return array.reduce((pos, msg) => pos + msg.writeMsgpackTo(buffer, pos), start) - offset;
}
