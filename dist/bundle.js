"use strict";function createCommonjsModule(t,e){return e={exports:{}},t(e,e.exports),e.exports}var commonjsGlobal="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},domToImage=createCommonjsModule(function(t){!function(e){function n(t,e){function n(t){return e.bgcolor&&(t.style.backgroundColor=e.bgcolor),e.width&&(t.style.width=e.width+"px"),e.height&&(t.style.height=e.height+"px"),e.style&&Object.keys(e.style).forEach(function(n){t.style[n]=e.style[n]}),t}return e=e||{},Promise.resolve(t).then(function(t){return M(t,e.filter,!0)}).then(c).then(s).then(n).then(function(n){return l(n,e.width||L.width(t),e.height||L.height(t))})}function r(t,e){return u(t,e||{}).then(function(e){return e.getContext("2d").getImageData(0,0,L.width(t),L.height(t)).data})}function i(t,e){return u(t,e||{}).then(function(t){return t.toDataURL()})}function o(t,e){return e=e||{},u(t,e).then(function(t){return t.toDataURL("image/jpeg",e.quality||1)})}function a(t,e){return u(t,e||{}).then(L.canvasToBlob)}function u(t,e){function r(t){var n=document.createElement("canvas");if(n.width=e.width||L.width(t),n.height=e.height||L.height(t),e.bgcolor){var r=n.getContext("2d");r.fillStyle=e.bgcolor,r.fillRect(0,0,n.width,n.height)}return n}return n(t,e).then(L.makeImage).then(L.delay(100)).then(function(e){var n=r(t);return n.getContext("2d").drawImage(e,0,0),n})}function M(t,e,n){function r(t){return t instanceof HTMLCanvasElement?L.makeImage(t.toDataURL()):t.cloneNode(!1)}function i(t,e,n){var r=t.childNodes;return 0===r.length?Promise.resolve(e):function(t,e,n){var r=Promise.resolve();return e.forEach(function(e){r=r.then(function(){return M(e,n)}).then(function(e){e&&t.appendChild(e)})}),r}(e,L.asArray(r),n).then(function(){return e})}function o(t,e){function n(){!function(t,e){t.cssText?e.cssText=t.cssText:function(t,e){L.asArray(t).forEach(function(n){e.setProperty(n,t.getPropertyValue(n),t.getPropertyPriority(n))})}(t,e)}(window.getComputedStyle(t),e.style)}function r(){function n(n){var r=window.getComputedStyle(t,n),i=r.getPropertyValue("content");if(""!==i&&"none"!==i){var o=L.uid();e.className=e.className+" "+o;var a=document.createElement("style");a.appendChild(function(t,e,n){var r="."+t+":"+e,i=n.cssText?function(t){var e=t.getPropertyValue("content");return t.cssText+" content: "+e+";"}(n):function(t){function e(e){return e+": "+t.getPropertyValue(e)+(t.getPropertyPriority(e)?" !important":"")}return L.asArray(t).map(e).join("; ")+";"}(n);return document.createTextNode(r+"{"+i+"}")}(o,n,r)),e.appendChild(a)}}[":before",":after"].forEach(function(t){n(t)})}function i(){t instanceof HTMLTextAreaElement&&(e.innerHTML=t.value),t instanceof HTMLInputElement&&e.setAttribute("value",t.value)}function o(){e instanceof SVGElement&&(e.setAttribute("xmlns","http://www.w3.org/2000/svg"),e instanceof SVGRectElement&&["width","height"].forEach(function(t){var n=e.getAttribute(t);n&&e.style.setProperty(t,n)}))}return e instanceof Element?Promise.resolve().then(n).then(r).then(i).then(o).then(function(){return e}):e}return n||!e||e(t)?Promise.resolve(t).then(r).then(function(n){return i(t,n,e)}).then(function(e){return o(t,e)}):Promise.resolve()}function c(t){return w.resolveAll().then(function(e){var n=document.createElement("style");return t.appendChild(n),n.appendChild(document.createTextNode(e)),t})}function s(t){return d.inlineAll(t).then(function(){return t})}function l(t,e,n){return Promise.resolve(t).then(function(t){return t.setAttribute("xmlns","http://www.w3.org/1999/xhtml"),(new XMLSerializer).serializeToString(t)}).then(L.escapeXhtml).then(function(t){return'<foreignObject x="0" y="0" width="100%" height="100%">'+t+"</foreignObject>"}).then(function(t){return'<svg xmlns="http://www.w3.org/2000/svg" width="'+e+'" height="'+n+'">'+t+"</svg>"}).then(function(t){return"data:image/svg+xml;charset=utf-8,"+t})}var L=function(){function t(){var t="application/font-woff";return{woff:t,woff2:t,ttf:"application/font-truetype",eot:"application/vnd.ms-fontobject",png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",gif:"image/gif",tiff:"image/tiff",svg:"image/svg+xml"}}function e(t){var e=/\.([^\.\/]*?)$/g.exec(t);return e?e[1]:""}function n(n){var r=e(n).toLowerCase();return t()[r]||""}function r(t){return-1!==t.search(/^(data:)/)}function i(t){return new Promise(function(e){for(var n=window.atob(t.toDataURL().split(",")[1]),r=n.length,i=new Uint8Array(r),o=0;o<r;o++)i[o]=n.charCodeAt(o);e(new Blob([i],{type:"image/png"}))})}function o(t){return t.toBlob?new Promise(function(e){t.toBlob(e)}):i(t)}function a(t,e){var n=document.implementation.createHTMLDocument(),r=n.createElement("base");n.head.appendChild(r);var i=n.createElement("a");return n.body.appendChild(i),r.href=e,i.href=t,i.href}function u(t){return new Promise(function(e,n){var r=new Image;r.onload=function(){e(r)},r.onerror=n,r.src=t})}function M(t){var e=3e4;return new Promise(function(n){function r(){if(4===a.readyState){if(200!==a.status)return void o("cannot fetch resource: "+t+", status: "+a.status);var e=new FileReader;e.onloadend=function(){var t=e.result.split(/,/)[1];n(t)},e.readAsDataURL(a.response)}}function i(){o("timeout of "+e+"ms occured while fetching resource: "+t)}function o(t){console.error(t),n("")}var a=new XMLHttpRequest;a.onreadystatechange=r,a.ontimeout=i,a.responseType="blob",a.timeout=e,a.open("GET",t,!0),a.send()})}function c(t,e){return"data:"+e+";base64,"+t}function s(t){return t.replace(/([.*+?^${}()|\[\]\/\\])/g,"\\$1")}function l(t){return function(e){return new Promise(function(n){setTimeout(function(){n(e)},t)})}}function L(t){for(var e=[],n=t.length,r=0;r<n;r++)e.push(t[r]);return e}function g(t){return t.replace(/#/g,"%23").replace(/\n/g,"%0A")}function w(t){var e=y(t,"border-left-width"),n=y(t,"border-right-width");return t.scrollWidth+e+n}function d(t){var e=y(t,"border-top-width"),n=y(t,"border-bottom-width");return t.scrollHeight+e+n}function y(t,e){var n=window.getComputedStyle(t).getPropertyValue(e);return parseFloat(n.replace("px",""))}return{escape:s,parseExtension:e,mimeType:n,dataAsUrl:c,isDataUrl:r,canvasToBlob:o,resolveUrl:a,getAndEncode:M,uid:function(){var t=0;return function(){return"u"+function(){return("0000"+(Math.random()*Math.pow(36,4)<<0).toString(36)).slice(-4)}()+t++}}(),delay:l,asArray:L,escapeXhtml:g,makeImage:u,width:w,height:d}}(),g=function(){function t(t){return-1!==t.search(i)}function e(t){for(var e,n=[];null!==(e=i.exec(t));)n.push(e[1]);return n.filter(function(t){return!L.isDataUrl(t)})}function n(t,e,n,r){function i(t){return new RegExp("(url\\(['\"]?)("+L.escape(t)+")(['\"]?\\))","g")}return Promise.resolve(e).then(function(t){return n?L.resolveUrl(t,n):t}).then(r||L.getAndEncode).then(function(t){return L.dataAsUrl(t,L.mimeType(e))}).then(function(n){return t.replace(i(e),"$1"+n+"$3")})}function r(r,i,o){return function(){return!t(r)}()?Promise.resolve(r):Promise.resolve(r).then(e).then(function(t){var e=Promise.resolve(r);return t.forEach(function(t){e=e.then(function(e){return n(e,t,i,o)})}),e})}var i=/url\(['"]?([^'"]+?)['"]?\)/g;return{inlineAll:r,shouldProcess:t,impl:{readUrls:e,inline:n}}}(),w=function(){function t(){return e(document).then(function(t){return Promise.all(t.map(function(t){return t.resolve()}))}).then(function(t){return t.join("\n")})}function e(){function t(t){return t.filter(function(t){return t.type===CSSRule.FONT_FACE_RULE}).filter(function(t){return g.shouldProcess(t.style.getPropertyValue("src"))})}function e(t){var e=[];return t.forEach(function(t){try{L.asArray(t.cssRules||[]).forEach(e.push.bind(e))}catch(e){console.log("Error while reading CSS rules from "+t.href,e.toString())}}),e}function n(t){return{resolve:function(){var e=(t.parentStyleSheet||{}).href;return g.inlineAll(t.cssText,e)},src:function(){return t.style.getPropertyValue("src")}}}return Promise.resolve(L.asArray(document.styleSheets)).then(e).then(t).then(function(t){return t.map(n)})}return{resolveAll:t,impl:{readAll:e}}}(),d=function(){function t(t){function e(e){return L.isDataUrl(t.src)?Promise.resolve():Promise.resolve(t.src).then(e||L.getAndEncode).then(function(e){return L.dataAsUrl(e,L.mimeType(t.src))}).then(function(e){return new Promise(function(n,r){t.onload=n,t.onerror=r,t.src=e})})}return{inline:e}}function e(n){return n instanceof Element?function(t){var e=t.style.getPropertyValue("background");return e?g.inlineAll(e).then(function(e){t.style.setProperty("background",e,t.style.getPropertyPriority("background"))}).then(function(){return t}):Promise.resolve(t)}(n).then(function(){return n instanceof HTMLImageElement?t(n).inline():Promise.all(L.asArray(n.childNodes).map(function(t){return e(t)}))}):Promise.resolve(n)}return{inlineAll:e,impl:{newImage:t}}}(),y={toSvg:n,toPng:i,toJpeg:o,toBlob:a,toPixelData:r,impl:{fontFaces:w,images:d,util:L,inliner:g}};t.exports=y}()}),FileSaver=createCommonjsModule(function(t){var e=e||function(t){if(!(void 0===t||"undefined"!=typeof navigator&&/MSIE [1-9]\./.test(navigator.userAgent))){var e=t.document,n=function(){return t.URL||t.webkitURL||t},r=e.createElementNS("http://www.w3.org/1999/xhtml","a"),i="download"in r,o=function(t){var e=new MouseEvent("click");t.dispatchEvent(e)},a=/constructor/i.test(t.HTMLElement)||t.safari,u=/CriOS\/[\d]+/.test(navigator.userAgent),M=function(e){(t.setImmediate||t.setTimeout)(function(){throw e},0)},c=function(t){var e=function(){"string"==typeof t?n().revokeObjectURL(t):t.remove()};setTimeout(e,4e4)},s=function(t,e,n){e=[].concat(e);for(var r=e.length;r--;){var i=t["on"+e[r]];if("function"==typeof i)try{i.call(t,n||t)}catch(t){M(t)}}},l=function(t){return/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(t.type)?new Blob([String.fromCharCode(65279),t],{type:t.type}):t},L=function(e,M,L){L||(e=l(e));var g,w=this,d=e.type,y="application/octet-stream"===d,j=function(){s(w,"writestart progress write writeend".split(" "))};if(w.readyState=w.INIT,i)return g=n().createObjectURL(e),void setTimeout(function(){r.href=g,r.download=M,o(r),j(),c(g),w.readyState=w.DONE});!function(){if((u||y&&a)&&t.FileReader){var r=new FileReader;return r.onloadend=function(){var e=u?r.result:r.result.replace(/^data:[^;]*;/,"data:attachment/file;");t.open(e,"_blank")||(t.location.href=e),e=void 0,w.readyState=w.DONE,j()},r.readAsDataURL(e),void(w.readyState=w.INIT)}if(g||(g=n().createObjectURL(e)),y)t.location.href=g;else{t.open(g,"_blank")||(t.location.href=g)}w.readyState=w.DONE,j(),c(g)}()},g=L.prototype,w=function(t,e,n){return new L(t,e||t.name||"download",n)};return"undefined"!=typeof navigator&&navigator.msSaveOrOpenBlob?function(t,e,n){return e=e||t.name||"download",n||(t=l(t)),navigator.msSaveOrOpenBlob(t,e)}:(g.abort=function(){},g.readyState=g.INIT=0,g.WRITING=1,g.DONE=2,g.error=g.onwritestart=g.onprogress=g.onwrite=g.onabort=g.onerror=g.onwriteend=null,w)}}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||commonjsGlobal.content);t.exports&&(t.exports.saveAs=e)});L.Control.EasyPrint=L.Control.extend({options:{title:"Print map",position:"topleft",sizeModes:"native",filename:"mymap"},onAdd:function(){this.addCss();var t=L.DomUtil.create("div","leaflet-control-easyPrint leaflet-bar leaflet-control");return L.DomEvent.addListener(t,"mouseover",this.displayPageSizeButtons,this),L.DomEvent.addListener(t,"mouseout",this.hidePageSizeButtons,this),this.link=L.DomUtil.create("a","leaflet-control-easyPrint-button",t),this.link.id="leafletEasyPrint",this.link.title=this.options.title,this.holder=L.DomUtil.create("ul","easyPrintHolder",t),this.options.sizeModes.forEach(function(t){var e=L.DomUtil.create("li","easyPrintSizeMode",this.holder);e.title=t;L.DomUtil.create("a","easyPrint"+t,e);L.DomEvent.addListener(e,"click",this.printPage,this)},this),L.DomEvent.disableClickPropagation(t),t},createOuterContainer:function(t){var e=document.createElement("div");return t.parentNode.insertBefore(e,t),t.parentNode.removeChild(t),e.appendChild(t),e.style.width=t.style.width,e.style.display="inline-block",e},removeOuterContainer:function(t,e,n){e.parentNode.insertBefore(t,e),e.parentNode.removeChild(n),e.parentNode.removeChild(e)},printPage:function(t){if(this._map.fire("beforePrint"),this.hidePageSizeButtons(),this.mapContainer=this._map.getContainer(),this.outerContainer=this.createOuterContainer(this.mapContainer),"easyPrintCurrentSize"===t.target.className)return void this.printOpertion();this.createImagePlaceholder(t.target.className)},createImagePlaceholder:function(t){var e=this;domToImage.toPng(this.mapContainer).then(function(n){e.blankDiv=document.createElement("div");var r=e.blankDiv;e.outerContainer.parentElement.insertBefore(r,e.outerContainer),r.className="epHolder",r.style.backgroundImage='url("'+n+'")',r.style.position="relative",r.style.zIndex=1011,r.style.display="block",r.style.width=e.mapContainer.style.width,r.style.height=e.mapContainer.style.height,e.resizeAndPrintMap(t)}).catch(function(t){console.error("oops, something went wrong!",t)})},resizeAndPrintMap:function(t){var e={height:"715px",width:"1045px"},n=this.mapContainer;this.originalMapWidth=n.style.width,this.originalMapHeight=n.style.height,this.origCenter=this._map.getCenter(),this.origZoom=this._map.getZoom(),this.outerContainer.style.opacity=0,"easyPrintA4Landscape"===t&&(n.style.width=e.width,n.style.height=e.height),"easyPrintA4Portrait"===t&&(n.style.width=e.height,n.style.height=e.width),this._map.setView(this.origCenter),this._map.setZoom(this.origZoom),this._map.invalidateSize();var r=this,i=setInterval(function(){r.options.tileLayer.isLoading()||(clearInterval(i),r.printOpertion())},500)},printOpertion:function(){var t=this;domToImage.toPng(t.mapContainer,{width:parseInt(t.mapContainer.style.width.replace("px")),height:parseInt(t.mapContainer.style.height.replace("px"))}).then(function(e){var n=t.dataURItoBlob(e);window.FileSaver.saveAs(n,t.options.filename+".png"),t._map.fire("afterPrint"),t.mapContainer.style.width=t.originalMapWidth,t.mapContainer.style.height=t.originalMapHeight,t.removeOuterContainer(t.mapContainer,t.outerContainer,t.blankDiv),t._map.invalidateSize(),t._map.setView(t.origCenter),t._map.setZoom(t.origZoom)}).catch(function(t){console.error("Print operation failed",t)})},addCss:function(){var t=document.createElement("style");t.type="text/css",t.innerHTML=".leaflet-control-easyPrint a { \n      background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8cGF0aCBkPSJNMTI4LDMyaDI1NnY2NEgxMjhWMzJ6IE00ODAsMTI4SDMyYy0xNy42LDAtMzIsMTQuNC0zMiwzMnYxNjBjMCwxNy42LDE0LjM5OCwzMiwzMiwzMmg5NnYxMjhoMjU2VjM1Mmg5NiAgIGMxNy42LDAsMzItMTQuNCwzMi0zMlYxNjBDNTEyLDE0Mi40LDQ5Ny42LDEyOCw0ODAsMTI4eiBNMzUyLDQ0OEgxNjBWMjg4aDE5MlY0NDh6IE00ODcuMTk5LDE3NmMwLDEyLjgxMy0xMC4zODcsMjMuMi0yMy4xOTcsMjMuMiAgIGMtMTIuODEyLDAtMjMuMjAxLTEwLjM4Ny0yMy4yMDEtMjMuMnMxMC4zODktMjMuMiwyMy4xOTktMjMuMkM0NzYuODE0LDE1Mi44LDQ4Ny4xOTksMTYzLjE4Nyw0ODcuMTk5LDE3NnoiIGZpbGw9IiMwMDAwMDAiLz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K);\n      background-size: 16px 16px; \n      cursor: pointer; \n    }\n    .easyPrintHolder .easyPrintA4Landscape { \n      background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTcuMS4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ0MiA0NDIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ0MiA0NDI7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4Ij4KPHBhdGggZD0iTTM3Ni45NzcsMTA0LjIwOWMtMC4wMjQtMC4yNDUtMC4wNjYtMC40ODQtMC4xMDgtMC43MjRjLTAuMDE0LTAuMDgyLTAuMDIxLTAuMTY1LTAuMDM4LTAuMjQ2ICBjLTAuMDU4LTAuMjktMC4xMzItMC41NzQtMC4yMTUtMC44NTRjLTAuMDA5LTAuMDMtMC4wMTQtMC4wNjEtMC4wMjMtMC4wOTFjLTAuMDg3LTAuMjg1LTAuMTg5LTAuNTYzLTAuMy0wLjgzOCAgYy0wLjAxMS0wLjAyNi0wLjAxOS0wLjA1NS0wLjAzLTAuMDgxYy0wLjEwOC0wLjI2LTAuMjMxLTAuNTEzLTAuMzYtMC43NjFjLTAuMDIxLTAuMDQxLTAuMDM4LTAuMDgzLTAuMDYtMC4xMjUgIGMtMC4xMjEtMC4yMjUtMC4yNTUtMC40NDEtMC4zOTItMC42NTVjLTAuMDM5LTAuMDYyLTAuMDczLTAuMTI2LTAuMTE0LTAuMTg3Yy0wLjEzMi0wLjE5Ny0wLjI3Ny0wLjM4My0wLjQyMi0wLjU3ICBjLTAuMDU2LTAuMDcxLTAuMTA1LTAuMTQ3LTAuMTYzLTAuMjE3Yy0wLjE4MS0wLjIyLTAuMzc0LTAuNDI5LTAuNTczLTAuNjMzYy0wLjAyOS0wLjAyOS0wLjA1My0wLjA2Mi0wLjA4Mi0wLjA5MUwyNzguODkyLDIuOTI5ICBjLTAuMDI2LTAuMDI2LTAuMDU1LTAuMDQ4LTAuMDgyLTAuMDc0Yy0wLjIwNi0wLjIwMi0wLjQxOS0wLjM5OC0wLjY0Mi0wLjU4MmMtMC4wNy0wLjA1OC0wLjE0Ni0wLjEwNy0wLjIxOC0wLjE2MyAgYy0wLjE4Ni0wLjE0NS0wLjM3My0wLjI5LTAuNTY5LTAuNDIxYy0wLjA2My0wLjA0Mi0wLjEyOS0wLjA3Ny0wLjE5My0wLjExN2MtMC4yMTItMC4xMzYtMC40MjYtMC4yNjktMC42NDktMC4zODggIGMtMC4wNDQtMC4wMjQtMC4wOTEtMC4wNDItMC4xMzUtMC4wNjVjLTAuMjQ1LTAuMTI3LTAuNDk0LTAuMjQ4LTAuNzUtMC4zNTRjLTAuMDMxLTAuMDEzLTAuMDYzLTAuMDIyLTAuMDk0LTAuMDM0ICBjLTAuMjctMC4xMDktMC41NDQtMC4yMS0wLjgyNS0wLjI5NmMtMC4wMzQtMC4wMS0wLjA2OC0wLjAxNi0wLjEwMi0wLjAyNmMtMC4yNzctMC4wODEtMC41NTctMC4xNTUtMC44NDMtMC4yMTIgIGMtMC4wODQtMC4wMTctMC4xNy0wLjAyNC0wLjI1NC0wLjAzOWMtMC4yMzctMC4wNDEtMC40NzQtMC4wODMtMC43MTYtMC4xMDdDMjcyLjQ4OCwwLjAxNywyNzIuMTU1LDAsMjcxLjgyLDBINzQuOTczICBjLTUuNTIzLDAtMTAsNC40NzctMTAsMTB2NDIyYzAsNS41MjMsNC40NzcsMTAsMTAsMTBoMjkyLjA1NWM1LjUyMiwwLDEwLTQuNDc3LDEwLTEwVjEwNS4yMDcgIEMzNzcuMDI3LDEwNC44NzMsMzc3LjAxLDEwNC41NCwzNzYuOTc3LDEwNC4yMDl6IE0yODEuODIsMzQuMTQzbDYxLjA2NSw2MS4wNjRIMjgxLjgyVjM0LjE0M3ogTTg0Ljk3Myw0MjJWMjBIMjYxLjgydjg1LjIwNyAgYzAsNS41MjMsNC40NzgsMTAsMTAsMTBoODUuMjA3VjQyMkg4NC45NzN6IiBmaWxsPSIjMDAwMDAwIi8+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo);\n      background-size: 16px 16px;\n      cursor: pointer;\n      transform: rotate(-90deg);\n    }\n    .easyPrintHolder .easyPrintA4Portrait { \n      background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTcuMS4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ0MiA0NDIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ0MiA0NDI7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4Ij4KPHBhdGggZD0iTTM3Ni45NzcsMTA0LjIwOWMtMC4wMjQtMC4yNDUtMC4wNjYtMC40ODQtMC4xMDgtMC43MjRjLTAuMDE0LTAuMDgyLTAuMDIxLTAuMTY1LTAuMDM4LTAuMjQ2ICBjLTAuMDU4LTAuMjktMC4xMzItMC41NzQtMC4yMTUtMC44NTRjLTAuMDA5LTAuMDMtMC4wMTQtMC4wNjEtMC4wMjMtMC4wOTFjLTAuMDg3LTAuMjg1LTAuMTg5LTAuNTYzLTAuMy0wLjgzOCAgYy0wLjAxMS0wLjAyNi0wLjAxOS0wLjA1NS0wLjAzLTAuMDgxYy0wLjEwOC0wLjI2LTAuMjMxLTAuNTEzLTAuMzYtMC43NjFjLTAuMDIxLTAuMDQxLTAuMDM4LTAuMDgzLTAuMDYtMC4xMjUgIGMtMC4xMjEtMC4yMjUtMC4yNTUtMC40NDEtMC4zOTItMC42NTVjLTAuMDM5LTAuMDYyLTAuMDczLTAuMTI2LTAuMTE0LTAuMTg3Yy0wLjEzMi0wLjE5Ny0wLjI3Ny0wLjM4My0wLjQyMi0wLjU3ICBjLTAuMDU2LTAuMDcxLTAuMTA1LTAuMTQ3LTAuMTYzLTAuMjE3Yy0wLjE4MS0wLjIyLTAuMzc0LTAuNDI5LTAuNTczLTAuNjMzYy0wLjAyOS0wLjAyOS0wLjA1My0wLjA2Mi0wLjA4Mi0wLjA5MUwyNzguODkyLDIuOTI5ICBjLTAuMDI2LTAuMDI2LTAuMDU1LTAuMDQ4LTAuMDgyLTAuMDc0Yy0wLjIwNi0wLjIwMi0wLjQxOS0wLjM5OC0wLjY0Mi0wLjU4MmMtMC4wNy0wLjA1OC0wLjE0Ni0wLjEwNy0wLjIxOC0wLjE2MyAgYy0wLjE4Ni0wLjE0NS0wLjM3My0wLjI5LTAuNTY5LTAuNDIxYy0wLjA2My0wLjA0Mi0wLjEyOS0wLjA3Ny0wLjE5My0wLjExN2MtMC4yMTItMC4xMzYtMC40MjYtMC4yNjktMC42NDktMC4zODggIGMtMC4wNDQtMC4wMjQtMC4wOTEtMC4wNDItMC4xMzUtMC4wNjVjLTAuMjQ1LTAuMTI3LTAuNDk0LTAuMjQ4LTAuNzUtMC4zNTRjLTAuMDMxLTAuMDEzLTAuMDYzLTAuMDIyLTAuMDk0LTAuMDM0ICBjLTAuMjctMC4xMDktMC41NDQtMC4yMS0wLjgyNS0wLjI5NmMtMC4wMzQtMC4wMS0wLjA2OC0wLjAxNi0wLjEwMi0wLjAyNmMtMC4yNzctMC4wODEtMC41NTctMC4xNTUtMC44NDMtMC4yMTIgIGMtMC4wODQtMC4wMTctMC4xNy0wLjAyNC0wLjI1NC0wLjAzOWMtMC4yMzctMC4wNDEtMC40NzQtMC4wODMtMC43MTYtMC4xMDdDMjcyLjQ4OCwwLjAxNywyNzIuMTU1LDAsMjcxLjgyLDBINzQuOTczICBjLTUuNTIzLDAtMTAsNC40NzctMTAsMTB2NDIyYzAsNS41MjMsNC40NzcsMTAsMTAsMTBoMjkyLjA1NWM1LjUyMiwwLDEwLTQuNDc3LDEwLTEwVjEwNS4yMDcgIEMzNzcuMDI3LDEwNC44NzMsMzc3LjAxLDEwNC41NCwzNzYuOTc3LDEwNC4yMDl6IE0yODEuODIsMzQuMTQzbDYxLjA2NSw2MS4wNjRIMjgxLjgyVjM0LjE0M3ogTTg0Ljk3Myw0MjJWMjBIMjYxLjgydjg1LjIwNyAgYzAsNS41MjMsNC40NzgsMTAsMTAsMTBoODUuMjA3VjQyMkg4NC45NzN6IiBmaWxsPSIjMDAwMDAwIi8+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo);\n      background-size: 16px 16px;\n      cursor: pointer;\n    }\n    .leaflet-control-easyPrint-button{\n      display: inline-block;\n    }\n    .easyPrintHolder{\n      margin-top:-31px;\n      margin-bottom: -5px;\n      margin-left: 30px;\n      padding-left: 0px;\n      display: none;\n    }\n\n    .easyPrintSizeMode {\n      display: inline-block;\n    }\n    .easyPrintHolder .easyPrintSizeMode a {\n      border-radius: 0px;\n    }\n\n    .easyPrintHolder .easyPrintSizeMode:last-child a{\n      border-top-right-radius: 2px;\n      border-bottom-right-radius: 2px;\n    }\n\n    .easyPrintPortrait:hover, .easyPrintLandscape:hover{\n      background-color: #757570;\n      cursor: pointer;\n    }",document.body.appendChild(t)},dataURItoBlob:function(t){for(var e=atob(t.split(",")[1]),n=t.split(",")[0].split(":")[1].split(";")[0],r=new ArrayBuffer(e.length),i=new DataView(r),o=0;o<e.length;o++)i.setUint8(o,e.charCodeAt(o));return new Blob([r],{type:n})},displayPageSizeButtons:function(){this.holder.style.display="block",this.link.style.borderTopRightRadius="0",this.link.style.borderBottomRightRadius="0"},hidePageSizeButtons:function(){this.holder.style.display="none",this.link.style.borderTopRightRadius="2px",this.link.style.borderBottomRightRadius="2px"}}),L.easyPrint=function(t){return new L.Control.EasyPrint(t)};