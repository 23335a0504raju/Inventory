#!/bin/bash
set -o errexit

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Database check (without netcat)
if [ -n "$DATABASE_URL" ]; then
    echo "Waiting for database to be ready..."
    # Python-based port check alternative
    python - <<END
import socket, os, time
from urllib.parse import urlparse

db_url = os.getenv('DATABASE_URL')
if db_url:
    parsed = urlparse(db_url)
    host = parsed.hostname
    port = parsed.port or 5432
    
    while True:
        try:
            with socket.create_connection((host, port), timeout=5):
                print("Database is ready!")
                break
        except (socket.error, socket.timeout) as e:
            print(f"Waiting for database... ({e})")
            time.sleep(2)
END
fi

# Run migrations
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --noinput

# Start server
exec gunicorn backend.wsgi:application \
    --bind 0.0.0.0:$PORT \
    --workers 3 \
    --timeout 120 \
    --log-level debug