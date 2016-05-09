<?php
	$hostname_conn = "localhost";
	$database_conn = "templatestore_db";
	$username_conn = "root";
	$password_conn = "";
	$db_prefix = "";

	$conn = mysqli_connect($hostname_conn, $username_conn, $password_conn) or trigger_error(mysql_error(),E_USER_ERROR); 
	mysqli_select_db($conn, $database_conn) or DIE('Database name is not available!');

	$mail_api_key = "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";

?>