var system = require('system');
var args = system.args;



if (args.length != 12) {
  console.log('Check arguments for cli!');
  console.log('Usage: phantomjs get_screenshot_phantomjs.js address outfile delay top left width height viewpw viewph selector zoomFactor');
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
    viewph = args[9];
	elementSelector = args[10]; 
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
	
		if (!elementClipRect) {
			console.log("[error] - Unable to locate element for provided selector! (" + elementSelector + ")");
			phantom.exit(1);			
		}
		else
		{
			page.clipRect = elementClipRect;
			console.log("[info] - applying clipping rectangle for selection " + JSON.stringify(elementClipRect));
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

