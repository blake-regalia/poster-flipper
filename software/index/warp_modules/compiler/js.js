/**
* JavaScript Compiler
**/
exports.compile = function(tools, rule) {
	var Manifest = tools.Manifest;

	var js = new Manifest();

	var dir = rule.dir;
	var args = rule.args;
	var targets = rule.targets;

	if(args.merge) {
		js.pre('<script type="text/javascript">');
		js.merge('\n\n/************************\n** ',Manifest.FILENAME_EXT, '\n************************/\n');
		js.post('</script>');
	}
	else {
		js.link('<script type="text/javascript" src="',Manifest.RELATIVE_PATH,'"></script>\n');
	}
	for(var i=targets.length-1; i>=0; i--) {
		var target = targets[i];
		js.add(target.pattern, target.options, dir);
	}

	return {
		js: js.out(),
	};
};