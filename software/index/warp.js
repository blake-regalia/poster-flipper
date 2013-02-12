
// require filesystem
var fs = require('fs');

// extend function
function __() {
	var obj = arguments[0];
	for(var i=1; i<arguments.length; i++) {
		var arg = arguments[i];
		for(var e in arg) {
			obj[e] = arg[e];
		}
	}
	return obj;
}
/**
* Manifest Class builds a long string containing the merged contents of the files given
**/

// require filesystem
var fs = require('fs');

(function(namespace) {
	
	/**
	* private static:
	**/
	var __func__ = 'Manifest';
	
	var instance;


	var castArray = Array.prototype.slice;
	
	var construct = function() {
		
		/**
		* private:
		**/
		var echoMerge = true;

		var resolver = [];
		var directory = {};

		var finalPre = '\n';
		var finalOut = '';
		var finalPost = '\n';
		
		var mFilter;
		
		/**
		* public operator() ();
		**/
		var operator = function() {
			
		};
		
		
		/**
		* public:
		**/
			operator['filterNext'] = function(filter) {
				mFilter = filter;
			};

			operator['add'] = function(pattern, args, dir) {
				var b = '';

				pattern = pattern
					.replace(/\./g, '\\.')
					.replace(/\-/g, '\\-')
					.replace(/\//g, '\\/')
					.replace(/\(/g, '\\(')
					.replace(/\)/g, '\\)')
					.replace(/\+/g, '\\+')
					.replace(/\{/g, '\\{')
					.replace(/\}/g, '\\}')
					.replace(/\*/g, '.*');

				pattern = new RegExp('^'+pattern+'$', 'i');

				var indicies = [];
				var files = {};
				var allFiles = fs.readdirSync('./'+dir);

				// iterate over all the files, insert them to index by their name length
				for(var i=allFiles.length-1; i>=0; i--) {
					var sFile = allFiles[i];
					if(pattern.test(sFile) && !directory[sFile]) {
						var sFileLen = sFile.length;
						if(!files[sFileLen]) {
							files[sFileLen] = [];
							indicies.push(sFileLen);
						}
						files[sFileLen].push(sFile);
						directory[sFile] = true;
					}
				}

				// sort the indicies of the list
				indicies.sort(function(a,b){return a-b});

				// build string
				var indiciesLen = indicies.length;
				for(var ii=0; ii<indiciesLen; ii++) {
					var index = indicies[ii];

					var fileList = files[index];
					var fileListLen = fileList.length;
					for(var f=fileListLen-1; f>=0; f--) {
						var file = fileList[f];
						var path = dir+'/'+file;

						for(var i=resolver.length-1; i>=0; i--) {
							var resolve = resolver[i];
							switch(typeof resolve) {
								case 'string':
									b += resolve;
									break;

								case 'number':
									switch(resolve) {
										case pcs['FILENAME']:
											b += file.substr(0, file.lastIndexOf('.'));
											break;
										case pcs['FILENAME_EXT']:
											b += file;
											break;
										case pcs['RELATIVE_PATH']:
											b += path;
											break;
										case pcs['ABSOLUTE_PATH']:
											b += 'abs{'+file+'}';
											break;
									}
									break;

								default:
									pcs.warn('failed to understand argument: ',resolve);
									break;
							}
						}

						if(echoMerge) {
							var data = fs.readFileSync(path, 'utf-8');
							if(mFilter) {
								data = mFilter(data);
							}
							b += data;
						}
					}
				}

				mFilter = null;
				finalOut += b;
			};

			operator['append'] = function() {
				for(var i=0; i<arguments.length; i++) {
					finalOut += arguments[i];
				}
			};

			operator['out'] = function() {
				return finalPre+'\n'+finalOut+finalPost+'\n';
			};

			operator['link'] = function() {
				echoMerge = false;
				resolver = castArray.call(arguments).reverse();
			};

			operator['merge'] = function() {
				echoMerge = true;
				resolver = castArray.call(arguments).reverse();
			};

			operator['pre'] = function(text) {
				finalPre += text;
			};

			operator['post'] = function(text) {
				finalPost += text;
			};
		
		
		return operator;
		
	};
	
	
	
	/**
	* public static operator() ()
	**/
	var pcs = namespace[__func__] = function() {
		if(this !== namespace) {
			instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			return instance;
		}
	};
	
	
	
	/**
	* public static:
	**/

		// constants
		var constInt = 0;
		pcs['FILENAME']      = constInt++;
		pcs['FILENAME_EXT']  = constInt++;
		pcs['RELATIVE_PATH'] = constInt++;
		pcs['ABSOLUTE_PATH'] = constInt++;
		
		//
		pcs['toString'] = function() {
			return __func__+'()';
		};
		
		//
		pcs['error'] = function() {
			var args = Array.cast(arguments);
			args.unshift(__func__+':');
			console.error.apply(console, args);
		};
		
		//
		pcs['warn'] = function() {
			var args = Array.cast(arguments);
			args.unshift(__func__+':');
			console.warn.apply(console, args);
		};
		
})(global);
/**
* Manages compilers for output
**/

(function(namespace) {
	
	/**
	* private static:
	**/
	var __func__ = 'Compilers';
	
	// prepare a hash to hold the compilers
	var compilers = {};
	var compilerOrder = {};
	

	// parse the compilers manifest
	(function() {

		var data = fs.readFileSync('./warp/compilers.json', 'utf-8');
		var compilersJSON = JSON.parse(data);

		for(var e in compilersJSON) {

			var definition = compilersJSON[e];

			// if this definition is an arg
			if(e[0] === ':') {
				if(e === ':order') {
					for(var i=0; i<definition.length; i++) {
						// commit this compiler alias to the order object
						compilerOrder[definition[i]] = '';
					}
				}
			}

			// otherwise it is a dir
			else {
				var compilerFile = definition.compiler;
				var attempt = require('./warp/'+compilerFile);
				if(attempt) {
					compilers[e] = attempt;
				}
				else {
					console.warn('failed to inclue compiler file: '+compilerFile);
				}
			}
		}
	})();
	
	
	/**
	* public static operator() ()
	**/
	var pcs = namespace[__func__] = {};
	
	
	/**
	* public static:
	**/
		
		//
		pcs['toString'] = function() {
			return __func__+'()';
		};

		// handles aliasing of compilers
		pcs['get'] = function(alias) {
			if(compilers[alias]) {
				return __({}, compilers[alias]);
			}
			else {
				return false;
			}
		};

		// returns a new compiler order object
		pcs['getOrder'] = function() {
			return __({}, compilerOrder);
		};
		
})(global);
// requires http for server
var http = require('http');


(function(namespace) {
	
	/**
	* private static:
	**/
	var __func__ = 'WarpServer';
	
	var instance;
	
	
	var construct = function() {
		
		/**
		* private:
		**/
		var cache = {};

		var handleResponse = function(response, rule) {
			response.end(
				rule.compile()
			);
		};
		
		/**
		* public operator() ();
		**/
		var operator = function() {
			
		};
		
		
		/**
		* public:
		**/
			operator[''] = function() {
				
			};

			operator['launch'] = function(warpHandler, port) {
				
				http.createServer(function(request, response) {
					var rules = warpHandler.getRules();

					var url = request.url;
					var match = false;

					if(cache[url] && !rules.virgin) {
						match = cache[url];
					}
					else {
						rules.virgin = false;
						for(var i=rules.length-1; i>=0; i--) {
							var rule = rules[i];
							if(rule.regex.test(url)) {
								match = rule;
								break;
							}
						}

						cache[url] = match;
					}

					if(match) {
						var args = match.args;
						console.log(match);
						
						// static file serving
						if(args.static) {
							// requires mime for easy static hosting
							var mime = require('mime');
							
							var path = __dirname+url;
							fs.readFile(path, 'binary', function(err, file) {
								if(err) {        
									response.writeHead(500, {"Content-Type": "text/plain"});
									response.write(err + "\n");
									response.end();
									return;
								}

								response.writeHead(200, {'Content-Type': mime.lookup(path)});
								response.write(file, "binary");
								response.end();
							});
						}
						else {
							response.writeHead(200, {'Content-Type': 'text/html'});
							handleResponse(response, match);
						}
					}
					else {
						response.writeHead(404, {'Content-Type': 'text/plain'});
						response.end('Not Found\n');
					}
				}).listen(port || 2314, '127.0.0.1');
			};
		
		return operator;
		
	};
	
	
	
	/**
	* public static operator() ()
	**/
	var pcs = namespace[__func__] = function() {
		if(this !== namespace) {
			instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			return instance;
		}
	};
	
	
	
	/**
	* public static:
	**/
		
		//
		pcs['toString'] = function() {
			return __func__+'()';
		};
		
		//
		pcs['error'] = function() {
			var args = Array.cast(arguments);
			args.unshift(__func__+':');
			console.error.apply(console, args);
		};
		
		//
		pcs['warn'] = function() {
			var args = Array.cast(arguments);
			args.unshift(__func__+':');
			console.warn.apply(console, args);
		};
		
})(global);
var ManifestParser={};(function(exports, module){/* Jison generated parser */
var warp = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"grammar":3,"rules":4,"EOF":5,"rule":6,"ruleMore":7,"URL":8,"reqSpecs":9,"dirMore":10,":":11,"reqArgs":12,"REQ_SPEC":13,"dirs":14,"dir":15,"DIR":16,"argsOptional":17,"filesOptional":18,"args":19,"DIR_SPEC":20,"files":21,"file":22,"fileOptions":23,"fileMore":24,"fileOptionsMore":25,"FILE_SPEC":26,"FILE":27,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",8:"URL",11:":",13:"REQ_SPEC",16:"DIR",20:"DIR_SPEC",26:"FILE_SPEC",27:"FILE"},
productions_: [0,[3,2],[4,2],[7,1],[7,0],[6,3],[9,2],[9,0],[12,2],[12,0],[14,2],[10,1],[10,0],[15,3],[17,2],[17,0],[19,2],[19,0],[18,1],[18,0],[21,3],[23,2],[23,0],[25,2],[25,0],[24,1],[24,0],[22,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1:
			return develop($$[$0-1]);
		
break;
case 2:
			this.$ = __($$[$0], $$[$0-1]);
		
break;
case 4:
			this.$ = {};
		
break;
case 5:
			this.$ = {};
			this.$[$$[$0-2]] = {
				dirs: $$[$0],
				args: $$[$0-1],
			};
		
break;
case 6:
			this.$ = $$[$0];
		
break;
case 7:
			this.$ = {};
		
break;
case 8:
			this.$ = $$[$0];
			this.$[$$[$0-1]] = true;
		
break;
case 9:
			this.$ = {};
		
break;
case 10:
			this.$ = $$[$0];
			this.$.push($$[$0-1]);
		
break;
case 12:
			this.$ = [];
		
break;
case 13:
			this.$ = __($$[$0], $$[$0-1], {
				dir: $$[$0-2],
			});
		
break;
case 14:
			this.$ = $$[$0];
		
break;
case 15:
			this.$ = {
				args: {},
			};
		
break;
case 16:
			this.$ = $$[$0];
			this.$.args[$$[$0-1]] = true;
		
break;
case 17:
			this.$ = {
				args: {},
			};
		
break;
case 18:
			this.$ = {
				targets: $$[$0],
			};
		
break;
case 19:
			this.$ = {};
		
break;
case 20:
			this.$ = $$[$0];
			this.$.push({
				pattern: $$[$0-2],
				options: $$[$0-1],
			});
		
break;
case 21:
			this.$ = $$[$0];
		
break;
case 22:
			this.$ = {};
		
break;
case 23:
			this.$ = $$[$0];
			this.$[$$[$0-1]] = true;
		
break;
case 24:
			this.$ = {};
		
break;
case 26:
			this.$ = [];
		
break;
}
},
table: [{3:1,4:2,6:3,8:[1,4]},{1:[3]},{5:[1,5]},{4:7,5:[2,4],6:3,7:6,8:[1,4]},{5:[2,7],8:[2,7],9:8,11:[1,9],16:[2,7]},{1:[2,1]},{5:[2,2]},{5:[2,3]},{5:[2,12],8:[2,12],10:10,14:11,15:12,16:[1,13]},{5:[2,9],8:[2,9],12:14,13:[1,15],16:[2,9]},{5:[2,5],8:[2,5]},{5:[2,11],8:[2,11]},{5:[2,12],8:[2,12],10:16,14:11,15:12,16:[1,13]},{5:[2,15],8:[2,15],11:[1,18],16:[2,15],17:17,27:[2,15]},{5:[2,6],8:[2,6],16:[2,6]},{5:[2,9],8:[2,9],12:19,13:[1,15],16:[2,9]},{5:[2,10],8:[2,10]},{5:[2,19],8:[2,19],16:[2,19],18:20,21:21,22:22,27:[1,23]},{5:[2,17],8:[2,17],16:[2,17],19:24,20:[1,25],27:[2,17]},{5:[2,8],8:[2,8],16:[2,8]},{5:[2,13],8:[2,13],16:[2,13]},{5:[2,18],8:[2,18],16:[2,18]},{5:[2,22],8:[2,22],11:[1,27],16:[2,22],23:26,27:[2,22]},{5:[2,27],8:[2,27],11:[2,27],16:[2,27],27:[2,27]},{5:[2,14],8:[2,14],16:[2,14],27:[2,14]},{5:[2,17],8:[2,17],16:[2,17],19:28,20:[1,25],27:[2,17]},{5:[2,26],8:[2,26],16:[2,26],21:30,22:22,24:29,27:[1,23]},{5:[2,24],8:[2,24],16:[2,24],25:31,26:[1,32],27:[2,24]},{5:[2,16],8:[2,16],16:[2,16],27:[2,16]},{5:[2,20],8:[2,20],16:[2,20]},{5:[2,25],8:[2,25],16:[2,25]},{5:[2,21],8:[2,21],16:[2,21],27:[2,21]},{5:[2,24],8:[2,24],16:[2,24],25:33,26:[1,32],27:[2,24]},{5:[2,23],8:[2,23],16:[2,23],27:[2,23]}],
defaultActions: {5:[2,1],6:[2,2],7:[2,3]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == "undefined")
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === "function")
        this.parseError = this.yy.parseError;
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || 1;
        if (typeof token !== "number") {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == "undefined") {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
        if (typeof action === "undefined" || !action.length || !action[0]) {
            var errStr = "";
            if (!recovering) {
                expected = [];
                for (p in table[state])
                    if (this.terminals_[p] && p > 2) {
                        expected.push("'" + this.terminals_[p] + "'");
                    }
                if (this.lexer.showPosition) {
                    errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
                } else {
                    errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1?"end of input":"'" + (this.terminals_[symbol] || symbol) + "'");
                }
                this.parseError(errStr, {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }
        }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0)
                    recovering--;
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column};
            if (ranges) {
                yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
            }
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
            if (typeof r !== "undefined") {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}
};


function genRegex(pattern) {
	return new RegExp('^'
		+pattern
			.replace(/\./g, '\\.')
			.replace(/\-/g, '\\-')
			.replace(/\//g, '\\/')
			.replace(/\(/g, '\\(')
			.replace(/\)/g, '\\)')
			.replace(/\+/g, '\\+')
			.replace(/\{/g, '\\{')
			.replace(/\}/g, '\\}')
			.replace(/\*/g, '.*')
		+'$', 'i');
}

function develop(rules) {
	var compiledRules = [];
	for(var e in rules) {
		compiledRules.push({
			regex: genRegex(e),
			args: rules[e].args,
			compile: constructUrlDef(e, rules[e].dirs)
		});
	}
	return compiledRules;
}

function constructUrlDef(url, def) {
	return function() {
		var order = Compilers.getOrder();

		for(var i=def.length-1; i>=0; i--) {
			var sect = dirAction(def[i]);
			for(var s in sect) {
				order[s] += sect[s];
			}
		}

		var b = '';
		for(var e in order) {
			b += order[e];
		}
		return b;
	};
}

function dirAction(action) {
	var alias = action.dir;
	var spec = Compilers.get(alias);
	if(!spec) {
		console.error('alias not found: ',alias);
		return {};
	}
	return spec.compile(global, action);
}

/* Jison generated lexer */
var lexer = (function(){
var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        if (this.options.ranges) this.yylloc.range = [0,0];
        this.offset = 0;
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) this.yylloc.range[1]++;

        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length-len-1);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length-1);
        this.matched = this.matched.substr(0, this.matched.length-1);

        if (lines.length-1) this.yylineno -= lines.length-1;
        var r = this.yylloc.range;

        this.yylloc = {first_line: this.yylloc.first_line,
          last_line: this.yylineno+1,
          first_column: this.yylloc.first_column,
          last_column: lines ?
              (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length:
              this.yylloc.first_column - len
          };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
less:function (n) {
        this.unput(this.match.slice(n));
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            tempMatch,
            index,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (!this.options.flex) break;
            }
        }
        if (match) {
            lines = match[0].match(/(?:\r\n?|\n).*/g);
            if (lines) this.yylineno += lines.length;
            this.yylloc = {first_line: this.yylloc.last_line,
                           last_line: this.yylineno+1,
                           first_column: this.yylloc.last_column,
                           last_column: lines ? lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length};
            this.yytext += match[0];
            this.match += match[0];
            this.matches = match;
            this.yyleng = this.yytext.length;
            if (this.options.ranges) {
                this.yylloc.range = [this.offset, this.offset += this.yyleng];
            }
            this._more = false;
            this._input = this._input.slice(match[0].length);
            this.matched += match[0];
            token = this.performAction.call(this, this.yy, this, rules[index],this.conditionStack[this.conditionStack.length-1]);
            if (this.done && this._input) this.done = false;
            if (token) return token;
            else return;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(),
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    },
topState:function () {
        return this.conditionStack[this.conditionStack.length-2];
    },
pushState:function begin(condition) {
        this.begin(condition);
    }});
