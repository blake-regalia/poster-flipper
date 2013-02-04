<?php

function rrmdir($dir) {
    foreach(glob($dir . '/*') as $file) {
        if(is_dir($file)) {
            rrmdir($file);
			rmdir($file);
		}
        else {
            unlink($file);
		}
		echo 'x '.$file."\n";
    }
}

rrmdir('software/data');
rrmdir('software/thumb');

?>