help:
	node ./dist/bin/gendiff.js -h
install:
	npm install
lint:
	npx eslint .
run:
	node ./dist/bin/gendiff.js ./fixtures/structBefore.json ./fixtures/structAfter1.json
run2:
	node ./dist/bin/gendiff.js ./fixtures/structBefore.json ./fixtures/structAfter1.json -f plain
run3:
	node ./dist/bin/gendiff.js ./fixtures/structBefore.json ./fixtures/structAfter1.json -f json
build:
	npm run build
test:
	make build && npx jest
