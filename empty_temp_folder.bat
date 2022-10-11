REM Remove files older than 2 days
forfiles /p "C:\PATH\TO\TEMP\FILES" /s /m *.* /c "cmd /c Del @path" /d -2