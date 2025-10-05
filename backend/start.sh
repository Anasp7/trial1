#!/bin/bash

echo "Starting Alumni Connect Backend..."
echo

echo "Installing dependencies..."
pip install -r requirements.txt

echo
echo "Starting Flask server..."
echo "Backend will be available at: http://localhost:5000"
echo
echo "Default admin credentials:"
echo "Email: admin@alumni.com"
echo "Password: admin123"
echo

python app.py
