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
			<u><b> Research Page </b></u>
		</p>
		<div id="news">
			This would be a column for news / report links ?
			
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
			<p style="text-align:center; color:black"> <u> Research Parameters : </u></p>
		</div>
		
		<br><br><br><br>
		
		<div id="researchExtended">
			<?php
				echo '<form name='."searchOption".'  action='."searchForm.php".' method = '."POST".'>';
					echo '<INPUT type= '."radio".' name='."option".' value='."teacher".' checked> Teacher'."'".'s name <br>';
					echo '<INPUT type= '."radio".' name='."option".' value='."course_Name".'> Course'."'".'s name<br>';
					echo '<INPUT type= '."radio".' name='."option".' value='."course_ID".'> Course'."'".'s ID<br>';
					echo '<INPUT type= '."radio".' name='."option".' value='."topic".'> Course'."'".'s topic<br>';

					echo '<br>';
					echo '<input type='."submit".' value='."Continue with key words".'>';
					echo '<input type='."reset".' value='."Reset".'>';
				echo '</form> ';
		
				
				echo '<p> click here to return to the <a href='."home.php".'>  home page </a></p>';
					
			?>
		</div>
		
		<div id="courseFooter">
			<?php echo '<p> click here to acess your <a href='."course.php".'>  courses </a></p>';
			?>
			
		</div>
		<div id="challengeFooter">
			<p style="text-align:center; color:black">  Link to the challenges page, still on work </p>
		</div>

	</body>
</html>