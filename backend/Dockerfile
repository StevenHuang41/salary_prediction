FROM python:3.12-slim

WORKDIR /backend

RUN pip install --upgrade pip 

# RUN pip install --no-cache-dir uv

RUN apt-get update 
RUN apt-get install -y libgomp1 
RUN apt-get install -y libsqlite3-dev 
RUN rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
# COPY pyproject.toml uv.lock ./

RUN pip install --no-cache-dir -r requirements.txt

# ENV UV_SYSTEM_PYTHON=true


# ENV PATH="/backend/.venv/bin:$PATH"

# RUN uv sync --locked

COPY . .

EXPOSE 8000

# CMD ["python", "main.py"]

# CMD ["/bin/bash"]

CMD ["uvicorn", "main:app", "--host", \
    "0.0.0.0", "--port", "8000"]

# CMD ["uv", "run", "main.py"]