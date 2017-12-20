"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var msgpack = require("../");
var msgpack_test_js_1 = require("msgpack-test-js");
var TITLE = __filename.split("/").pop();
// set 1 for types to run test
var TEST_TYPES = {
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
describe(TITLE, function () {
    // find exams for types supported by the library
    msgpack_test_js_1.Exam.getExams(TEST_TYPES).forEach(function (exam) {
        // test for encoding
        exam.getTypes(TEST_TYPES).forEach(function (type) {
            var title = type + ": " + exam.stringify(type);
            it(title, function () {
                var value = exam.getValue(type);
                var buffer = msgpack.encode(value);
                var hint = exam.stringify(0) + " != " + binaryToHex(buffer);
                assert(exam.matchMsgpack(buffer), hint);
            });
        });
    });
});
function binaryToHex(buffer) {
    return [].map.call(buffer, toHex).join("-");
}
function toHex(v) {
    return (v > 15 ? "" : "0") + v.toString(16);
}
