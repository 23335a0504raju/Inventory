#!/bin/bash

set -o errexit

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Database migrations
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --noinput

# Start server (replace 'backend' with your actual project name)
exec gunicorn backend.wsgi:application \
    --bind 0.0.0.0:$PORT \
    --workers 3 \
    --timeout 120