lexer.options = {};
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START
switch($avoiding_name_collisions) {
case 0: return 8; 
break;
case 1: this.begin('dir'); 
break;
case 2: 
break;
case 3: this.begin('reqSpec'); return yy_.yytext; 
break;
case 4: return 13; 
break;
case 5: this.popState(); this.begin('dir'); 
break;
case 6: this.popState(); 
break;
case 7: return 16; 
break;
case 8: this.begin('file'); 
break;
case 9: 
break;
case 10: this.popState(); 
break;
case 11: this.begin('dirSpec'); return yy_.yytext; 
break;
case 12: return 20; 
break;
case 13: this.popState(); this.begin('file'); 
break;
case 14: this.popState(); 
break;
case 15: this.popState(); this.popState(); 
break;
case 16: return 27; 
break;
case 17: 
break;
case 18: this.popState(); 
break;
case 19: this.popState(); this.popState(); 
break;
case 20: this.begin('fileSpec'); return yy_.yytext; 
break;
case 21: return 26; 
break;
case 22: this.popState(); 
break;
case 23: this.popState(); this.popState(); 
break;
case 24: this.popState(); this.popState(); this.popState(); 
break;
case 25:  
break;
case 26: return yy_.yytext; 
break;
case 27: return 5; 
break;
}
};
lexer.rules = [/^(?:([^ \t\r\n:]+))/,/^(?:(\r?\n[\t]))/,/^(?:(\r?[\n]))/,/^(?::)/,/^(?:([^ \t\r\n:]+))/,/^(?:(\r?\n[\t]))/,/^(?:(\r?[\n]))/,/^(?:([^ \t\r\n:]+))/,/^(?:(\r?\n\t[\t]))/,/^(?:(\r?\n[\t]))/,/^(?:(\r?[\n]))/,/^(?::)/,/^(?:([^ \t\r\n:]+))/,/^(?:(\r?\n\t[\t]))/,/^(?:(\r?\n[\t]))/,/^(?:(\r?[\n]))/,/^(?:([^ \t\r\n:]+))/,/^(?:(\r?\n\t[\t]))/,/^(?:(\r?\n[\t]))/,/^(?:(\r?[\n]))/,/^(?::)/,/^(?:([^ \t\r\n:]+))/,/^(?:(\r?\n\t[\t]))/,/^(?:(\r?\n[\t]))/,/^(?:(\r?[\n]))/,/^(?:([ ])+)/,/^(?:.)/,/^(?:$)/];
lexer.conditions = {"reqSpec":{"rules":[4,5,6,25,26,27],"inclusive":true},"dir":{"rules":[7,8,9,10,11,25,26,27],"inclusive":true},"dirSpec":{"rules":[12,13,14,15,25,26,27],"inclusive":true},"file":{"rules":[16,17,18,19,20,25,26,27],"inclusive":true},"fileSpec":{"rules":[21,22,23,24,25,26,27],"inclusive":true},"INITIAL":{"rules":[0,1,2,3,25,26,27],"inclusive":true}};
return lexer;})()
parser.lexer = lexer;
function Parser () { this.yy = {}; }Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();
if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = warp;
exports.Parser = warp.Parser;
exports.parse = function () { return warp.parse.apply(warp, arguments); }
exports.main = function commonjsMain(args) {
    if (!args[1])
        throw new Error('Usage: '+args[0]+' FILE');
    var source, cwd;
    if (typeof process !== 'undefined') {
        source = require('fs').readFileSync(require('path').resolve(args[1]), "utf8");
    } else {
        source = require("file").path(require("file").cwd()).join(args[1]).read({charset: "utf-8"});
    }
    return exports.parser.parse(source);
}
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(typeof process !== 'undefined' ? process.argv.slice(1) : require("system").args);
}
}})(ManifestParser);

