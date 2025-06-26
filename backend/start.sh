#!/bin/bash
set -o errexit


pip install -r backend/requirements.txt

# Create directories
mkdir -p /opt/render/project/src/backend/media
mkdir -p /opt/render/project/src/backend/staticfiles

# Apply database migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Start Gunicorn
exec gunicorn backend.wsgi:application \
    --bind 0.0.0.0:$PORT \
    --workers 4 \
    --timeout 120 \
    --log-level=info
