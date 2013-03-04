/**
* CSS Compiler
**/
exports.compile = function(tools, rule) {
	var Manifest = tools.Manifest;

	var css = new Manifest();

	var dir = rule.dir;
	var args = rule.args;
	var targets = rule.targets;

	css.pre('<style>');
	css.merge();
	css.post('</style>');

	for(var i=targets.length-1; i>=0; i--) {
		var target = targets[i];
		var options = target.options;

		css.add(target.pattern, target.options, dir);
	}

	return {
		css: css.out()
	};
};