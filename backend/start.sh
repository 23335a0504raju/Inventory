#!/bin/bash
set -o errexit

# Force Python 3.12 environment
export PYTHON_VERSION=3.12.12

# Install dependencies
pip install --upgrade pip
pip install --no-cache-dir -r requirements.txt

# Database setup
python manage.py migrate --noinput
python manage.py collectstatic --noinput

# Start server
exec gunicorn backend.wsgi:application \
    --bind 0.0.0.0:$PORT \
    --workers 3 \
    --timeout 120 \
    --log-level debug