/**
* WarpHandler class
**/

(function(namespace) {
	
	/**
	* private static:
	**/
	var __func__ = 'WarpHandler';
	
	var instance;
	
	
	var construct = function() {
		
		/**
		* private:
		**/
		var manifestFilename = null;
		var manifestMTime = 0;
		var cachedRules = {};
		
		/**
		* public operator() ();
		**/
		var operator = function() {
			
		};
		
		
		/**
		* public:
		**/
			operator[''] = function() {
				
			};

			operator['getRules'] = function() {
				if(!manifestFilename) return pcs.warn('no manifest file given');
				var stat = fs.statSync(manifestFilename);
				if(!stat) return pcs.error('failed to get stat for manifest file: `',manifestFilename,'`');
				if(stat.mtime.getTime() != manifestMTime) {
					manifestMTime = stat.mtime.getTime();
					var data = fs.readFileSync(manifestFilename)+'';
					cachedRules = ManifestParser.parse(data);
					cachedRules.virgin = true;
				}
				return cachedRules;
			};

			operator['setManifest'] = function(filename) {
				manifestFilename = filename;
			};
		
		
		return operator;
		
	};
	
	
	
	/**
	* public static operator() ()
	**/
	var pcs = namespace[__func__] = function() {
		if(this !== namespace) {
			instance = construct.apply(this, arguments);
			return instance;
		}
		else {
			return instance;
		}
	};
	
	
	
	/**
	* public static:
	**/
		
		//
		pcs['toString'] = function() {
			return __func__+'()';
		};
		
		//
		pcs['error'] = function() {
			var args = Array.cast(arguments);
			args.unshift(__func__+':');
			console.error.apply(console, args);
		};
		
		//
		pcs['warn'] = function() {
			var args = Array.cast(arguments);
			args.unshift(__func__+':');
			console.warn.apply(console, args);
		};
		
})(global);
/**
* Warp Console
**/


