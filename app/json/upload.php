<?php
	if ( !empty( $_FILES ) ) {
	    $tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
	    $uploadPath = '../img' . DIRECTORY_SEPARATOR . $_FILES[ 'file' ][ 'name' ];
	    // echo $uploadPath;
	    move_uploaded_file( $tempPath, $uploadPath );
	    $answer = array( 'answer' => 'File transfer completed' );
	    $json = json_encode( $answer );
	    echo $json;
	} else {
	    echo 'No files';
	}
?>