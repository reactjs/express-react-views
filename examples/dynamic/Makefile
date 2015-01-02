
public/main.js: views/*
	mkdir -p tmp
	./node_modules/.bin/jsx -x jsx views tmp
	./node_modules/.bin/browserify tmp/main.js -o public/main.js
