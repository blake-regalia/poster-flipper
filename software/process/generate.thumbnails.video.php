<?php

require_once("poster-ini-parser.php");
$iniFile = new PosterIniParser("../../config.ini");

$REMOTE = $iniFile->getPaths('REMOTE');
$LOCAL = $iniFile->getPaths('LOCAL');
$JPEG = $iniFile->get('JPEG');

$SUB = array(
	'full' => 'full',
	'thumb' => 'thumb'
);


$ffmpeg = $LOCAL['exec']. DIRECTORY_SEPARATOR ."ffmpeg.exe";
$video_overlay_icon = $LOCAL['rsrc']. DIRECTORY_SEPARATOR ."overlay.video.png";

$video_types = array(
	'mp4',
	'ogv',
	'webmv',
	'webm',
	'flv',
	'mov',
);


generateVideos($REMOTE['pdfs'], $REMOTE['pdfs']);


function genThumb($filename, $filepath, $subdirectory) {
	global $LOCAL, $REMOTE, $JPEG, $MPEG, $ffmpeg, $video_overlay_icon;
	
	$thumb_dir = $LOCAL['data']. DIRECTORY_SEPARATOR .$SUB['thumb'];
	$thumb_width = $JPEG['thumb_width'];
	$thumb_height = $JPEG['thumb_height'];
	
	$input = $filepath;
	$output = $thumb_dir.$subdirectory. DIRECTORY_SEPARATOR .$filename.'.jpg';
	
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
	global $LOCAL, $REMOTE, $JPEG, $SUB, $MPEG, $video_types;
	$cwd = getcwd();
	chdir($dir);
	$files = scandir('.');
	foreach($files as $file) {
		if($file == '.' || $file == '..') continue;
		if(is_dir($file)) {
			$dump_path = substr(getcwd(),strlen($relativeDir)).DIRECTORY_SEPARATOR .$file;
			
			// create output subdirectory (local)
			$local_output = $LOCAL['data']. DIRECTORY_SEPARATOR .$SUB['full'].$dump_path;
			if(!file_exists($local_output)) {
				@mkdir($$local_output);
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
			
			// create output subdirectory (remote)
			$remote_output = $REMOTE['data']. DIRECTORY_SEPARATOR .$SUB['full'].$dump_path;
			if(!file_exists($remote_output)) {
				@mkdir($remote_output);
			}
			
			// create thumbnail subdirectory (remote)
			$remote_thumb = $REMOTE['data']. DIRECTORY_SEPARATOR .$SUB['thumb'].$dump_path;
			if(!file_exists($remote_thumb)) {
				@mkdir($remote_thumb);
			}
			
			// recurse on this subdirectory
			generateVideos($dir.DIRECTORY_SEPARATOR .$file, $relativeDir);
		}
		
		// if this file is of an accepted video file type
		else if(in_array(strtolower(pathinfo($file, PATHINFO_EXTENSION)), $video_types)) {
			$subdirectory = substr(getcwd(),strlen($relativeDir));
			$local_filepath = $LOCAL['data']. DIRECTORY_SEPARATOR .$SUB['full'].$subdirectory.DIRECTORY_SEPARATOR .$file;
			$remote_filepath = $REMOTE['data']. DIRECTORY_SEPARATOR .$SUB['full'].$subdirectory.DIRECTORY_SEPARATOR .$file;
			
			// copy video file over to local directory
			$pwd = getcwd();
			chdir($REMOTE['data']);
			
			die('about to copy video file from cwd('.$REMOTE['data'].') => $cp '.$dir.DIRECTORY_SEPARATOR. $file.'; '.$local_filepath);
			
			copy($dir.DIRECTORY_SEPARATOR .$file, $local_filepath);
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