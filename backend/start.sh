
#!/bin/bash
set -o errexit

# Clean install with forced numpy/scikit-learn versions
python -m pip install --upgrade pip
python -m pip install --force-reinstall numpy==1.26.0
python -m pip install scikit-learn==1.6.1
python -m pip install -r requirements.txt

# Verify installations
python -c "import numpy as np; print(f'Numpy: {np.__version__}')"
python -c "import sklearn; print(f'Scikit-learn: {sklearn.__version__}')"
# Database setup
python manage.py migrate --noinput
python manage.py collectstatic --noinput

# Start server
exec gunicorn backend.wsgi:application \
    --bind 0.0.0.0:$PORT \
    --workers 3 \
    --timeout 120 \
    --log-level debug