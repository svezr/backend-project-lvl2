help:
	node src/bin/gendiff.js -h
install:
	npm install
lint:
	npx eslint .
run:
	node src/bin/gendiff.js fixtures/struct1.json fixtures/struct2.json
build:
	npm run-script build
