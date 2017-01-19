#   get screenshot of page element with zoom and multiply pixelRatio factor

##  What is it?
Get the screenshot of any web page css element with zoom and or pixelRatio effect.


* Version 1.0 2017.01.16

### How to install? ###
This script require nodejs and phantomjs ( see `https://gist.github.com/julionc/7476620` ).



### 		How to run
There are tho scripts:
get_element_with_pixelratio.js and get_element_with_zoom.js

	1.	`get_element_with_pixelratio.js` - get the element of page ( by selector ) and render it with rixelRaito ( by default = 2 ).
Very usefull if you need get the bigger images from the page.

Usage: `phantomjs get_element_with_pixelratio.js  URL  selector [ outfile  [ pixelRatio ] ] ]`
by default outfile=outfile.png, pixelRatio=2


	2.	`get_element_with_zoom.js` - get the element of zoomed page ( by selector ) and render it with rixelRaito ( by default = 2 ).
If requested 

Usage: `phantomjs get_element_with_zoom.js URL selector [ outfile [ zoomFactor ]]`
by default outfile=outfile.png, zoomFactor=2



where:
	+ URL - url of page ( eg `http://google.com` )
	+ outfile - save screenshot to this file ( eg `outfile.png` by default )
	+ selector - specify a selector ( eg `"#livepress-update-20461291"` or `".home-logo__default"` or `"body"` if you requre full page screenshot)
	+ zoomFactor - zoom ( eg `2` by default )
	+ pixelRatio - pixelRatio ( eg `2` by default )

	
### Example:
`phantomjs get_element_with_pixelratio.js http://fivethirtyeight.com/live-blog/gop-convention-day-one/ "#livepress-update-20461291" 202.png 2`
`phantomjs get_element_with_pixelratio.js http://fivethirtyeight.com/live-blog/gop-convention-day-one/ "#livepress-update-20461291" 201.png 1`
`phantomjs get_element_with_zoom.js http://www.panic.com/ "#above-support" 202.png 2`
`phantomjs get_element_with_zoom.js http://www.panic.com/ "#above-support" 201.png 1`




  Licensing
  ---------
	GNU

  Contacts
  --------

     o korolev-ia [at] yandex.ru
     o http://www.unixpin.com
