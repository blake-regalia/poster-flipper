<?php

/**
* DO NOT END FOLLOWING DIRECTORY PATHS WITH SLASHES
*
* For Windows: Make sure to specify paths using double back-slash characters for path separators, `\\`
**/

$ftp_directory = 'Q:\\Posters\\Posters to Display';
$pdf_directory = $ftp_directory.'\\PDF to be Rasterized';
$archive_directory = $ftp_directory.'\\Poster Archive - PDF';

$software_directory = 'C:\\PosterSoftware\\software';
$output_directory = $software_directory.'\\data';

$DPI = 300;

$thumb_width = 211;
$thumb_height = 160;
$thumbnail_directory = $software_directory.'\\thumb';


function convertPDFs($dir, $relativeDir) {
	global $output_directory, $thumbnail_directory, $software_directory, $archive_directory, $DPI;
	$cwd = getcwd();
	chdir($dir);
	$files = scandir('.');
	foreach($files as $file) {
		if($file == '.' || $file == '..') continue;
		if(is_dir($file)) {
			$dump_path = substr(getcwd(),strlen($relativeDir)).DIRECTORY_SEPARATOR .$file;
			
			// create output subdirectory
			if(!file_exists($output_directory.$dump_path)) {
				@mkdir($output_directory.$dump_path);
			}
			
			// create thumbnail subdirectory
			if(!file_exists($thumbnail_directory.$dump_path)) {
				@mkdir($thumbnail_directory.$dump_path);
			}
			
			// create archive directory
			if(!file_exists($archive_directory.$dump_path)) {
				@mkdir($archive_directory.$dump_path);
			}
			
			// recurse on this subdirectory
			convertPDFs($dir.DIRECTORY_SEPARATOR .$file, $relativeDir);
		}
		
		else if(strtolower(pathinfo($file, PATHINFO_EXTENSION)) == 'pdf') {
			$subdirectory = substr(getcwd(),strlen($relativeDir));
			$filepath = $output_directory.$subdirectory.DIRECTORY_SEPARATOR .$file.'.jpg';
			
			// convert from pdf to jpeg
			$exec = 'tools\\gswin32c.exe -dNOPAUSE -dBATCH -sDEVICE=jpeg '
				.'-r'.$DPI.' '
				.'"-sOutputFile='.$filepath.'" '
				.'"'.$dir.DIRECTORY_SEPARATOR .$file.'"';
				
			$pwd = getcwd();
			chdir($software_directory);
			echo '=> '.$subdirectory.DIRECTORY_SEPARATOR .$file."\n";
			exec($exec);
			chdir($pwd);
			
			// if the conversion did not fail
			if(is_file($filepath)) {
				// generate thumbnail
				genThumb($file, $filepath, $subdirectory);
				
				// and move the original PDF to another directory
				rename($dir.DIRECTORY_SEPARATOR .$file, $archive_directory.$subdirectory.DIRECTORY_SEPARATOR .$file);
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
	global $thumb_width, $thumb_height, $thumbnail_directory;
	
	// Get dimensions
	 list($src_width, $src_height) = getimagesize($filepath);
	
	// Resample
	$thumbnail = imagecreatetruecolor($thumb_width, $thumb_height);
	$image = imagecreatefromjpeg($filepath);
	imagecopyresampled($thumbnail, $image, 0, 0, 0, 0, $thumb_width, $thumb_height, $src_width, $src_height);
	
	// Output
	imagejpeg($thumbnail, $thumbnail_directory.$subdirectory.DIRECTORY_SEPARATOR .$filename.'.jpg', 100);
}

convertPDFs($pdf_directory, $pdf_directory);


?>