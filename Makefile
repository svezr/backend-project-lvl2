start:
	node bin/gendiff.js
help:
	node bin/gendiff.js -h
install:
	npm install
lint:
	npx eslint .
run:
	node ./bin/gendiff.js testfile1.json testfil2.json
