// Enums
var NumDisplayType = {
	WHOLE: 0,
	ROUNDED: 1
};

var DataManager = function(params){
	var defaultParams = {
		initAmount: "0",
		initDisplayType: NumDisplayType.WHOLE,
		deltaTime: "0.1", // default to 100 ms
		lastLogin: Date.now() + "",
		initRate: "1",
	};
	$.extend(defaultParams, params || {});

	// May be settable; all gettable
	var amounts = {
		money: (defaultParams.initAmount || 0) + "",
		displayType: defaultParams.initDisplayType || NumDisplayType.WHOLE,
		lastMoney: "0",
		deltaTime: defaultParams.deltaTime,
	};
	// All gettable; only for values that will be displayed
	var display = {
		money: function(){
			if (amounts.displayType === NumDisplayType.ROUNDED){
				return roundedDisplay(amounts.money);
			}
			return amounts.money;
		},
		deltaMoney: function(){
			return amounts.money.subtract( amounts.lastMoney ).divide( amounts.deltaTime );
		},
	};
	// Only settable (key with function for how to set it as value)
	var settable = {
		money: function(val){
			amounts.lastMoney = amounts.money;
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

	/* Test for if a string is a number */
	function isNumber(num){
		return !isNaN(num);
	}

	/* Perform any initial calculations here */
	var loginTimeDiff = (Date.now()+"").subtract(defaultParams.lastLogin).divide("1000",0).divide(amounts.deltaTime,0);
	console.log(loginTimeDiff);
	amounts.money = amounts.money.add( defaultParams.initRate.multiply(loginTimeDiff) );

	return {
		get: function(key){
			if (key in amounts){
				return amounts[key];
			}
			return null;
		},
		set: function(key, val){
			if (key in settable){
				settable[key](val);
			}
		},
		add: function(key, change){
			if (key in amounts && key in settable){
				var amt = amounts[key];
				if (typeof amt === "string" && isNumber(amt)){
					settable[key]( amounts[key].add(change) );
				}
				else if (typeof amt === "number"){
					settable[key]( amt+change );
				}
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