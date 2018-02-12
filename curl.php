<?php
/**
 * To prevent Access-Control-Allow-Origin issues while using Javascript
 * Accepts as URL everything after the ?request=
 * If for any reason you do change this file name please make sure you correct it inside of the javascript
 */
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");
$request=$_SERVER["REQUEST_URI"];
if(!empty($request)){
    $url = ltrim($request, '/curl.php');
    $url = ltrim($url, '?request=');
}else{
    die("Invalid URL");
}
$ch = curl_init();
curl_setopt ($ch, CURLOPT_URL, $url);
curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, 5);
curl_setopt ($ch, CURLOPT_RETURNTRANSFER, true);
$contents = curl_exec($ch);
if (curl_errno($ch)) {
    echo curl_error($ch);
    echo "\n<br />";
    $contents = '';
} else {
    curl_close($ch);
}
if (!is_string($contents) || !strlen($contents)) {
    echo "Failed to get contents.";
    die();
    $contents = '';
}
echo($contents);