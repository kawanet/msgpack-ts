"use strict";

import * as assert from "assert";
import {Msgpack} from "../";
import {Exam} from "msgpack-test-js";

const TITLE = __filename.split("/").pop();

// set 1 for types to run test
const TEST_TYPES = {
    array: 0,
    bignum: 0,
    binary: 1,
    bool: 1,
    ext: 0,
    map: 0,
    nil: 1,
    number: 1,
    string: 1,
    timestamp: 0
};

describe(TITLE, () => {

    // find exams for types supported by the library
    Exam.getExams(TEST_TYPES).forEach((exam) => {

        // test for encoding
        exam.getTypes(TEST_TYPES).forEach((type) => {
            let title = type + ": " + exam.stringify(type);
            it(title, () => {
                let value = exam.getValue(type);
                let buffer = Msgpack.from(value).toMsgpack();
                const hint = exam.stringify(0) + " != " + binaryToHex(buffer);
                assert(exam.matchMsgpack(buffer), hint);
            });
        });
    });
});

function binaryToHex(buffer) {
    return [].map.call(buffer, toHex).join("-");
}

function toHex(v) {
    return (v > 15 ? "" : "0") + v.toString(16)
}