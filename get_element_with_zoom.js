/*
  get_element_with_zoom.js 
  version 1.1 20170117
  This file is a helper script for use with phantomJS (http://phantomjs.org/) and 
  allowing you to rasterize elements of a web page by specifying a selector and zoom.
  Author - Korolev Igor 
  GitHub - https://github.com/ikorolev72
  
*/
var system = require('system');
var args = system.args;


if ( args.length < 3 || args.length > 5) {
  console.log('Check arguments for cli!');
  console.log('Usage: phantomjs get_element_with_zoom.js address  selector [ outfile  [ zoomFactor ]]');
  console.log('Sample: phantomjs get_element_with_zoom.js http://yandex.ru ".home-logo__default" yandex.png 2');
  console.log('Sample: phantomjs get_element_with_zoom.js http://yandex.ru ".home-logo__default" yandex.png ');
  console.log('Sample: phantomjs get_element_with_zoom.js http://yandex.ru ".home-logo__default"  ');
  phantom.exit(2);
}

var page = require('webpage').create(),

// please, set the values viewpw and width if your zoom screenshot bigger than screenshot
	delay = 1000,
    ntop = 0,
    left = 0,
    width = 1440,
    height = 768,
    viewpw = 1440,
    viewph = 768,

	address = args[1],
	elementSelector = args[2] , 
    outfile = args[3] || 'output.png',
	zoomFactor = args[4] || 2 ;

	
	
page.viewportSize = { width: viewpw, height: viewph };
page.zoomFactor = zoomFactor;
page.devicePixelRatio = zoomFactor;
//window.devicePixelRatio =2;
page.open(address, function(status) {
    if (status !== 'success') {
        console.log('Unable to load the address!');
        phantom.exit(1);
    } else {

		var elementClipRect = page.evaluate( function(selector) {
			var elementToRasterize = document.querySelector(selector);
			if (!elementToRasterize) {
				return;
			}
			else {
				var elementRect = elementToRasterize.getBoundingClientRect();
			
				return {
					top:    elementRect.top,
					left:   elementRect.left,
					width:  elementRect.width,
					height: elementRect.height
				};
			}
		}, elementSelector );	
		// console.log("[info] - applying clipping rectangle for selection " + JSON.stringify(elementClipRect));

	
		if (!elementClipRect) {
			console.log("Unable to locate element for provided selector! (" + elementSelector + ")");
			phantom.exit(1);			
		}
	
        window.setTimeout( function () {
			page.zoomFactor = zoomFactor;
			page.devicePixelRatio = zoomFactor;
			//window.devicePixelRatio =2;
			var itop=elementClipRect.top * zoomFactor;
			var ileft=elementClipRect.left * zoomFactor;
			var iwidth=elementClipRect.width * zoomFactor;
			var iheight=elementClipRect.height * zoomFactor;
			
			// console.log( itop +" "+ileft+" "+iwidth+" "+iheight );
			page.clipRect = { top: itop, left: ileft, width: iwidth, height: iheight };
            page.render( outfile, { format: 'png' });
			phantom.exit(0);
		}, delay ) ;		
	}
});


