#   get screenshot of page element with zoom factor

##  What is it?
Get the screenshot of any web page css element with zoom effect.


* Version 1.0 2017.01.16

### How to install? ###
This script require nodejs and phantomjs ( see `https://gist.github.com/julionc/7476620` ).



### 		How to run
Usage: `phantomjs get_element_with_zoom.js address outfile delay top left width height viewpw viewph selector zoomFactor`
where:
	+ address - url of page ( eg `http://google.com` )
	+ outfile - save screenshot to this file ( eg `google.png`)
	+ delay - delay in ms for any executed script on this page ( eg `1000` )
	+ top - indent from top of the page ( eg `0`)
	+ left - indent from left of the page ( eg `0`)
	+ width - use same value as viewpw - width of port view ( eg `1280` )
	+ height - use same value as viewph - height of port view ( eg `768` )
	+ viewpw - width of port view ( eg `1280` )
	+ viewph - height of port view ( eg `768` )
	+ selector - specify a selector ( eg `"#livepress-update-20461291"` or `".home-logo__default"` )
	+ zoomFactor - zoom ( eg `0.5` or `3` )

	
Sample:
``` phantomjs get_element_with_zoom.js http://fivethirtyeight.com/live-blog/gop-convention-day-one/ 1.png 1000 0 0 1024 768 1280 920 "#livepress-update-20461291" 0.5```
``` phantomjs get_element_with_zoom.js http://yandex.ru yandex.png 1000 0 0 1024 768 1280 920 ".home-logo__default" 2```



  Licensing
  ---------
	GNU

  Contacts
  --------

     o korolev-ia [at] yandex.ru
     o http://www.unixpin.com
