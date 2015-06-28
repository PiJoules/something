// Enums
var NumDisplayType = {
	WHOLE: 0,
	ROUNDED: 1
};
var RateMultiplier = {
	TIMES1: 0,
	TIMES2: 1,
	TIMES4: 2,
};

var randomEvents = [
	"Money has spontaneously combusted in your wallet."
];

var DataManager = function(params){
	var defaultParams = {
		initAmount: "0",
		initDisplayType: NumDisplayType.WHOLE,
		lastLogin: Date.now() + "",
		initRate: "10",
		rateMultiplier: RateMultiplier.TIMES1,
	};
	$.extend(defaultParams, params || {});

	// May be settable; all gettable
	var amounts = {
		money: (defaultParams.initAmount || 0) + "",
		displayType: defaultParams.initDisplayType || NumDisplayType.WHOLE,
		lastMoney: "0",
		deltaTime: "1".divide( defaultParams.initRate.multiply( getMultiplier(defaultParams.rateMultiplier) ) ),
		rate: defaultParams.initRate,
		rateMultiplier: defaultParams.rateMultiplier,
		threat: getTotalThreat,
		lastEvent: "",
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
			return amounts.money.subtract( amounts.lastMoney ).multiply( amounts.rate );
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
		rateMultiplier: function(val){
			amounts.rateMultiplier = val;
			amounts.deltaTime = "1".divide( defaultParams.initRate.multiply( getMultiplier(val) ) );
		},
	};
	var addable = {
		money: function(change){
			amounts.lastMoney = amounts.money;
			amounts.money = amounts.money.add( change.multiply( getMultiplier( amounts.rateMultiplier ) ) );
			amounts.lastEvent = "";

			if (++counter > counterMax){
				var threatPercentage = getTotalThreat()/100;
				if (Math.random() < threatPercentage){
					amounts.money = amounts.money.subtract("1000");
					amounts.lastEvent = randomEvents[Math.floor(Math.random()*randomEvents.length)];
				}
				counter = 0;
			}
		},
	};

	/* Round a function to the nearest power of 1000 */
	function roundedDisplay(amount){
		if (amount.greaterOrEqual("1000")){
			return amount.divide("1000", 1) + "k";
		}
		return amount;
	}

	/* Get the actual multiplication value from the enum */
	function getMultiplier(val){
		switch (val){
			case RateMultiplier.TIMES1:
				return "1";
			case RateMultiplier.TIMES2:
				return "2";
			case RateMultiplier.TIMES4:
				return "4";
			default:
				return "1";
		}
	}

	/* Test for if a string is a number */
	function isNumber(num){
		return !isNaN(num);
	}

	/* Computing the total threat */
	function getTotalThreat(){
		var total = 0;
		/* Rate multiplier */
		switch ( (amounts || defaultParams).rateMultiplier ){
			case RateMultiplier.TIMES1:
				break;
			case RateMultiplier.TIMES2:
				total += 10;
				break;
			case RateMultiplier.TIMES4:
				total += 20;
				break;
		}
		return total;
	}

	/* Perform any initial calculations here */
	var loginTimeDiff = (Date.now()+"").subtract(defaultParams.lastLogin).divide("1000",0);
	amounts.money = amounts.money.add( loginTimeDiff.divide(amounts.deltaTime) );
	var counter = 0; // Perform something on every money addition
	var counterMax = 10;

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
			if (key in amounts && key in addable){
				addable[key](change);
			}
		},
		display: {
			get: function(key){
				if (key in display){
					return display[key]();
				}
				return null;
			} 
		}
	};
}