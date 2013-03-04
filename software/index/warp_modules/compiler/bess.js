/**
* Bess Compiler
**/
require('./lib/util.jsol.js');
var parser = require('./lib/bess.parser-ie.js').parser;

var lastParseError = '';

// handle parse errors
parser.yy.parseError = function(e) {
	lastParseError = e;
};

exports.compile = function(tools, rule) {
	var Manifest = tools.Manifest;

	var bess = new Manifest();
	var css = '';
	var js = '';

	var dir = rule.dir;
	var args = rule.args;
	var targets = rule.targets;

	var parseError = '';

	bess.filterAfterMerge(function(data, file) {
		var out;
		try {
			out = parser.parse(data);
			css += '<style>\n'+out.css+'\n</style>';
			js += '<script type="text/javascript">\nvar CSS_DATA='+out.js+'\n</script>';
		} catch(e) {
			parseError = {
				module: 'Bess Parser',
				message: lastParseError.replace(/\t/g, ' '),
				source: file,
			};
		}
	});

	for(var i=targets.length-1; i>=0; i--) {
		var target = targets[i];
		var options = target.options;

		bess.add(target.pattern, target.options, dir);
	}

	bess.out();

	var delivery;
	if(parseError) {
		delivery = {
			error: parseError
		};
	}
	else {
		delivery = {
			css: css,
			js: js,
		};
	}

	return delivery;
};