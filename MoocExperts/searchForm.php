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
		
		</div>
		<div id="homeFooter">
			<?php echo '<p> click here to return to the <a href='."home.php".'>  home page </a></p>';
			?>			
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
				
				$option = (isset($_POST['option'])) ? $_POST['option'] : "";
				$display = "";
				if($option=="course_Name"){
					$display = "name";
				}
				else if($option=="course_ID"){
					$display = "ID number";
				}
				else { $display = $option;}
				echo 'You have chosen a research based on : the '."$display".' of the course. <br>';
				echo 'Please now enter the key word related to your research :<br>';
				
				
				echo '<form name='."searchForm".'  action='."searchResult.php".' method = '."POST".'>';
					echo '<input type='."hidden".' name='."option".' value='."'$option'".'>';
					echo '<p>';
						echo '<label>Key Word</label> : <input type='."text".' name='."keyW".' id='."keyW".' />';
					echo '</p>';
			
					echo '<input type='."submit".' value='."Research".'>';
					echo '<input type='."reset".' value='."Reset".'>';
				echo '</form> ';
		
				
				
			
		
		
			?>
		</div>

	</body>
</html>
