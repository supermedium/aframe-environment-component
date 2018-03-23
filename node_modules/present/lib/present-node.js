module.exports = function () {
  var time = process.hrtime();
  return time[0] * 1e3 + time[1] / 1e6;
};
