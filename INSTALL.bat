@echo off

call node -v
if errorlevel 1 (
	echo.
	echo You must download and install `node.js`
	exit /b 1
)

@echo on
set curr_dir=%cd%

chdir software

chdir http
rmdir node_modules /s /q
call npm install express

chdir ..\
chdir process
rmdir node_modules /s /q
call npm install gm
call npm install asyncblock
call npm install ffi

chdir ..\
chdir index
call build.bat

chdir %curr_dir%