(function() {
	var cwd = process.cwd();

	var warpHandler = new WarpHandler();
	var warpServer = new WarpServer();

	// establish handler options
	warpHandler.setManifest('manifest.txt');


	var argv = process.argv;
	for(var i=2; i<argv.length; i++) {
		var arg = argv[i];

		switch(arg) {

			case 'host':
				var port = null;
				warpServer.launch(warpHandler, port);
				break;

			case 'out':
			case 'compile':
				var rules = warpHandler.getRules();

				var target = argv[++i];
				var file = argv[++i];

				var match;
				for(var ri=rules.length-1; ri>=0; ri--) {
					var rule = rules[ri];
					if(rule.regex.test(target)) {
						match = rule;
						break;
					}
				}
				if(match) {
					var outdir = './out';
					if(fs.existsSync(outdir)) {
						try {
							var stats = fs.lstatSync(outdir);
							if(!stats.isDirectory()) {
								console.error(outdir+' already exists but is not a valid directory');
								process.exit(1);
							}
						} catch(e) {
							console.error('failed to create/open output directory: '+outdir);
							process.exit(1);
						}
					}
					else {
						fs.mkdirSync(outdir);
					}

					fs.writeFileSync(outdir+'/'+file, rule.compile(), 'utf-8');

				}
				break;
		}
	}

})();
