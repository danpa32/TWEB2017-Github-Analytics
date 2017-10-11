module.exports = {
    "extends": "airbnb-base",
    "env": {
	    "mocha": true
    },
    "plugins" : ["chai-expect", "chai-friendly"],
    "rules": {
        "chai-expect/missing-assertion": 2,
	    "chai-expect/terminating-properties": 1,
	    "no-unused-expressions": 0,
	    "chai-friendly/no-unused-expressions": 2
    }
};
