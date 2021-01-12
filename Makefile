.DEFAULT_GOAL = help
.PHONY: help run

ifneq ("$(wildcard $(.env))","")
    include .env
else
    include .env.defaults
endif

# target: help - Shows all available commands
help:
	egrep "^# target:" [Mm]akefile

# target: run - Run screenshot for target website
run:
	deno run --unstable --allow-env --allow-net --allow-run --allow-read=${WEB_RES_SECURITY_READ} --allow-write=${WEB_RES_SECURITY_WRITE} mod.ts $$WEB_RES_TARGET

# target: diff - Run screenshot for target website
diff:
	deno run --unstable --allow-env --allow-net --allow-run --allow-read=${WEB_RES_SECURITY_READ} --allow-write=${WEB_RES_SECURITY_WRITE} mod.ts $$WEB_RES_TARGET --diff
