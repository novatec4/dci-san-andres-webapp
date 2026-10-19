# =============================================================================
# MAKEFILE - Comandos Universales del Proyecto DCI (Componente A.3.1)
# =============================================================================

.PHONY: help test test-unit test-e2e up down build logs clean db-shell

help:
	@echo "======================================================================"
	@echo "  PROYECTO DCI (Componente A.3.1) - Comandos de Automatización"
	@echo "======================================================================"
	@echo "  make test        : Ejecuta toda la suite de pruebas unitarias (node:test)"
	@echo "  make test-e2e    : Ejecuta pruebas E2E en Playwright sobre Docker (:8086)"
	@echo "  make up          : Levanta el stack multicontenedor (Webapp + PostGIS 15)"
	@echo "  make down        : Detiene el stack de contenedores Docker"
	@echo "  make build       : Reconstruye las imágenes de Docker sin caché"
	@echo "  make logs        : Muestra los logs en vivo del stack Docker"
	@echo "  make db-shell    : Abre una consola interactiva psql en el contenedor PostGIS"
	@echo "  make clean       : Limpia temporales y cachés"
	@echo "======================================================================"

test:
	node tests/run_all_tests.js

test-unit:
	node --test tests/unit/*.test.js

test-e2e:
	python ../../scratch/test_docker_stack_e2e.py

up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose build --no-cache

logs:
	docker compose logs -f

db-shell:
	docker exec -it cdi_aea_db psql -U dci_user -d dci_geodb

clean:
	@echo "Limpiando temporales..."
