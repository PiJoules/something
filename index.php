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
		<p>
			<label><strong>Number display type</strong>: </label>
			<input type="radio" name="numtype" checked value="0">Whole
			<input type="radio" name="numtype" value="1">Rounded
		</p>

		<table>
			<tr>
				<td>$$</td>
				<td id="money" data-val='<?php echo $data["money"]; ?>'><?php echo $data["money"]; ?></td>
			</tr>
		</table>

		<hr>

		<button class="override" onclick="overrideAmount();">Set amount</button>
		<input class="override" type="text" value="0" />

		<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
		<script type="text/javascript" src="string_math.js"></script>
		<script type="text/javascript" src="string_fraction.js"></script>
		<script type="text/javascript" src="string_math_shorthand.js"></script>
		<script type="text/javascript">
			var pause = false;
			var NumDisplayType = {
				WHOLE: 0,
				ROUNDED: 1
			};
			var numDispType = NumDisplayType.WHOLE;

			function pauseAll(shouldPause){
				if (typeof nextAmount === "boolean")
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
				var nextAmount = $(".override[type=text]").val();
				setMoney(nextAmount);
			}

			function resetMoney(){
				setMoney(0);
			}

			function isNumber(num){
				return /^\d+$/.test(num);
			}

			function roundedDisplay(amount){
				if (amount.greaterOrEqual("1000")){
					return amount.divide("1000", 1) + "k";
				}

				return amount;
			}

			function setMoney(amount, callback){
				var displayAmount = amount || $("#money").data("val");

				switch ( numDispType ){
					case NumDisplayType.WHOLE:
						break;
					case NumDisplayType.ROUNDED:
						displayAmount = roundedDisplay(displayAmount);
						break;
				}

				if (!isNumber(amount)){
					pauseAll(true);
					alert("Amount: " + amount);
				}
				$("#money").text( displayAmount ).data("val", amount);

				if (typeof callback === "function"){
					callback(amount);
				}
			}
			function getMoney(){
				return $("#money").data("val");
			}

			setInterval(function(){
				if (!pause){
					var amount = getMoney() + "" || "0";
					var change = "1";

					setMoney(amount.add(change), function(nextAmount){

					});
				}
			}, 100);

			$("input[name='numtype']").change(function(){
				if ($(this).is(":checked")){
					numDispType = parseInt($(this).val());
				}
			});

			// Catch if leaving
			window.onbeforeunload = function (e) {
				var data = [
					["money", isNumber(getMoney()) ? getMoney() : 0]
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