#!/bin/bash
set -o errexit

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Wait for database to be ready (PostgreSQL specific)
if [ -n "$DATABASE_URL" ]; then
    echo "Waiting for database..."
    while ! nc -z $(echo $DATABASE_URL | cut -d'@' -f2 | cut -d':' -f1) \
                 $(echo $DATABASE_URL | cut -d':' -f4 | cut -d'/' -f1); do
      sleep 1
    done
fi

# Run migrations
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --noinput

# Start server
exec gunicorn backend.wsgi:application \
    --bind 0.0.0.0:$PORT \
    --workers 3 \
    --timeout 120