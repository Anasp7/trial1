@echo off
echo ========================================
echo Alumni Connect Backend Setup
echo ========================================
echo.

echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo Creating uploads directory...
if not exist "uploads" mkdir uploads

echo.
echo Starting Flask server...
echo.
echo Backend will be available at: http://localhost:5000
echo.
echo Default admin credentials:
echo Email: admin@alumni.com
echo Password: admin123
echo.
echo Press Ctrl+C to stop the server
echo.

python app.py

pause
