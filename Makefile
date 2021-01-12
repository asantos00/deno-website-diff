.DEFAULT_GOAL = help
.PHONY: help run

include .env

# target: help - Shows all available commands
help:
	egrep "^# target:" [Mm]akefile

# target: run - Run screenshot for target website
run:
	deno run --allow-env --allow-read=${WEB_RES_SECURITY_READ} --allow-write=${WEB_RES_SECURITY_WRITE} --allow-net=${WEB_RES_SECURITY_NET} --allow-run --unstable mod.ts $$WEB_RES_TARGET
