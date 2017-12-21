"use strict";
exportAll(require("./msg-array"));
exportAll(require("./msg-boolean"));
exportAll(require("./msg-number"));
exportAll(require("./msg-object"));
exportAll(require("./msg-string"));
exportAll(require("./msg-value"));
exportAll(require("./encode"));
function exportAll(obj) {
    for (var key in obj) {
        exports[key] = obj[key];
    }
}
