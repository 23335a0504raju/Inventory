#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -o errexit

# First install build dependencies
pip install --upgrade pip setuptools wheel
pip install numpy==1.26.4 scikit-learn==1.4.0
# Install dependencies (in case any were added after build)
pip install -r requirements.txt

# Run database migrations
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --noinput

# Start Gunicorn (or Daphne if you're using WebSockets)
if [ "$USE_DAPHNE" = "true" ]; then
    daphne -b 0.0.0.0 -p $PORT your_project_name.asgi:application
else
    exec gunicorn your_project_name.wsgi:application \
        --bind 0.0.0.0:$PORT \
        --workers 3 \
        --timeout 120
fi