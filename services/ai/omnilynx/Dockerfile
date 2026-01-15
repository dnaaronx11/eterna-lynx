# Non-production scaffold for EternaLynX Python-based services.
# Replace with hardened build stages, dependency pinning, and runtime controls.
FROM python:3.11-slim
WORKDIR /app
COPY main.py /app/main.py
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
CMD ["python", "/app/main.py"]
