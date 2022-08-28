init:
	cd app && npm start

format:
	npx prettier --write .
	npx prettier --check .