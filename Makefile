help:
	node ./dist/bin/gendiff.js -h
install:
	npm install
lint:
	npx eslint .
run:
	node ./dist/bin/gendiff.js ./fixtures/structBeforeMain.json ./fixtures/structAfterMain.json
run2:
	node ./dist/bin/gendiff.js ./fixtures/structBefore.json ./fixtures/structAddAfterTemp.json	
build:
	npm run build
test:
	npx jest
