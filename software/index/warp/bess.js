/**
* Bess Compiler
**/
var parser = require('./bess-parser.js');

exports.compile = function(tools, rule) {
	var Manifest = tools.Manifest;

	var bess = new Manifest();
	var css = new Manifest();
	var js = new Manifest();

	var dir = rule.dir;
	var args = rule.args;
	var targets = rule.targets;

	css.merge();
	css.pre('<style>');
	css.post('</style>');

	js.merge();
	js.pre('<script type="text/javascript">\nvar CSS=');
	js.post('\n</script>')

	var parseBess = function(data) {
		var out = parser.parse(data);
		css.append(out.css);
		js.append(out.js);
	};

	for(var i=targets.length-1; i>=0; i--) {
		var target = targets[i];
		var options = target.options;

		bess.filterNext(parseBess);
		bess.add(target.pattern, target.options, dir);
	}

	return {
		bess: css.out(),
		js: js.out(),
	};
};