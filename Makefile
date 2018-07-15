#!/usr/bin/env bash -c make

MIN_JS=dist/msgpack-ts.min.js
TMP_JS=dist/msgpack-ts.browserify.js
SRC_JS=lib/index.js

CLASS=msgpack

all: $(MIN_JS)

clean:
	/bin/rm -f $(MIN_JS) $(TMP_JS)

$(MIN_JS): $(TMP_JS)
	./node_modules/.bin/uglifyjs -c -m -o $@ $<
	perl -i -pe 's/(}],|\(\{)(\d+:\[function)/$$1\n$$2/g' $@
	perl -i -pe 's/Object.defineProperty\(\w,"__esModule",\{value:!0}\);//g;' $@

$(TMP_JS): lib/*.ts
	/bin/rm -f lib/*.js
	./node_modules/.bin/tsc
	./node_modules/.bin/browserify $(SRC_JS) -s $(CLASS) -o $@ --debug

.PHONY: all clean
