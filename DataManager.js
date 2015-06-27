// Enums
var NumDisplayType = {
	WHOLE: 0,
	ROUNDED: 1
};

var DataManager = function(initAmount, initDisplayType){
	// May be settable or gettable
	var amounts = {
		money: (initAmount || 0) + "",
		displayType: initDisplayType || NumDisplayType.WHOLE,
	};
	// All gettable
	var display = {
		money: function(){
			if (amounts.displayType === NumDisplayType.ROUNDED){
				return roundedDisplay(amounts.money);
			}
			return amounts.money;
		},
	};
	// Only settable
	var canSet = {
		money: function(val){
			amounts.money = val + "";
		},
		displayType: function(val){
			amounts.displayType = val;
		},
	};

	/* Round a function to the nearest power of 1000 */
	function roundedDisplay(amount){
		if (amount.greaterOrEqual("1000")){
			return amount.divide("1000", 1) + "k";
		}
		return amount;
	}

	return {
		get: function(key){
			if (key in amounts){
				return amounts[key];
			}
			return null;
		},
		set: function(key, val){
			if (key in amounts && key in canSet){
				amounts[key] = val;
			}
		},
		display: {
			get: function(key){
				if (key in display){
					return display[key];
				}
				return null;
			} 
		}
	};
}