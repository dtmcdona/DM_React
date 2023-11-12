init:
	cd app && yarn start

format:
	npx prettier --write .
	npx prettier --check .

setup:
	cd app && yarn install