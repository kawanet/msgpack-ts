"use strict";

import * as assert from "assert";
import * as msgpack from "../";
import {Exam} from "msgpack-test-js";

const TITLE = __filename.split("/").pop() as string;

const atos = (array: any) => [].map.call(array, (v: number) => (v > 15 ? "" : "0") + v.toString(16)).join("-");

// set 1 for types to run test
const TEST_TYPES = {
    array: 1,
    bignum: 1,
    binary: 1,
    bool: 1,
    ext: 1,
    map: 1,
    nil: 1,
    number: 1,
    string: 1,
    timestamp: 1
};

describe(TITLE, () => {

    // find exams for types supported by the library
    Exam.getExams(TEST_TYPES).forEach((exam) => {

        // test for encoding
        exam.getTypes(TEST_TYPES).forEach((type) => {
            let title = type + ": " + exam.stringify(type);
            it(title, () => {
                const value = exam.getValue(type);
                const buffer = msgpack.encode(value) as Buffer;
                const hint = exam.stringify(0) + " != " + atos(buffer);
                assert(exam.matchMsgpack(buffer), hint);
            });
        });
    });
});
