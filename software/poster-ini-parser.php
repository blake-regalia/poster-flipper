<?php

class PosterIniParser {

	private $magic = 'yes';
	private $INI;
	
	private function pathify($str) {
		return preg_replace('/'.DIRECTORY_SEPARATOR .'$/', '', 
			preg_replace('/[\/\\\\]/', DIRECTORY_SEPARATOR, $str)
		);
	}
	
	public function __construct($file) {
		$this->INI = parse_ini_file($file, true);
	}
	
	public function get($section, $field=NULL) {
		if($field == NULL) {
			return $this->INI[$section];
		}
		return $this->INI[$section][$field];
	}
	
	public function getPaths($section, $field=NULL) {
		if($field == NULL) {
			$paths = array();
			if($this->INI[$section] != NULL) {
				foreach($this->INI[$section] as $key => $str) {
					$pathStr = $this->pathify($str);
					$paths[$key] = preg_replace_callback(
						'/%([^%]+)%/', 
						function($matches) use ($paths) {
							return $paths[$matches[1]];
						},
						$pathStr
						);
				}
			}
			return $paths;
		}
		return $this->pathify($this->INI[$section][$field]);
	}
	
}

?>