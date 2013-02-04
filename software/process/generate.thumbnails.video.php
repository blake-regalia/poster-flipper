<?php

/**
* DO NOT END FOLLOWING DIRECTORY PATHS WITH SLASHES
*
* For Windows: Make sure to specify paths using double back-slash characters for path separators, `\\`
**/

$ftp_directory = 'Q:\\Posters\\Posters to Display';
$video_directory = $ftp_directory.'\\PDF to be Rasterized';
$archive_directory = $ftp_directory.'\\Poster Archive - PDF';

$software_directory = 'C:\\PosterSoftware\\software';
$output_directory = $software_directory.'\\data';

$ffmpeg = $software_directory.'\\tools\\ffmpeg.exe';

$thumb_width  = 211;
$thumb_height = 160;
$thumbnail_directory = $software_directory.'\\thumb';

$video_overlay_icon = $software_directory.'\\resource\\overlay.video.png';

$video_types = array(
	'mp4',
	'ogv',
	'webmv',
	'webm',
	'flv',
	'mov',
);

generateVideos($video_directory, $video_directory);

function genThumb($filename, $filepath, $subdirectory) {
	global $ffmpeg, $thumb_width, $thumb_height, $thumbnail_directory, $video_overlay_icon;
	
	$input = $filepath;
	$output = $thumbnail_directory.$subdirectory.DIRECTORY_SEPARATOR .$filename.'.jpg';
	
	$ss = getDuration($input) * 0.15; // get duration at 6%
	$opts = '-an -y -f mjpeg -ss '.$ss.' -s '.$thumb_width.'x'.$thumb_height.' -vframes 1';
	$cmd = '"'.$ffmpeg.'" -i '.$input.' '.$opts.' '.$output;

	exec($cmd);
	
	//Load and resize the image
	$original = imagecreatefromjpeg($output);
	$image = imagecreatetruecolor($thumb_width, $thumb_height);
	imagecopyresampled($image, $original, 0, 0, 0, 0, $thumb_width, $thumb_height, imagesx($original), imagesy($original));
	imagealphablending($image,true); //allows us to apply a 24-bit watermark over $image

	//Load the sold watermark
	$play_icon = imagecreatefrompng($video_overlay_icon);
	imagealphablending($play_icon,true);

	//Apply watermark and save
	imagecopy(
		$image, $play_icon,
		($thumb_width*0.5) - (imagesx($play_icon)*0.5), ($thumb_height*0.5) - (imagesy($play_icon)*0.5),
		0, 0,
		imagesx($play_icon), imagesy($play_icon)
	);
	$success = imagejpeg($image, $output, 85);

	imagedestroy($image);
	imagedestroy($original);
	imagedestroy($play_icon);
}

function getDuration($file) {
	global $ffmpeg;
	
	ob_start();
	
	passthru($ffmpeg.' -i '.$file.' 2>&1');
	$duration = ob_get_contents();
	ob_end_clean();

	$search = '/Duration: (.*?)[.]/';
	$duration = preg_match($search, $duration, $matches, PREG_OFFSET_CAPTURE);
	$duration = $matches[1][0];

	list($hours, $mins, $secs) = preg_split('/[:]/', $duration);
	
	return $hours*60*60 + $mins*60 + $secs;
}


function generateVideos($dir, $relativeDir) {
	global $output_directory, $thumbnail_directory, $software_directory, $archive_directory, $video_types;
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
			generateVideos($dir.DIRECTORY_SEPARATOR .$file, $relativeDir);
		}
		
		else if(in_array(strtolower(pathinfo($file, PATHINFO_EXTENSION)), $video_types)) {
			$subdirectory = substr(getcwd(),strlen($relativeDir));
			$filepath = $output_directory.$subdirectory.DIRECTORY_SEPARATOR .$file;
			
			// copy video file over to software directory
			$pwd = getcwd();
			chdir($software_directory);
			copy($dir.DIRECTORY_SEPARATOR .$file, $filepath);
			chdir($pwd);
			
			// if the conversion did not fail
			if(is_file($filepath)) {
				
				// generate thumbnail
				genThumb($file, $filepath, $subdirectory);
				
				// and move the original video to another directory
				rename($dir.DIRECTORY_SEPARATOR .$file, $archive_directory.$subdirectory.DIRECTORY_SEPARATOR .$file);
			}
			
			// otherwise, it failed
			else {
				echo '!!: '.$filepath.' failed to be moved.'."\n";
			}
		}
	}
	chdir($cwd);
}

?>