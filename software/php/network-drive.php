<?php

// ini settings
require_once("../php/poster-ini-parser.php");
$iniFile = new PosterIniParser("../../config.ini");

$NETWORK = $iniFile->get('NETWORK');

$drive = $NETWORK['drive'];
$location = $NETWORK['path'];
if(preg_match('/^[\\\\][^\\\\]/', $location)) {
	$location = '\\'.$location;
}
$user = $NETWORK['user'];
$pass = $NETWORK['pass'];


// establish connection to network drive
$cmd = 'net use '.$drive.': "'.$location.'" '.$pass.' /user:'.$user.' /persistent:no';
system($cmd);


?>