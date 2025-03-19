# Format the codebase using Black and isort with the Black profile
format:
	black . && isort . --profile black

# Lint the codebase using Ruff and automatically fix issues
lint:
	ruff check . --fix