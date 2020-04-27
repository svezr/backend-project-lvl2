start:
	node bin/gendiff.js
help:
	node bin/gendiff.js -h
install:
	npm install
lint:
	npx eslint .
run:
	node ./bin/gendiff.js struct1.json struct2.json
