/**
* Server Compiler
**/

exports.compile = function(tools, rule) {
	var Manifest = tools.Manifest;

	var js = new Manifest();

	var dir = rule.dir;
	var args = rule.args;
	var targets = rule.targets;

	js.pre('<script type="text/javascript">');
	js.post('</script>')

	var runScript = function(data, path) {
		var script = require(path);
		return 'new Slider('+script.run()+');';
	};

	for(var i=targets.length-1; i>=0; i--) {
		var target = targets[i];
		var options = target.options;

		js.filterNext(runScript);
		js.add(target.pattern, target.options, dir);
	}

	return {
		js: js.out(),
	};
};