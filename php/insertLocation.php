<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/insertDepartment.php?name=New%20Department&locationID=1

	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	

	// $_REQUEST used for development / debugging. Remember to cange to $_POST for production

	$location = $_REQUEST['loc-add'];

	$query_check = "SELECT * FROM location WHERE name='$location'";

	$result_check = $conn->query($query_check);

	if(mysqli_num_rows($result_check)>=1){

		$output['status']['code'] = "200";
		$output['status']['name'] = "ok";
		$output['status']['description'] = "location already present";	
		$output['data'] = [1];

		mysqli_close($conn);

		echo json_encode($output); 

		
	} else {

		$query = 'INSERT INTO location (name) VALUES("' . $_REQUEST['loc-add'] . '")';

		$result = $conn->query($query);
		
		if (!$result) {
	
			$output['status']['code'] = "400";
			$output['status']['name'] = "executed";
			$output['status']['description'] = "query failed";	
			$output['data'] = [];
	
			mysqli_close($conn);
	
			echo json_encode($output); 
	
			exit;
	
		}
	
		$output['status']['code'] = "200";
		$output['status']['name'] = "ok";
		$output['status']['description'] = "success";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];
		
		mysqli_close($conn);
	
		echo json_encode($output); 
		
		
	}

	

?>