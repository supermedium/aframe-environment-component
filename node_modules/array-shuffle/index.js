'use strict';
module.exports = function (arr) {
	if (!Array.isArray(arr)) {
		throw new TypeError('Expected Array, got ' + typeof arr);
	}

	var rand;
	var tmp;
	var len = arr.length;
	var ret = arr.slice();

	while (len) {
		rand = Math.floor(Math.random() * len--);
		tmp = ret[len];
		ret[len] = ret[rand];
		ret[rand] = tmp;
	}

	return ret;
};
