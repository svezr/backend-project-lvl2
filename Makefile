help:
	node ./dist/bin/gendiff.js -h
install:
	npm install
lint:
	npx eslint .
run:
	node ./dist/bin/gendiff.js ./fixtures/struct1.json ./fixtures/struct2.json
build:
	npm run build
