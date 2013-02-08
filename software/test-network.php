<?php

// connect to network drive
require_once('../php/network-drive.php');

// ini settings
require_once("../php/poster-ini-parser.php");
$iniFile = new PosterIniParser("../../config.ini");

$REMOTE = $iniFile->getPath('REMOTE');
$files = scandir($REMOTE['root']);

print_r($files);


?>