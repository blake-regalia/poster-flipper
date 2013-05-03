
set curr_dir=%cd%

chdir software\process
node process-pdfs.js
node process-videos.js

chdir %curr_dir%