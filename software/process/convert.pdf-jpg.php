<?php

require_once("../poster-ini-parser.php");
$iniFile = new PosterIniParser("../../config.ini");

$REMOTE = $iniFile->getPaths('REMOTE');
$LOCAL = $iniFile->getPaths('LOCAL');
$JPEG = $iniFile->get('JPEG');

$SUB = array(
	'full' => 'full',
	'thumb' => 'thumb'
);


function convertPDFs($dir, $relativeDir) {
	global $LOCAL, $REMOTE, $JPEG, $SUB;
	$cwd = getcwd();
	chdir($dir);
	$files = scandir('.');
	foreach($files as $file) {
		if($file == '.' || $file == '..') continue;
		if(is_dir($file)) {
			$dump_path = substr(getcwd(),strlen($relativeDir)). DIRECTORY_SEPARATOR .$file;
			
			// create output subdirectory (local)
			$local_output = $LOCAL['data']. DIRECTORY_SEPARATOR .$SUB['full'].$dump_path;
			if(!file_exists($local_output)) {
				@mkdir($local_output);
			}
			
			// create thumbnail subdirectory (local)
			$local_thumb = $LOCAL['data']. DIRECTORY_SEPARATOR .$SUB['thumb'].$dump_path;
			if(!file_exists($local_thumb)) {
				@mkdir($local_thumb);
			}
			
			// create archive directory (remote)
			$remote_archive = $REMOTE['arch'].$dump_path;
			if(!file_exists($remote_archive)) {
				@mkdir($remote_archive);
			}
			
			// create output directory (remote)
			$remote_output = $REMOTE['data']. DIRECTORY_SEPARATOR .$SUB['full'].$dump_path;
			if(!file_exists($remote_output)) {
				@mkdir($remote_output);
			}
			
			// create thumbnail directory (remote)
			$remote_thumbnail = $REMOTE['data']. DIRECTORY_SEPARATOR .$SUB['thumb'].$dump_path;
			if(!file_exists($remote_thumbnail)) {
				@mkdir($remote_thumbnail);
			}
			
			// recurse on this subdirectory
			convertPDFs($dir. DIRECTORY_SEPARATOR .$file, $relativeDir);
		}
		
		else if(strtolower(pathinfo($file, PATHINFO_EXTENSION)) == 'pdf') {
			$subdirectory = substr(getcwd(),strlen($relativeDir));
			$filepath = $LOCAL['data']. DIRECTORY_SEPARATOR .$SUB['full'].$subdirectory. DIRECTORY_SEPARATOR .$file.'.jpg';
			
			die($filepath);
			
			// convert from pdf to jpeg
			$exec = 'gswin32c.exe -dNOPAUSE -dBATCH -sDEVICE=jpeg '
				.'-r'.$DPI.' '
				.'"-sOutputFile='.$filepath.'" '
				.'"'.$dir. DIRECTORY_SEPARATOR .$file.'"';
				
			$pwd = getcwd();
			chdir($LOCAL['exec']);
			echo '=> '.$subdirectory. DIRECTORY_SEPARATOR .$file."\n";
			exec($exec);
			chdir($pwd);
			
			// if the conversion did not fail
			if(is_file($filepath)) {
				// generate thumbnail
				genThumb($file, $filepath, $subdirectory);
				
				// and move the original PDF to another directory
				rename($dir.DIRECTORY_SEPARATOR .$file, $REMOTE['arch'].$subdirectory. DIRECTORY_SEPARATOR .$file);
			}
			
			// otherwise, it failed
			else {
				echo '!!: '.$filepath.' failed to be converted.'."\n";
			}
		}
	}
	chdir($cwd);
}

function genThumb($filename, $filepath, $subdirectory) {
	global $LOCAL, $REMOTE, $JPEG, $SUB;
	
	// Get dimensions
	 list($src_width, $src_height) = getimagesize($filepath);
	
	// Resample
	$thumbnail = imagecreatetruecolor($JPEG['thumb_width'], $JPEG['thumb_height']);
	$image = imagecreatefromjpeg($filepath);
	imagecopyresampled($thumbnail, $image, 0, 0, 0, 0, $JPEG['thumb_width'], $JPEG['thumb_height'], $src_width, $src_height);
	
	// Output
	imagejpeg($thumbnail, $LOCAL['data']. DIRECTORY_SEPARATOR .$SUB['thumb'].$subdirectory.DIRECTORY_SEPARATOR .$filename.'.jpg', 100);
}

convertPDFs($REMOTE['pdfs'], $REMOTE['pdfs']);


?>