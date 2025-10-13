.PHONY: api api-dev

api:
	uvicorn --app-dir src retailinsight.api:app --host 0.0.0.0 --port 8000

api-dev:
	set PYTHONPATH=%CD%\src && uvicorn retailinsight.api:app --reload --port 8000  # Windows
# export PYTHONPATH="$$(pwd)/src" && uvicorn retailinsight.api:app --reload --port 8000  # macOS/Linux
