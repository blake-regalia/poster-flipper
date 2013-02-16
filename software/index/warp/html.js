/**
* HTML Compiler
**/
var zenCoding = require('./kit.zen.js');

exports.compile = function(tools, rule) {
	var Manifest = tools.Manifest;

	var head = new Manifest();
	var body = new Manifest();

	var dir = rule.dir;
	var args = rule.args;
	var targets = rule.targets;

	head.merge('\n');

	body.merge();
	body.pre('</head><body>');
	body.post('</body></html>');

	for(var i=targets.length-1; i>=0; i--) {
		var target = targets[i];
		var options = target.options;

		var msect = body;
		if(options) {
			if(options.head) {
				msect = head;
			}
			if(options.zen) {
				msect.filterNext(zenCoding.zc);
			}
		}
		msect.add(target.pattern, options, dir);
	}

	return {
		head: head.out(),
		body: body.out(),
	};
};