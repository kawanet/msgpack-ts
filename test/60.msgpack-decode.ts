"use strict";

import * as assert from "assert";
import * as msgpack from "../";
import {Group} from "msgpack-test-js";

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
    timestamp: 0
};

describe(TITLE, () => {
    Group.getGroups().forEach((group) => {
        const exams = group.getExams(TEST_TYPES);
        const tryDesc = exams.length ? describe : describe.skip;
        tryDesc(group + "", () => {
            exams.forEach((exam) => {
                exam.getMsgpacks().forEach((buffer) => {
                    it(atos(buffer), () => {
                        const value = msgpack.decode(buffer);
                        assert(exam.matchValue(value), "" + value);
                    });
                });
            });
        });
    });
});
