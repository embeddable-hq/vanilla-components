.PHONY: secrets connection-list connection-update

secrets:
	@echo "Injecting secrets into config file..."
	@op inject -i .env.tpl -o .env
	@echo "Config file generated successfully"

connection-list:
	@node connection-read.mjs

connection-read:
	@node connection-read.mjs

connection-test:
	@node connection-test.mjs

connection-update:
	@node connection-update.mjs


environment-list:
	@node environment-read.mjs

environment-read:
	@node environment-read.mjs

environment-create:
	@node environment-create.mjs

environment-update:
	@node environment-update.mjs

