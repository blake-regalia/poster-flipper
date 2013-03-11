
set curr_dir=%cd%

chdir software\process
node process-pdfs.js
node process-movies.js

chdir %curr_dir%