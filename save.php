<?php

ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);

$FILENAME = "data.csv";

$file = fopen($FILENAME, 'w');
$data = $_POST["data"];
foreach ($data as $row) {
	fputcsv($file, $row);
}
fclose($file);

echo "0";

?>