FROM python:3.12.3-slim-bullseye

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y libgomp1 libsqlite3-dev && \
    rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir uv

ENV UV_SYSTEM_PYTHON=true

WORKDIR /backend

COPY pyproject.toml uv.lock ./

# ENV PATH="/backend/.venv/bin:$PATH"

RUN uv sync --locked

COPY . .

EXPOSE 8000

# CMD ["uvicorn", "main:app", "--host", \
#     "0.0.0.0", "--port", "8000"]
# CMD ["uv", "run", "main.py"]
# CMD ["python", "-u", "main.py"]
CMD ["/bin/bash"]