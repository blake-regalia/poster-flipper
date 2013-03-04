exports.manifest = {

	compiler: {
		css: 'css.js',
		bess: 'bess.js',
		js: 'js.js',
		html: 'html.js',
	},
	compilerOrder: ['head','css','bess','js','body','tail'],

	handler: {
		static: 'static.js',
	},
	
};