.PHONY: main install test

main:
	node src/main.js

install:
	npm i

test:
	./node_modules/.bin/mocha test/main.js
