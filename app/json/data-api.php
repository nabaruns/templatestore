<?php
	require("connection.php");

	$query = "SELECT t.*, (select group_concat(i.name separator ',') from image_table i where i.template_id=t.id) as images FROM templates t";
	$result = mysqli_query($conn, $query);
	if(mysqli_num_rows($result) > 0) {
		$final_arr = array();
	    while($result_arr = mysqli_fetch_assoc($result)){
	    	$result_arr['images'] = explode(',', $result_arr['images']);
	    	$final_arr[] = $result_arr;
	    }
	    echo json_encode($final_arr);
	} 

?>
