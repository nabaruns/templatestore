<?php
  require("connection.php");

  date_default_timezone_set('Asia/Kolkata');
  $date = date('Y/m/d h:i:s a', time());

  $arr = array('result' => '');
   
  if(isset($_POST['action'])) {

  	//Insert items
	  if($_POST['action']=="add") {

	    $name = mysqli_escape_string($conn, $_POST['name']);
	    $description = mysqli_escape_string($conn, $_POST['description']);
	    $price = mysqli_escape_string($conn, $_POST['price']);
	    $type = mysqli_escape_string($conn, $_POST['type']);
	    $img = mysqli_escape_string($conn, $_POST['image']);
	    $permalink = mysqli_escape_string($conn, $_POST['permalink']);

	    $arr = array('result' => '', 'id'=> '');

	    $chkQ = "SELECT id from templates where name='$name' and permalink='$permalink'";
	    $res = mysqli_query($conn, $chkQ);

	    if(mysqli_num_rows($res)<1){
	      $q = "INSERT INTO `templates` (`name`, `description`, `price`, `type`, `permalink`, `createTime`) VALUES ('$name', '$description', '$price', '$type', '$permalink', '$date')";

	      if(mysqli_query($conn, $q)){
	        $res = mysqli_query($conn, $chkQ);
	        $resArr = mysqli_fetch_assoc($res);
	        $i=0;
	        // while($i<$imgQ.length){
	          $imgquery = "INSERT INTO image_table (`name`, template_id) VALUES ('$img','".$resArr['id']."')";
	          if(mysqli_query($conn, $imgquery)){
	            //   $i++;
	            // }
	            $arr['id']=$resArr['id'];
	            $arr['result'] = "Success";
	          }else
	            $arr['result'] = "Failed image update";

	      }else
	        $arr['result'] = "Failed";

	    }else 
	      $arr['result'] = "Already exists";

	  }

	  //Delete items
	  elseif ($_POST['action']=="remove") {

	  	$id = mysqli_escape_string($conn, $_POST['id']);
	  	$query = "DELETE FROM templates WHERE id='$id'";
	  	$imgQuery = "DELETE FROM image_table WHERE template_id='$id'";
	  	if(mysqli_query($conn, $query)&&mysqli_query($conn, $imgQuery))
	  		$arr['result'] = "Success";

	  }

	  //Update items
	  elseif ($_POST['action']=="update") {
	  
  		$id = mysqli_escape_string($conn, $_POST['id']);
  		$name = mysqli_escape_string($conn, $_POST['name']);
	    $description = mysqli_escape_string($conn, $_POST['description']);
	    $price = mysqli_escape_string($conn, $_POST['price']);
	    $type = mysqli_escape_string($conn, $_POST['type']);
	    $img = mysqli_escape_string($conn, $_POST['image']);
	    $permalink = mysqli_escape_string($conn, $_POST['permalink']);

	  	$query = "UPDATE  `templates` SET  `name` =  '$name', `description` =  '$description', `price` =  '$price', `type` =  '$type', `permalink` =  '$permalink' WHERE  `id` ='$id'";
	  	if(mysqli_query($conn, $query)){
	        // while($i<$imgQ.length){
	          $imgquery = "UPDATE  `image_table` SET  `name` =  '$img' WHERE  `template_id` ='$id' LIMIT 1";
	          if(mysqli_query($conn, $imgquery)){
	            //   $i++;
	            // }
	            $arr['result'] = "Success";
	          }else
	            $arr['result'] = "Failed image update";

	    }else
	        $arr['result'] = "Failed";

	  }

	  //Login
	  elseif ($_POST['action']=="login") {
	    $username = mysqli_escape_string($conn, $_POST['username']);
	    $passEncrypt = mysqli_escape_string($conn, $_POST['password']);

  		$q = "SELECT id FROM users WHERE username='$username' AND password='$passEncrypt'";
  		if($res = mysqli_query($conn, $q)){
  			if(mysqli_num_rows($res)>0){
  				$resArr = mysqli_fetch_assoc($res);

  				$uniq_id = sha1(uniqid());
  				$query = "UPDATE  `users` SET  `session` =  '$uniq_id' WHERE id=".$resArr['id'];
	  			if(mysqli_query($conn, $query)){
  					$arr['result'] = "Success";
  					$arr['id'] = $uniq_id;
	  			}else
	  				$arr['result'] = "Session could not be created. Try again.";

  			}else
  				$arr['result'] = "No such user";
  		}else
  			$arr['result'] = "Error to find user.";
	  }

	  //Login
	  elseif ($_POST['action']=="chkLogin") {
	    $sessId = mysqli_escape_string($conn, $_POST['sessId']);

  		$q = "SELECT id FROM users WHERE session='$sessId'";
  		if($res = mysqli_query($conn, $q)){
  			if(mysqli_num_rows($res)>0){
  				$resArr = mysqli_fetch_assoc($res);

  				$arr['result'] = "Success";
  				$arr['id'] = $resArr['id'];

  			}else
  				$arr['result'] = "No such user";
  		}else
  			$arr['result'] = "Error to find user.";
	  }


	  // Invalid action
	  else
	  	$arr['result'] = "Improper task";

   }else
      $arr['result'] = "Improper request";

  echo json_encode($arr);   
?>