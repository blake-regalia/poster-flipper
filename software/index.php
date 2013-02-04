<?php

// ini settings
require_once("php/poster-ini-parser.php");
$iniFile = new PosterIniParser("../config.ini");

$REMOTE = $iniFile->getPaths('REMOTE');
$LOCAL = $iniFile->getPaths('LOCAL');
$JPEG = $iniFile->get('JPEG');

$SUB = array(
	'full' => 'full',
	'thumb' => 'thumb'
);


// php helper classes
require_once("dyna/file-manifest.php");
require_once("dyna/csx-compiler.php");

$MACHINE = '*';

switch($MACHINE) {
case 'basus':
	$ABSOLUTE_ROOT_PATH = 'http://localhost/poster-flip-3d/software';
	break;
default:
	$ABSOLUTE_ROOT_PATH = 'http://localhost:'.$_SERVER['SERVER_PORT'].'';
	break;
}


// resolve relative paths
$cwd = getcwd();
chdir('..');
$script_path = getcwd();
chdir($cwd);
$script_substr_len = strlen($script_path)+1;


// define path variables
$RESOURCE_PATH_JPLAYER = substr($LOCAL['rsrc'], $script_substr_len);
$DATA_DIRECTORY_RELATIVE = substr($LOCAL['data'], $script_substr_len);


header('Content-Type:text/html; charset=UTF-8');
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
<html>
<head>
<?php

readfile('page.head.html');

$merge_files = array(
	'js' => true,
	'css' => true,
);

/***************
**    css
***************/
$csx_manifest_params = File_manifest::read('css/manifest.txt');
$csx_compiler = new \csx\Compiler($csx_manifest_params);
if($merge_files['css']) {
	echo '<style>',"\n\n";
	echo $csx_compiler->output();
	echo "\n",'</style>',"\n";
}


/***************
** javascript
***************/
require "get-json.posters.php";

// jquery
echo '<script type="text/javascript" src="js/kit.jquery.js"></script>'."\n";

// create slider onload
echo '<script type="text/javascript">$(document).ready(function(){new Slider('.posterFiles::getJSON($DATA_DIRECTORY).'); Slider().scroll(0);});</script>'."\n";

// declare constants
echo '<script type="text/javascript">
window["ABSOLUTE_ROOT_PATH"]="'.$ABSOLUTE_ROOT_PATH.'";
window["RESOURCE_PATH_JPLAYER"]="'.$RESOURCE_PATH_JPLAYER.'"
</script>'."\n";

// load user javascript
if($merge_files['js']) {
	echo "\t",'<script type="text/javascript">',"\n";
	echo File_manifest::merge('js/manifest.txt', "/************************\n** %PATH%\n************************/\n");
	echo "\n",'</script>'."\n";
}
else {
	echo File_manifest::gen('js/manifest.txt', '<script type="text/javascript" src="js/%PATH%"></script>')."\n";
}



// commit all the CSS values into the javascript CSS object
echo '<script type="text/javascript">',"\n",'$.extend(window.CSS,',$csx_compiler->get_json(),');',"\n",'</script>'."\n";


echo '
</head>
';

readfile('page.body.html');

?>
</html>