install:
	npm install
publish:
	npm publish
lint:
	npm run eslint .
rs-bin:
	node dist/bin/redis-serializer.js
rs:
	npm run babel-node -- src/bin/redis-serializer.js
build:
	npm run build
test:
	npm test
