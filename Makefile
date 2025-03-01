format:
	black . && isort . --profile black

lint:
	ruff check . --fix