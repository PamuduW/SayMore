# Use the official Python 3.9 slim image as the base image
FROM python:3.9-slim

# Set the working directory inside the container to /app
WORKDIR /app

# Update the package list and install necessary build tools and compilers
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy the current directory contents into the container at /app
COPY . .

# Upgrade pip to the latest version
RUN pip install --upgrade pip

# Install the Python dependencies from the requirements.txt file without using the cache
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 8000 to allow external access
EXPOSE 8000

# Define the command to run the application using uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]