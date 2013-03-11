@echo off

call node -v
if errorlevel 1 (
	chdir installation_files
	call node-v0.8.22-x64.msi
	chdir ..\
)

call gm version
if errorlevel 1 (
	chdir installation_files
	call GraphicsMagick-1.3.17-Q16-windows-dll.exe
	chdir ..\
)

chdir installation_files
call PowerMate_v2.0.1PC
chdir ..\


@echo on
set curr_dir=%cd%

chdir software
chdir index
call build.bat

chdir ..\..\

chdir installation_files
copy /A /Y/ "Griffin Configuration File for Poster Flipper.pmsettings" "..\Griffin Configuration File for Poster Flipper.pmsettings"

chdir scripts
copy /A /Y "Convert Approved Posters.bat" "..\..\Convert Approved Posters.bat"
copy /A /Y "Update Poster Data.bat" "..\..\Update Poster Data.bat"
copy /A /Y "Open Poster Viewer.bat" "..\..\Open Poster Viewer.bat"
copy /A /Y "Start Host Server.bat" "..\..\Start Host Server.bat"

chdir %curr_dir%

rmdir installation_files /s /q
del INSTALL_32_bit.bat
del INSTALL_64_bit.bat