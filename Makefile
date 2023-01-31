dev-start:
	docker-compose -f ./docker-compose.local.yml up -d

dev-stop:
	docker-compose -f ./docker-compose.local.yml down

dev-drop:
	docker-compose -f ./docker-compose.local.yml down -v

dev-runweb:
	docker-compose -f ./docker-compose.local.yml run web $(CMD)

dev-rundb:
	docker-compose -f ./docker-compose.local.yml run db $(CMD)

dev-logs:
	docker-compose -f ./docker-compose.local.yml logs --follow

test:
	docker-compose -f ./docker-compose.local.yml run web yarn test