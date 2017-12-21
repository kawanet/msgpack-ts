import {MsgValue} from "./msg-value";
import {MsgInterface} from "msg-interface";

const UINT16_NEXT = 0x10000;
const UINT32_NEXT = 0x100000000;

export function encodeNumber(value: number): MsgInterface {
    const isInteger = ((value | 0) === value) || (0 < value && value < UINT32_NEXT && !(value % 1));

    if (!isInteger) {
        return new MsgFloat64(value);
    } else if (-33 < value && value < 128) {
        return new MsgFixInt(value);
    } else if (value > 0) {
        if (value < 256) {
            return new MsgUInt8(value);
        } else if (value < UINT16_NEXT) {
            return new MsgUInt16(value);
        } else if (value < UINT32_NEXT) {
            return new MsgUInt32(value);
        }
    } else if (value < 0) {
        if (-129 < value) {
            return new MsgInt8(value);
        } else if (-32769 < value) {
            return new MsgInt16(value);
        } else {
            return new MsgInt32(value);
        }
    }
}

export class MsgFixInt extends MsgValue {
    constructor(value: number) {
        super(value);
    }

    writeMsgpackTo(buffer: Buffer, offset?: number) {
        buffer[offset] = this.value & 255;
        return 1;
    }
}

export class MsgInt8 extends MsgValue {
    constructor(value: number) {
        super(value);
    }

    writeMsgpackTo(buffer: Buffer, offset?: number) {
        buffer[offset] = 0xd0;
        buffer.writeInt8(+this.value, offset + 1);
        return 2;
    }
}

export class MsgUInt8 extends MsgValue {
    constructor(value: number) {
        super(value);
    }

    writeMsgpackTo(buffer: Buffer, offset?: number) {
        buffer[offset] = 0xcc;
        buffer.writeUInt8(+this.value, offset + 1);
        return 2;
    }
}

export class MsgInt16 extends MsgValue {
    constructor(value: number) {
        super(value);
    }

    writeMsgpackTo(buffer: Buffer, offset?: number) {
        buffer[offset] = 0xd1;
        buffer.writeInt16BE(+this.value, offset + 1);
        return 3;
    }
}

export class MsgUInt16 extends MsgValue {
    constructor(value: number) {
        super(value);
    }

    writeMsgpackTo(buffer: Buffer, offset?: number) {
        buffer[offset] = 0xcd;
        buffer.writeUInt16BE(+this.value, offset + 1);
        return 3;
    }
}

export class MsgInt32 extends MsgValue {
    constructor(value: number) {
        super(value);
    }

    writeMsgpackTo(buffer: Buffer, offset?: number) {
        buffer[offset] = 0xd2;
        buffer.writeInt32BE(+this.value, offset + 1);
        return 5;
    }
}

export class MsgUInt32 extends MsgValue {
    constructor(value: number) {
        super(value);
    }

    writeMsgpackTo(buffer: Buffer, offset?: number) {
        buffer[offset] = 0xce;
        buffer.writeUInt32BE(+this.value, offset + 1);
        return 5;
    }
}

export class MsgFloat32 extends MsgValue {
    constructor(value: number) {
        super(value);
    }

    writeMsgpackTo(buffer: Buffer, offset?: number) {
        buffer[offset] = 0xca;
        buffer.writeFloatBE(+this.value, offset + 1);
        return 5;
    }
}

export class MsgFloat64 extends MsgValue {
    constructor(value: number) {
        super(value);
    }

    writeMsgpackTo(buffer: Buffer, offset?: number) {
        buffer[offset] = 0xcb;
        buffer.writeDoubleBE(+this.value, offset + 1);
        return 9;
    }
}

/**
 * constant length
 */

setMsgpackLength(MsgFixInt, 1);
setMsgpackLength(MsgInt8, 2);
setMsgpackLength(MsgUInt8, 2);
setMsgpackLength(MsgInt16, 3);
setMsgpackLength(MsgUInt16, 3);
setMsgpackLength(MsgInt32, 5);
setMsgpackLength(MsgUInt32, 5);
setMsgpackLength(MsgFloat32, 5);
setMsgpackLength(MsgFloat64, 9);

function setMsgpackLength(msgClass: Function, msgpackLength: number) {
    msgClass.prototype.msgpackLength = msgpackLength;
}
