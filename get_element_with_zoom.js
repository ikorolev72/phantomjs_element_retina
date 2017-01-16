/*
  get_element_with_zoom.js 
  
  This file is a helper script for use with phantomJS (http://phantomjs.org/) and 
  allowing you to rasterize elements of a web page by specifying a selector and zoom.
  Author - Korolev Igor 
  GitHub - https://github.com/ikorolev72
  
*/
var system = require('system');
var args = system.args;


if (args.length != 12) {
  console.log('Check arguments for cli!');
  console.log('Usage: phantomjs get_element_with_zoom.js address outfile delay top left width height viewpw viewph selector zoomFactor');
  console.log('Sample: phantomjs get_element_with_zoom.js http://yandex.ru yandex.png 1000 0 0 1024 768 1280 920 ".home-logo__default" 0.5');
  phantom.exit(2);
}

var page = require('webpage').create(),

	address = args[1],
    outfile = args[2],
	delay = args[3],
    ntop = args[4],
    left = args[5],
    width = args[6],
    height = args[7],
    viewpw = args[8],
    viewph = args[9],
	elementSelector = args[10], 
	zoomFactor = args[11];


page.viewportSize = { width: viewpw, height: viewph };
page.zoomFactor = zoomFactor;
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

