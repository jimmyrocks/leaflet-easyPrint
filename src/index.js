var domtoimage = require('dom-to-image');
var fileSaver = require('file-saver');

L.Control.EasyPrint = L.Control.extend({
  options: {
    title: 'Print map',
    position: 'topleft',
    sizeModes: ['Current'],
    filename: 'map',
    exportOnly: false,
    hidden: false,
    tileWait: 500,
    hideControlContainer: true,
    hideClasses: [],
    customWindowTitle: window.document.title,
    spinnerBgCOlor: '#0DC5C1',
    customSpinnerClass: 'epLoader',
    defaultSizeTitles: {
      Current: 'Current Size',
      LetterLandscape: 'Letter Landscape',
      LetterPortrait: 'Letter Portrait'
    }
  },

  onAdd: function () { 
    this.mapContainer = this._map.getContainer();
    this.options.sizeModes = this.options.sizeModes.map(function (sizeMode) {
      if (sizeMode === 'Current') {
        return {
          name: this.options.defaultSizeTitles.Current,
          className: 'CurrentSize'
        }
      }
      if (sizeMode === 'LetterLandscape') {
        return {
          height: this._letterPageSize.height,
          width: this._letterPageSize.width,
          name: this.options.defaultSizeTitles.LetterLandscape,
          className: 'LetterLandscape page'
        }
      }
      if (sizeMode === 'LetterPortrait') {
        return {
          height: this._letterPageSize.width,
          width: this._letterPageSize.height,
          name: this.options.defaultSizeTitles.LetterPortrait,
          className: 'LetterPortrait page'
        }
      };
      return sizeMode;
    }, this);
    
    var container = L.DomUtil.create('div', 'leaflet-control-easyPrint leaflet-bar leaflet-control');
    if (!this.options.hidden) {
      this._addCss();

      L.DomEvent.addListener(container, 'mouseover', this._togglePageSizeButtons, this);
      L.DomEvent.addListener(container, 'mouseout', this._togglePageSizeButtons, this);

      var btnClass = 'leaflet-control-easyPrint-button'
      if (this.options.exportOnly) btnClass = btnClass + '-export'

      this.link = L.DomUtil.create('a', btnClass, container);
      this.link.id = "leafletEasyPrint";
      this.link.title = this.options.title;
      this.holder = L.DomUtil.create('ul', 'easyPrintHolder', container);

      this.options.sizeModes.forEach(function (sizeMode) {
        var btn = L.DomUtil.create('li', 'easyPrintSizeMode', this.holder);
        btn.title = sizeMode.name;
        var link = L.DomUtil.create('a', sizeMode.className, btn);
        L.DomEvent.addListener(btn, 'click', this.printMap, this);
      }, this);

      L.DomEvent.disableClickPropagation(container);
    }
    return container;
  },

  printMap: function (event, filename) {
    if (filename) {
      this.options.filename = filename
    }
    if (!this.options.exportOnly) {
      this._page = window.open("", "_blank", 'toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,left=10, top=10, width=200, height=250, visible=none');
      this._page.document.write(this._createSpinner(this.options.customWindowTitle, this.options.customSpinnerClass, this.options.spinnerBgCOlor));
    }
    this.originalState = {
      mapWidth: this.mapContainer.style.width,
      widthWasAuto: false,
      widthWasPercentage: false,
      mapHeight: this.mapContainer.style.height,
      zoom: this._map.getZoom(),
      center: this._map.getCenter()
    };
    if (this.originalState.mapWidth === 'auto') {
      this.originalState.mapWidth = this._map.getSize().x  + 'px'
      this.originalState.widthWasAuto = true
    } else if (this.originalState.mapWidth.includes('%')) {
      this.originalState.percentageWidth = this.originalState.mapWidth
      this.originalState.widthWasPercentage = true
      this.originalState.mapWidth = this._map.getSize().x  + 'px'
    }
    this._map.fire("easyPrint-start", { event: event });
    if (!this.options.hidden) {
      this._togglePageSizeButtons({type: null});
    }
    if (this.options.hideControlContainer) {
      this._toggleControls();    
    }
    if (this.options.hideClasses) {
      this._toggleClasses(this.options.hideClasses);
    }
    var sizeMode = typeof event !== 'string' ? event.target.className : event;
    if (sizeMode === 'CurrentSize') {
      return this._printOpertion(sizeMode);
    }
    this.outerContainer = this._createOuterContainer(this.mapContainer)
    if (this.originalState.widthWasAuto) {
      this.outerContainer.style.width = this.originalState.mapWidth
    }
    this._createImagePlaceholder(sizeMode)
  },

  _createImagePlaceholder: function (sizeMode) {
    var plugin = this;
    domtoimage.toPng(this.mapContainer, {
        width: parseInt(this.originalState.mapWidth.replace('px')),
        height: parseInt(this.originalState.mapHeight.replace('px'))
      })
      .then(function (dataUrl) {
        plugin.blankDiv = document.createElement("div");
        var blankDiv = plugin.blankDiv;
        plugin.outerContainer.parentElement.insertBefore(blankDiv, plugin.outerContainer);
        blankDiv.className = 'epHolder';
        blankDiv.style.backgroundImage = 'url("' + dataUrl + '")';
        blankDiv.style.position = 'absolute';
        blankDiv.style.zIndex = 1011;
        blankDiv.style.display = 'initial';
        blankDiv.style.width = plugin.originalState.mapWidth;
        blankDiv.style.height = plugin.originalState.mapHeight;
        plugin._resizeAndPrintMap(sizeMode);
      })
      .catch(function (error) {
          console.error('oops, something went wrong!', error);
      });
  },

  _resizeAndPrintMap: function (sizeMode) {
    this.outerContainer.style.opacity = 0;
    var pageSize = this.options.sizeModes.filter(function (item) {
      return item.className.indexOf(sizeMode) > -1;
    });
    pageSize = pageSize[0]
    this.mapContainer.style.width = pageSize.width + 'px';
    this.mapContainer.style.height = pageSize.height + 'px';
    if (this.mapContainer.style.width < this.mapContainer.style.height) {
      this.orientation = 'portrait';
    } else {
      this.orientation = 'landscape';
    }
    this._map.setView(this.originalState.center);
    this._map.setZoom(this.originalState.zoom);
    this._map.invalidateSize();
    if (this.options.tileLayer) {
      this._pausePrint(sizeMode)
    } else {
      this._printOpertion(sizeMode)
    }
  },

  _pausePrint: function (sizeMode) {
    var plugin = this
    var loadingTest = setInterval(function () { 
      if(!plugin.options.tileLayer.isLoading()) {
        clearInterval(loadingTest);
        plugin._printOpertion(sizeMode)
      }
    }, plugin.options.tileWait);
  },

  _printOpertion: function (sizemode) {
    var plugin = this;
    var widthForExport = this.mapContainer.style.width
    if (this.originalState.widthWasAuto && sizemode === 'CurrentSize' || this.originalState.widthWasPercentage && sizemode === 'CurrentSize') {
      widthForExport = this.originalState.mapWidth
    }
    domtoimage.toPng(plugin.mapContainer, {
        width: parseInt(widthForExport),
        height: parseInt(plugin.mapContainer.style.height.replace('px'))
      })
      .then(function (dataUrl) {
          var blob = plugin._dataURItoBlob(dataUrl);
          if (plugin.options.exportOnly) {
            fileSaver.saveAs(blob, plugin.options.filename + '.png');
          } else {
            plugin._sendToBrowserPrint(dataUrl, plugin.orientation);
          }
          plugin._toggleControls(true);
          plugin._toggleClasses(plugin.options.hideClasses, true);

          if (plugin.outerContainer) {
            if (plugin.originalState.widthWasAuto) {
              plugin.mapContainer.style.width = 'auto'
            } else if (plugin.originalState.widthWasPercentage) {
              plugin.mapContainer.style.width = plugin.originalState.percentageWidth
            }
            else {
              plugin.mapContainer.style.width = plugin.originalState.mapWidth;              
            }
            plugin.mapContainer.style.height = plugin.originalState.mapHeight;
            plugin._removeOuterContainer(plugin.mapContainer, plugin.outerContainer, plugin.blankDiv)
            plugin._map.invalidateSize();
            plugin._map.setView(plugin.originalState.center);
            plugin._map.setZoom(plugin.originalState.zoom);
          }
          plugin._map.fire("easyPrint-finished");
      })
      .catch(function (error) {
          console.error('Print operation failed', error);
      }); 
  },

  _sendToBrowserPrint: function (img, orientation) {
    this._page.resizeTo(600, 800); 
    var pageContent = this._createNewWindow(img, orientation, this)
    this._page.document.body.innerHTML = ''
    this._page.document.write(pageContent);
    this._page.document.close();  
  },

  _createSpinner: function (title, spinnerClass, spinnerColor) {
    return `<html><head><title>`+ title + `</title></head><body><style>
      body{
        background: ` + spinnerColor + `;
      }
      .epLoader,
      .epLoader:before,
      .epLoader:after {
        border-radius: 50%;
      }
      .epLoader {
        color: #ffffff;
        font-size: 11px;
        text-indent: -99999em;
        margin: 55px auto;
        position: relative;
        width: 10em;
        height: 10em;
        box-shadow: inset 0 0 0 1em;
        -webkit-transform: translateZ(0);
        -ms-transform: translateZ(0);
        transform: translateZ(0);
      }
      .epLoader:before,
      .epLoader:after {
        position: absolute;
        content: '';
      }
      .epLoader:before {
        width: 5.2em;
        height: 10.2em;
        background: #0dc5c1;
        border-radius: 10.2em 0 0 10.2em;
        top: -0.1em;
        left: -0.1em;
        -webkit-transform-origin: 5.2em 5.1em;
        transform-origin: 5.2em 5.1em;
        -webkit-animation: load2 2s infinite ease 1.5s;
        animation: load2 2s infinite ease 1.5s;
      }
      .epLoader:after {
        width: 5.2em;
        height: 10.2em;
        background: #0dc5c1;
        border-radius: 0 10.2em 10.2em 0;
        top: -0.1em;
        left: 5.1em;
        -webkit-transform-origin: 0px 5.1em;
        transform-origin: 0px 5.1em;
        -webkit-animation: load2 2s infinite ease;
        animation: load2 2s infinite ease;
      }
      @-webkit-keyframes load2 {
        0% {
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
        }
        100% {
          -webkit-transform: rotate(360deg);
          transform: rotate(360deg);
        }
      }
      @keyframes load2 {
        0% {
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
        }
        100% {
          -webkit-transform: rotate(360deg);
          transform: rotate(360deg);
        }
      }
      </style>
    <div class="`+spinnerClass+`">Loading...</div></body></html>`;
  },

  _createNewWindow: function (img, orientation, plugin) {
    return `<html><head>
        <style>@media print {
          img { max-width: 98%!important; max-height: 98%!important; }
          @page { size: ` + orientation + `;}}
        </style>
        <script>function step1(){
        setTimeout('step2()', 10);}
        function step2(){window.print();window.close()}
        </script></head><body onload='step1()'>
        <img src="` + img + `" style="display:block; margin:auto;"></body></html>`;
  },

  _createOuterContainer: function (mapDiv) {
    var outerContainer = document.createElement('div'); 
    mapDiv.parentNode.insertBefore(outerContainer, mapDiv); 
    mapDiv.parentNode.removeChild(mapDiv);
    outerContainer.appendChild(mapDiv);
    outerContainer.style.width = mapDiv.style.width;
    outerContainer.style.height = mapDiv.style.height;
    outerContainer.style.display = 'inline-block'
    outerContainer.style.overflow = 'hidden';
    return outerContainer;
  },

  _removeOuterContainer: function (mapDiv, outerContainer, blankDiv) {
    if (outerContainer.parentNode) {
      outerContainer.parentNode.insertBefore(mapDiv, outerContainer);
      outerContainer.parentNode.removeChild(blankDiv);
      outerContainer.parentNode.removeChild(outerContainer);      
    }
  },

  _addCss: function () {
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = `.leaflet-control-easyPrint-button { 
      background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPjxwYXRoIGQ9Ik0xMjgsMzJoMjU2djY0SDEyOFYzMnogTTQ4MCwxMjhIMzJjLTE3LjYsMC0zMiwxNC40LTMyLDMydjE2MGMwLDE3LjYsMTQuMzk4LDMyLDMyLDMyaDk2djEyOGgyNTZWMzUyaDk2ICAgYzE3LjYsMCwzMi0xNC40LDMyLTMyVjE2MEM1MTIsMTQyLjQsNDk3LjYsMTI4LDQ4MCwxMjh6IE0zNTIsNDQ4SDE2MFYyODhoMTkyVjQ0OHogTTQ4Ny4xOTksMTc2YzAsMTIuODEzLTEwLjM4NywyMy4yLTIzLjE5NywyMy4yICAgYy0xMi44MTIsMC0yMy4yMDEtMTAuMzg3LTIzLjIwMS0yMy4yczEwLjM4OS0yMy4yLDIzLjE5OS0yMy4yQzQ3Ni44MTQsMTUyLjgsNDg3LjE5OSwxNjMuMTg3LDQ4Ny4xOTksMTc2eiIgZmlsbD0iI0ZGRkZGRiIvPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48L3N2Zz4=);
      background-size: 16px 16px; 
      cursor: pointer; 
    }
    .leaflet-control-easyPrint-button-export { 
      background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPjxwYXRoIGQ9Ik0xMjgsMzJoMjU2djY0SDEyOFYzMnogTTQ4MCwxMjhIMzJjLTE3LjYsMC0zMiwxNC40LTMyLDMydjE2MGMwLDE3LjYsMTQuMzk4LDMyLDMyLDMyaDk2djEyOGgyNTZWMzUyaDk2ICAgYzE3LjYsMCwzMi0xNC40LDMyLTMyVjE2MEM1MTIsMTQyLjQsNDk3LjYsMTI4LDQ4MCwxMjh6IE0zNTIsNDQ4SDE2MFYyODhoMTkyVjQ0OHogTTQ4Ny4xOTksMTc2YzAsMTIuODEzLTEwLjM4NywyMy4yLTIzLjE5NywyMy4yICAgYy0xMi44MTIsMC0yMy4yMDEtMTAuMzg3LTIzLjIwMS0yMy4yczEwLjM4OS0yMy4yLDIzLjE5OS0yMy4yQzQ3Ni44MTQsMTUyLjgsNDg3LjE5OSwxNjMuMTg3LDQ4Ny4xOTksMTc2eiIgZmlsbD0iI0ZGRkZGRiIvPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48L3N2Zz4=);
      background-size: 17px 16px; 
      cursor: pointer; 
    }
    .easyPrintHolder a {
      background-size: 16px 16px;
      cursor: pointer;
    }
    .easyPrintHolder .CurrentSize{
      background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjE2cHgiIHZlcnNpb249IjEuMSIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgNjQgNjQiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDY0IDY0Ij4gIDxnPiAgICA8ZyBmaWxsPSIjMUQxRDFCIj4gICAgICA8cGF0aCBkPSJNMjUuMjU1LDM1LjkwNUw0LjAxNiw1Ny4xNDVWNDYuNTljMC0xLjEwOC0wLjg5Ny0yLjAwOC0yLjAwOC0yLjAwOEMwLjg5OCw0NC41ODIsMCw0NS40ODEsMCw0Ni41OXYxNS40MDIgICAgYzAsMC4yNjEsMC4wNTMsMC41MjEsMC4xNTUsMC43NjdjMC4yMDMsMC40OTIsMC41OTQsMC44ODIsMS4wODYsMS4wODdDMS40ODYsNjMuOTQ3LDEuNzQ3LDY0LDIuMDA4LDY0aDE1LjQwMyAgICBjMS4xMDksMCwyLjAwOC0wLjg5OCwyLjAwOC0yLjAwOHMtMC44OTgtMi4wMDgtMi4wMDgtMi4wMDhINi44NTVsMjEuMjM4LTIxLjI0YzAuNzg0LTAuNzg0LDAuNzg0LTIuMDU1LDAtMi44MzkgICAgUzI2LjAzOSwzNS4xMjEsMjUuMjU1LDM1LjkwNXoiIGZpbGw9IiNGRkZGRkYiLz4gICAgICA8cGF0aCBkPSJtNjMuODQ1LDEuMjQxYy0wLjIwMy0wLjQ5MS0wLjU5NC0wLjg4Mi0xLjA4Ni0xLjA4Ny0wLjI0NS0wLjEwMS0wLjUwNi0wLjE1NC0wLjc2Ny0wLjE1NGgtMTUuNDAzYy0xLjEwOSwwLTIuMDA4LDAuODk4LTIuMDA4LDIuMDA4czAuODk4LDIuMDA4IDIuMDA4LDIuMDA4aDEwLjU1NmwtMjEuMjM4LDIxLjI0Yy0wLjc4NCwwLjc4NC0wLjc4NCwyLjA1NSAwLDIuODM5IDAuMzkyLDAuMzkyIDAuOTA2LDAuNTg5IDEuNDIsMC41ODlzMS4wMjctMC4xOTcgMS40MTktMC41ODlsMjEuMjM4LTIxLjI0djEwLjU1NWMwLDEuMTA4IDAuODk3LDIuMDA4IDIuMDA4LDIuMDA4IDEuMTA5LDAgMi4wMDgtMC44OTkgMi4wMDgtMi4wMDh2LTE1LjQwMmMwLTAuMjYxLTAuMDUzLTAuNTIyLTAuMTU1LTAuNzY3eiIgZmlsbD0iI0ZGRkZGRiIvPiAgICA8L2c+ICA8L2c+PC9zdmc+);
    }
    .easyPrintHolder .page {
      background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ0NC44MzMgNDQ0LjgzMyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDQ0LjgzMyA0NDQuODMzOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4Ij48Zz48Zz48cGF0aCBkPSJNNTUuMjUsNDQ0LjgzM2gzMzQuMzMzYzkuMzUsMCwxNy03LjY1LDE3LTE3VjEzOS4xMTdjMC00LjgxNy0xLjk4My05LjM1LTUuMzgzLTEyLjQ2N0wyNjkuNzMzLDQuNTMzICAgIEMyNjYuNjE3LDEuNywyNjIuMzY3LDAsMjU4LjExNywwSDU1LjI1Yy05LjM1LDAtMTcsNy42NS0xNywxN3Y0MTAuODMzQzM4LjI1LDQzNy4xODMsNDUuOSw0NDQuODMzLDU1LjI1LDQ0NC44MzN6ICAgICBNMzcyLjU4MywxNDYuNDgzdjAuODVIMjU2LjQxN3YtMTA4LjhMMzcyLjU4MywxNDYuNDgzeiBNNzIuMjUsMzRoMTUwLjE2N3YxMzAuMzMzYzAsOS4zNSw3LjY1LDE3LDE3LDE3aDEzMy4xNjd2MjI5LjVINzIuMjVWMzR6ICAgICIgZmlsbD0iI0ZGRkZGRiIvPjwvZz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PC9zdmc+);
    }
    .easyPrintHolder .LetterLandscape { 
      transform: rotate(-90deg);
    }

    .leaflet-control-easyPrint-button{
      display: inline-block;
    }
    .easyPrintHolder{
      margin-top:-31px;
      margin-bottom: -5px;
      margin-left: 30px;
      padding-left: 0px;
      display: none;
    }

    .easyPrintSizeMode {
      display: inline-block;
    }
    .easyPrintHolder .easyPrintSizeMode a {
      border-radius: 0px;
    }

    .easyPrintHolder .easyPrintSizeMode:last-child a{
      border-top-right-radius: 2px;
      border-bottom-right-radius: 2px;
      margin-left: -1px;
    }

    .easyPrintPortrait:hover, .easyPrintLandscape:hover{
      background-color: #757570;
      cursor: pointer;
    }`;
    document.body.appendChild(css);
  },

  _dataURItoBlob: function (dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ab = new ArrayBuffer(byteString.length);
    var dw = new DataView(ab);
    for(var i = 0; i < byteString.length; i++) {
        dw.setUint8(i, byteString.charCodeAt(i));
    }
    return new Blob([ab], {type: mimeString});
  },

  _togglePageSizeButtons: function (e) {
    var holderStyle = this.holder.style
    var linkStyle = this.link.style
    if (e.type === 'mouseover') {
      holderStyle.display = 'block';
      linkStyle.borderTopRightRadius = '0'
      linkStyle.borderBottomRightRadius = '0'
    } else {
      holderStyle.display = 'none';
      linkStyle.borderTopRightRadius = '2px'
      linkStyle.borderBottomRightRadius = '2px'      
    }
  },

  _toggleControls: function (show) {
    var controlContainer = document.getElementsByClassName("leaflet-control-container")[0];
    if (show) return controlContainer.style.display = 'block';
    controlContainer.style.display = 'none';
  },
  _toggleClasses: function (classes, show) {
    classes.forEach(function (className) {
      var div = document.getElementsByClassName(className)[0];
      if (show) return div.style.display = 'block';
      div.style.display = 'none';
    });
  },

  _letterPageSize: {
    height: (8.5 - 0.5) * 90, // (height - margin) * DPI
    width: (11 - 0.5) * 90 // (width - margin) * DPI
  }

});

L.easyPrint = function(options) {
  return new L.Control.EasyPrint(options);
};

