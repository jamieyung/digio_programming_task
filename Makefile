.PHONY: main test

main:
	node src/main.js

test:
	./node_modules/.bin/mocha test/main.js
