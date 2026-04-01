# Use a lightweight Python image
FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /app

# Copy requirements first (so Docker caches this layer)
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the rest of your backend code
COPY . .

# Run FastAPI with live reload so changes reflect immediately
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]