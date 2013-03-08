
set curr_dir=%cd%

chdir software\process
node update-data.js

chdir %curr_dir%