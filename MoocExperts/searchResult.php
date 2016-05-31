<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset=utf-8>
		<meta name="viewport" content="width=620">
		<title> Search </title>
		<link rel="stylesheet" media="screen" type="text/css" title="layout" href="thcol.css"/>

	</head>
	
	<body>
		<p style="text-align:center; color:black"> 
			<u><b> Research </b></u>
		</p>
		<div id="news">
			This would be a column for news / report links ?
		</div>
		
		
		<div id="ranking">
		<p style="text-align:center; color:black"> 
			<u><b> Current Rankings : </b></u>
		</p>
		<p style="text-align:center; color:black">  Top Moocers : </p>
		<p> 1st : Cuong  10000 points <br> 2nd : Peter 9999 points <br> 3rd : Louis 9998 points </p>
		<p style="text-align:center; color:black"> Your position : </p>
		<p> 100th with 0 points </p>
		
		<br><br><br>
		<p style="text-align:center; color:black"> 
			<u><b> Current Challenges : </b></u>
		</p>
		</div>
		
		
		<div id="centre">
			<?php
				if(empty($_POST['option']) ){
					echo 'Please chose a search'."'".'s option. <br>';
				}
				if(empty($_POST['keyW']) ){
					echo 'Please enter the key word related to your research. <br>';
				}
				
				$keyW = (isset($_POST['keyW'])) ? $_POST['keyW'] : "";
				$option = (isset($_POST['option'])) ? $_POST['option'] : "";
				$display = "";
				if($option=="course_Name"){
					$display = "name";
				}
				else if($option=="course_ID"){
					$display = "ID number";
				}
				else { $display = $option;}
				echo 'Results linked with '."$keyW".' in the '."$display".' of the course'."'s".' database. <br>';
				
				
				echo '<br>';echo '<br>';echo '<br>';echo '<br>';echo '<br>';echo '<br>';echo '<br>';echo '<br>';echo '<br>';
				
		
				echo '<p> click here to return to the <a href='."home.php".'>  home page </a></p>';
			
		
		
			?>
		</div>

	</body>
</html>