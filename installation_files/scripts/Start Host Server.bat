
set curr_dir=%cd%

chdir software\http
node server.js

chdir %curr_dir%