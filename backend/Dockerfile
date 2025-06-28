# Use official Python image
FROM python:3.9-slim

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# Expose port
EXPOSE 8000

# Set environment variables (can be overridden by docker-compose)
ENV MONGO_URL="mongodb://mongo:27017/"
ENV JWT_SECRET="changeme"
ENV ENCRYPTION_KEY="changeme"

# Run the app with Uvicorn
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"] 