<?php

$imageType = array(
	'jpg',
	'jpeg',
	'gif',
	'png',
	'tiff',
);

$videoType = array(
	'mp4',
	'ogv',
	'webm',
	'flv',
);

class posterFiles {
	
	private static function trimPath($path) {
		return preg_replace(
			array('/^\\.?\\//', '/\\/\\.\\//'),
			array('', '/'),
			$path
		);
	}

	private static function getPosters($dir='.', $thumbDir='thumb', $pdir, &$array=array('>'=>true)) {
		global $imageType, $videoType;
	
		$array[':thumbSrc'] = 'resource/folder.png';
		$files = scandir($dir);

		// first, commit all directories
		foreach($files as $filename) {
		
			if($filename == '.' || $filename == '..') continue;
		
			if(is_dir($dir.'/'.$filename)) {
				$array[$filename] = array('>'=>true);
				self::getPosters($dir.'/'.$filename, $thumbDir, $pdir, $array[$filename]);
				continue;
			}
		}
		
		// then find the poster files
		foreach($files as $filename) {
		
			$filext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
			
			$isImg = in_array($filext, $imageType);
			$isVid = in_array($filext, $videoType);
		
			if($filename == '.' || $filename == '..') continue;
			
			else if(!$isImg && !$isVid) {
				continue;
			}
			
			$fname_no_ext = pathinfo($filename, PATHINFO_FILENAME);
			
			$array [$filename]= array(
				':title' => ($isVid? $filename: substr($filename, 0, strrpos($filename,'.'))),
				':src' => $pdir.'/'.self::trimPath($dir.'/'.$filename),
				':thumbSrc' => self::trimPath($thumbDir.'/'.$dir.'/'.$filename).($isVid? '.jpg': ''),
				':type' => ($isVid? 'video': ($isImg? 'image': 'unknown')),
			);
		}

		return $array;
	}

	public static function getJSON($dir, $thumbDir='thumb') {
		$pwd = getcwd();
		chdir($dir);
		$posters = self::getPosters('.', $thumbDir, $dir);
		chdir($pwd);
		
		return json_encode(
			array(
				$dir => $posters,
			)
		);
	}
}

?>