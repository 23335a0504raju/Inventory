#!/bin/bash
set -o errexit

# Upgrade pip first
python -m pip install --upgrade pip

# Install all dependencies
python -m pip install -r requirements.txt

# Force-reinstall numpy (to fix Render image issue)
python -m pip uninstall numpy -y
python -m pip install numpy==1.26.4

# Verify installation
python -c "import numpy as np; print(f'Numpy: {np.__version__}')"
python -c "import sklearn; print(f'Scikit-learn: {sklearn.__version__}')"

# Django tasks
python manage.py migrate --noinput
python manage.py collectstatic --noinput

# Start Gunicorn
exec gunicorn backend.wsgi:application \
    --bind 0.0.0.0:$PORT \
    --workers 3 \
    --timeout 120 \
    --log-level debug
