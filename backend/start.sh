#!/bin/bash
set -o errexit

# Install dependencies
python -m pip install --upgrade pip
python -m pip install --no-cache-dir -r requirements.txt

# Database setup
python manage.py migrate --noinput
python manage.py collectstatic --noinput

# Start server
exec gunicorn backend.wsgi:application \
    --bind 0.0.0.0:$PORT \
    --workers 3 \
    --timeout 120 \
    --log-level debug