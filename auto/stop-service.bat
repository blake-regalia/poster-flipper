server\apache\bin\pv -f -k httpd.exe -q
if not exist server\apache\logs\httpd.pid GOTO exit
del server\apache\logs\httpd.pid

:exit