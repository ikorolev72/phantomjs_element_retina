// get screenshot
//
var casper = require('casper').create({
	verbose: true,
	logLevel: "warning",
    waitTimeout: 10000,
    stepTimeout: 10000,
    pageSettings: {
	//userAgent: 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.2 Safari/537.36',
	//"loadImages": false,
	//"loadPlugins": false,         
	//"webSecurityEnabled": false,
	//"ignoreSslErrors": true
    },	
	
	onError: function(msg, backtrace) {
		// if you need to see the PhanthomJS native errors - comment next string
		throw new ErrorFunc( "fatal", "error", "filename", backtrace, msg);
	},
	onStepTimeout: function()
	{
		console.log('timeout');
		//this.clear();
		//this.page.stop();
		this.exit( 3 );
	},
	onWaitTimeout: function()
	{
		console.log('timeout');
		//this.clear();
		//this.page.stop();
		this.exit( 3 );
	},
	
});

casper.on('error', function( msg, backtrace) {
	// catch the PhantomJS errors. used only for 'incorrect path or write permissions' exit with 1
    console.log('ERROR. Cannot save the image. Check the arguments.') ;
    this.exit(1);
});

casper.on('fatal', function( msg, backtrace) {
	// catch the PhantomJS errors. used only for 'incorrect path or write permissions' exit with 1
    console.log('FATAL ERROR. Cannot save the image. Check the arguments.') ;
    this.exit(1);
});

casper.on('complete.error', function(err) {
    console.log("Complete callback has failed: " + err);
	this.exit( 1 );
});

casper.on('resourceError', function ( err ) {
    console.log('resourceError: '+err.errorCode+' '+err.errorString);
    console.log('url: '+url);
	this.exit( 1 );
});


casper.on('load.failed', function errorhandler() {
    console.log('load.failed');
});

casper.on('http.status.404', function(resource) {
    console.log(resource.url + ' is 404');
	this.exit( 1 );
})

casper.options.onLoadError = function ( resource ) {
    console.log('Cannot load page: ' + resource.requestUrl );
	this.exit( 1 );
};

casper.on('capture.saved', function( targetFile ) {
	// success 
    this.echo('Capture saved to' + targetFile );
	//this.exit( 0 );
});


/*
casper.thenOpen(url, function initialAppearance() {
  casper.waitForText('Text in deep part of page or modal');
});
*/

if ( !casper.cli.options.url || !casper.cli.options.outfile ) {
	console.log( "Incorrect arguments. Usage: casperjs get_screenshot.js --url='http://url.com' --outfile='/path/file' [--delay=1000] [--viewpw=1280] [--viewph=768] [ --top=100] [--left=120] [--width=1280] [--height=768] [--png] [--jpg] " );
	casper.exit( 2 );	
}

var c_url=casper.cli.options.url
var c_outfile=casper.cli.options.outfile
var c_delay=casper.cli.options.delay?casper.cli.options.delay:0
var c_top=casper.cli.options.top?casper.cli.options.top:0
var c_left=casper.cli.options.left?casper.cli.options.left:0
var c_width=casper.cli.options.width?casper.cli.options.width:1024
var c_height=casper.cli.options.height?casper.cli.options.height:768
var c_viewpw=casper.cli.options.viewpw?casper.cli.options.viewpw:1024
var c_viewph=casper.cli.options.viewph?casper.cli.options.viewph:768

var png=true ;	
var jpg=casper.cli.options.jpg ;

if( !casper.cli.options.png && jpg ) {
	png=false ;	
}


casper.viewport(c_viewpw, c_viewph);

casper.start( c_url ,function() {
    this.wait( c_delay, function() {
        this.echo("I've waited for "+c_delay+" ms");
    });
});


//casper.options.viewportSize = { width: c_viewpw, height: c_viewph };
//casper.viewport(1024, 768).then(function() {
    // new view port is now effective
//});

casper.then(function() {
	if( true==jpg ) {
		casper.capture( c_outfile+".jpg" , 
		{
			top: c_top,
			left: c_left,		
			width: c_width,
			height: c_height
		}, 
		{
			format: 'jpg',
			quality: 50,					
		}
		)
	}
	if( true==png) {
		casper.capture( c_outfile+".png" , {	
			top: c_top,
			left: c_left,		
			width: c_width,
			height: c_height
		})
	}	
});

casper.run();


