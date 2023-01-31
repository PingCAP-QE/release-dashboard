build:
	yarn install && \
	yarn build

clean:
	@rm -rf build/

run:
	yarn start

help:
	@echo "make build : build all binaries"
	@echo "make run : build all binaries and run"
	@echo "make clean : clear all temporary files and folders generated by the 'make build' or 'make run'"

.PHONY: build run clean help
