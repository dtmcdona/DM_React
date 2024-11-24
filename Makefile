init:
	cd app && yarn start

format:
	cd app && yarn prettier --write src
	cd app && yarn prettier --check .

setup:
	cd app && yarn install
