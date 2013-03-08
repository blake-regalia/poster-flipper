@echo off

call node -v
if errorlevel 1 (
	echo.
	echo You must download and install `node.js`
	exit /b 1
)

@echo on
set curr_dir=%cd%

chdir /D software

chdir /D http
rmdir node_modules /s /q
call npm install express

chdir /D ..\
chdir /D process
rmdir node_modules /s /q
call npm install gm
call npm install asyncblock

chdir /D ..\
chdir /D index
call build.bat

chdir /D %curr_dir%