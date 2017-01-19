/*
  get_element_with_pixelratio.js 
  version 1.0 20170119
  This file is a helper script for use with phantomJS (http://phantomjs.org/) and 
  allowing you to rasterize elements of a web page by specifying a selector and zoom.
  Author - Korolev Igor 
  GitHub - https://github.com/ikorolev72
  
  This project based on https://github.com/DeviaVir/pixelratio-screenshots 
  
*/

//'use strict';


var page = require('webpage').create(),
    system = require('system'),
	address, output, pixelRatio, width, height;

var args = Array.prototype.slice.call(system.args, 1);
if (args.length < 2 || args.length > 5) {
  console.log('Check arguments for cli!');
  console.log('Usage: phantomjs get_element_with_pixelratio.js  URL  selector [ outfile  [ pixelRatio ] ] ] ');
  console.log('Sample: phantomjs get_element_with_pixelratio.js  http://yandex.ru ".home-logo__default" yandex.png 2');
  console.log('Sample: phantomjs get_element_with_pixelratio.js  http://yandex.ru ".home-logo__default" yandex.png ');
  console.log('Sample: phantomjsget_element_with_pixelratio.js  http://yandex.ru ".home-logo__default"  ');
  phantom.exit(2);
}

address = args[0];
elementSelector = args[1] || 'body' ;
output = args[2] || 'outfile.png';
pixelRatio = args[3] || 2 ;

page.onConsoleMessage = function(msg) {
    console.log(msg);
};

// Here we block the first (few) requests until we have set the correct window variables
var resources = [];
/*
page.onResourceRequested = function(requestData, networkRequest) {
    if((requestData.url.match(/\.js/g) !== null || requestData.url.match(/\/js\//g) !== null)) {
        if(requestData.url.match(/_phantomLoadMe/g) === null && requestData.url.match(/typekit/gi) === null) {
            console.log('Temporarily blocking too soon request to ', requestData['url']);
            resources.push(requestData['url']);
            networkRequest.abort();
        }
    }

    var reqUrl = requestData.url;
    var newUrl = requestData.url.split(',%20')[0];

    if (newUrl != reqUrl) {
      networkRequest.changeUrl(newUrl);
    }
};
*/

width = (1440*pixelRatio);
height = (900*pixelRatio);

page.viewportSize = { width: width, height: height };
page.settings.localToRemoteUrlAccessEnabled = true;
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 5.1; rv:8.0) Gecko/20100101 Firefox/7.0';

page.open(address, function (status) {
    if (status !== 'success') {
        console.log('Unable to load the address!', address, status);
        phantom.exit(1);
    } else {
        // Manipulate the DOM
        page.evaluate(function (r, urls, width, height) {
            console.log('Setting window.devicePixelRatio to ' + r);
            window.devicePixelRatio = r;
            window.onload = false;
            window.innerWidth = (width/r);
            window.innerHeight = (height/r);
            document.documentElement.offsetWidth = (document.documentElement.offsetWidth/r);
            document.documentElement.offsetHeight = (document.documentElement.offsetHeight/r);
            document.documentElement.clientWidth = (document.documentElement.clientWidth/r);
            document.documentElement.clientHeight = (document.documentElement.clientHeight/r);
            screen.width = width;
            screen.height = height;
            document.body.style.webkitTransform = "scale(" + r + ")";
            document.body.style.webkitTransformOrigin = "0% 0%";
            document.body.style.width = (100 / r) + "%";

            // Now that we've set our window, let's get those scripts again
            var _phantomReexecute = [];
            var _phantomScripts = document.getElementsByTagName("script");
            _phantomScripts = Array.prototype.slice.call(_phantomScripts);
            if(_phantomScripts.length > 0) {
                _phantomScripts.forEach(function(v) {
                    if('src' in v && v.src !== "" && v.src.match(/typekit/gi) === null) {
                        urls.push(v.src);
                    }
                    else {
                        _phantomReexecute.push({'script': v.innerHTML});
                    }
                });
            }
            var _phantomAll = document.getElementsByTagName("script");
            for (var _phantomIndex = _phantomAll.length - 1; _phantomIndex >= 0; _phantomIndex--) {
                if(_phantomAll[_phantomIndex].src.match(/typekit/gi) === null) {
                    _phantomAll[_phantomIndex].parentNode.removeChild(_phantomAll[_phantomIndex]);
                }
            }
            var _phantomHead = document.getElementsByTagName("head")[0];
            if(urls.length > 0) {
                urls.forEach(function(u) {
                    var _phantomScript = document.createElement("script");
                    _phantomScript.type = "text/javascript";
                    _phantomScript.src = u + '?_phantomLoadMe';
                    _phantomHead.appendChild(_phantomScript);
                });
            }
            if(_phantomReexecute.length > 0) {
                _phantomReexecute.forEach(function(s) {
                    var _phantomScript = document.createElement("script");
                    _phantomScript.type = "text/javascript";
                    _phantomScript.innerHTML = s.script;
                    _phantomHead.appendChild(_phantomScript); 
                });
            }

            // Make sure to execute onload scripts
            var _phantomCount = 0;
            var _phantomIntVal = setInterval(function() {
                if(window.onload !== false && window.onload !== null) {
                    window.onload();
                    clearInterval(_phantomIntVal);
                }
                _phantomCount++;

                if(_phantomCount > 10) {
                    clearInterval(_phantomIntVal);
                }
            }, 100);
        }, pixelRatio, resources, width, height);

        // Make the screenshot
		// cut the part of screenshot
        window.setTimeout(function () {
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
			// console.log( itop +" "+ileft+" "+iwidth+" "+iheight );
			var itop=elementClipRect.top ;
			var ileft=elementClipRect.left;
			var iwidth=elementClipRect.width;
			var iheight=elementClipRect.height;			
		

			page.clipRect = { top: itop, left: ileft, width: iwidth, height: iheight };
            page.render(output);
            page.release();
            phantom.exit(0);
        }, 5000);
    }
});
