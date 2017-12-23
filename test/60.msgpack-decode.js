"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var msgpack = require("../");
var msgpack_test_js_1 = require("msgpack-test-js");
var TITLE = __filename.split("/").pop();
// set 1 for types to run test
var TEST_TYPES = {
    array: 1,
    bignum: 0,
    binary: 1,
    bool: 1,
    ext: 1,
    map: 1,
    nil: 1,
    number: 1,
    string: 1,
    timestamp: 0
};
describe(TITLE, function () {
    msgpack_test_js_1.Group.getGroups().forEach(function (group) {
        var exams = group.getExams(TEST_TYPES);
        var tryDesc = exams.length ? describe : describe.skip;
        tryDesc(group + "", function () {
            exams.forEach(function (exam) {
                exam.getMsgpacks().forEach(function (buffer) {
                    it(binaryToHex(buffer), function () {
                        var value = msgpack.decode(buffer);
                        assert(exam.matchValue(value), "" + value);
                    });
                });
            });
        });
    });
});
function binaryToHex(buffer) {
    if (!buffer)
        return buffer + "";
    return [].map.call(buffer, toHex).join("-");
}
function toHex(v) {
    return (v > 15 ? "" : "0") + v.toString(16);
}
