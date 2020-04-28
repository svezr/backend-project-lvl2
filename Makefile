help:
	node src/bin/gendiff.js -h
install:
	npm install
lint:
	npx eslint .
run:
	node src/bin/gendiff.js struct1.json struct2.json
build:
	npm run-script build
