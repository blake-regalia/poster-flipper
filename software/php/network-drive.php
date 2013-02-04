<?php

// ini settings
require_once("../php/poster-ini-parser.php");
$iniFile = new PosterIniParser("../../config.ini");

$NETWORK = $iniFile->get('NETWORK');

$drive = $NETWORK['drive'];
$location = $NETWORK['path'];
$user = $NETWORK['user'];
$pass = $NETWORK['pass'];


// establish connection to network drive
system('net use '.$drive.': "'.$location.'" '.$pass.' /user:'.$user.' /persistent:no');


?>