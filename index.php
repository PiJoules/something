<?php

ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);

$FILENAME = "data.csv";

$file = fopen($FILENAME, 'r');
$data = array();
while (($line = fgetcsv($file)) !== FALSE) {
	// $line is an array of the csv elements
	$data[$line[0]] = $line[1];
}
fclose($file);

?>


<!DOCTYPE html>
<html>
	<head>
		<title>Something</title>

		<style type="text/css">
			table, tr, td {
				border: 1px solid black;
			}
		</style>
	</head>
	<body>
		<button onclick="resetMoney();">Reset $$</button>
		<button id="pause" onclick="pauseAll();">Pause</button>
		<label><strong>Number display type</strong>: </label>
		<input type="radio" name="numtype" <?php if($data["numtype"] == 0) echo "checked"; ?> value="0">Whole
		<input type="radio" name="numtype" <?php if($data["numtype"] == 1) echo "checked"; ?> value="1">Rounded

		<table>
			<tr>
				<td>$$</td>
				<td id="money">...</td>
				<td>&#916;$$/sec</td>
				<td id="delta-money">...</td>
				<td>Threat (%)</td>
				<td id="threat">...</td>
			</tr>
		</table>

		<hr>

		<button class="override" onclick="overrideAmount();">Set amount</button>
		<input class="override" type="number" value="0" />

		<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
		<script type="text/javascript" src="string_math.js"></script>
		<script type="text/javascript" src="string_fraction.js"></script>
		<script type="text/javascript" src="string_math_shorthand.js"></script>
		<script type="text/javascript" src="DataManager.js"></script>
		<script type="text/javascript">
			var dm = DataManager({
				initAmount: <?php echo $data["money"]; ?> + "",
				initDisplayType: <?php echo $data["numtype"]; ?>,
				lastLogin: <?php echo $data["lastTime"]; ?> + "",
				initRate: <?php echo $data["rate"]; ?> + "", // change in money/deltaTime (default 0.1s)
			});
			var pause = false;

			function pauseAll(shouldPause){
				if (typeof shouldPause === "boolean")
					pause = shouldPause;
				if (pause){
					pause = false;
					$("#pause").text("Pause");
				}
				else {
					pause = true;
					$("#pause").text("Resume");
				}
			}

			function overrideAmount(){
				var nextAmount = $(".override[type=number]").val();
				dm.set("money", nextAmount);
			}

			function resetMoney(){
				dm.set("money",0);
			}

			setInterval(function(){
				if (!pause){
					var amount = dm.get("money") || "0";
					var change = "1";

					dm.set("money", amount.add(change));
					$("#money").text( dm.display.get("money") );
					$("#delta-money").text( dm.display.get("deltaMoney") );
				}
			}, 100);

			$("input[name='numtype']").change(function(){
				if ($(this).is(":checked")){
					dm.set("displayType", parseInt( $(this).val()) );
				}
			});

			// Catch if leaving
			window.onbeforeunload = function (e) {
				var data = [
					["money", dm.get("money")],
					["numtype", dm.get("displayType")],
					["lastTime", Date.now()],
					["rate", "1"],
				];
				$.post("/save.php", {data:data}, function(response){
					if (response != "0"){
						alert(response);
					}
				});

				// var message = "Your confirmation message goes here.",
				// e = e || window.event;
				// // For IE and Firefox
				// if (e) {
				// 	e.returnValue = message;
				// }
				// // For Safari
				// return message;
			};
		</script>
	</body>
</html>