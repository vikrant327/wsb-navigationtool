///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
    'dojo/_base/declare',
    'dojo/_base/lang',
	'dojo/query',
    'jimu/BaseWidget',
    'dojo/_base/html',
	'esri/toolbars/navigation',
	'dijit/registry',
    'dojo/on'
  ],
  function(declare, lang,query, BaseWidget, html,Navigation,registry, on) {
    var clazz = declare([BaseWidget], {
      name: 'NavigationTools',

      baseClass: 'jimu-widget-navigationtools',
      _selectClass:'navSelect',
      _disabledClass: 'jimu-state-disabled',
      _verticalClass: 'vertical',
      _horizontalClass: 'horizontal',
      _floatClass: 'jimu-float-leading',
      _cornerTop: 'jimu-corner-top',
      _cornerBottom: 'jimu-corner-bottom',
      _cornerLeading: 'jimu-corner-leading',
      _cornerTrailing: 'jimu-corner-trailing',
      navToolbar : null,
      postCreate: function(){
        this.inherited(arguments);
        this.own(on(this.map, 'zoom-end', lang.hitch(this, this._zoomHandler)));
		
        this._zoomHandler();
		this.navToolbar = new Navigation(this.map);
		this.navToolbar.on("extent-history-change",lang.hitch(this,this._extentHistoryChangeHandler));
		this.btnNavPrev.disabled = this.navToolbar.isFirstExtent();
      },

      setPosition: function(position){
        this.inherited(arguments);
        if(typeof position.height === 'number' && position.height <= 30){
          this._setOrientation(false);
        }else{
          this._setOrientation(true);
        }
      },
	  _extentHistoryChangeHandler() {
           this.btnNavPrev.disabled = this.navToolbar.isFirstExtent();
           this.btnNavNext.disabled = this.navToolbar.isLastExtent();
       },
      _zoomHandler: function(){
        html.removeClass(this.btnNavZoomIn, this._disabledClass);
        html.removeClass(this.btnNavNext, this._disabledClass);
        var level = this.map.getLevel();
        var disabledButton = null;
        if(level > -1){
          if(level === this.map.getMaxZoom()){
            disabledButton = this.btnNavZoomIn;
          }else if(level === this.map.getMinZoom()){
            disabledButton = this.btnNavZoomOut;
          }
        }
        if(disabledButton){
          html.addClass(disabledButton, this._disabledClass);
        }
      },

      _onBtnNavZoomInClicked: function(){
		 
		 if(html.hasClass(this.btnNavZoomIn,this._selectClass) == true){
			this.navToolbar.deactivate();
			html.removeClass(this.btnNavZoomIn, this._selectClass);  
		 }else{
			query('.nav').removeClass(this._selectClass);
			this.navToolbar.activate(Navigation.ZOOM_IN);
			html.addClass(this.btnNavZoomIn, this._selectClass); 
		 }	
      },

      _onBtnNavZoomOutClicked: function(){
		  
		 if(html.hasClass(this.btnNavZoomOut,this._selectClass) == true){
			this.navToolbar.deactivate();
			html.removeClass(this.btnNavZoomOut, this._selectClass); 
		 }else{
			query('.nav').removeClass(this._selectClass);
			this.navToolbar.activate(Navigation.ZOOM_OUT);
		    html.addClass(this.btnNavZoomOut, this._selectClass);
		 }
        
      },
	  _onBtnNavPan: function(){
	
		 if(html.hasClass(this.btnNavPan,this._selectClass) == true){
			this.navToolbar.deactivate();
			html.removeClass(this.btnNavPan, this._selectClass); 
		 }else{
			query('.nav').removeClass(this._selectClass);
			this.navToolbar.activate(Navigation.PAN);
		    html.addClass(this.btnNavPan, this._selectClass);
		 }
        
      },
	  _onBtnNavPrev: function(){
		  query('.nav').removeClass(this._selectClass);
          this.navToolbar.zoomToPrevExtent();
      },
	  _onBtnNavNext: function(){
		query('.nav').removeClass(this._selectClass);
        this.navToolbar.zoomToNextExtent();
      },

      _setOrientation: function(isVertical){
        html.removeClass(this.domNode, this._horizontalClass);
        html.removeClass(this.domNode, this._verticalClass);

        html.removeClass(this.btnNavZoomIn, this._floatClass);
        html.removeClass(this.btnNavZoomIn, this._cornerTop);
        html.removeClass(this.btnNavZoomIn, this._cornerLeading);

        html.removeClass(this.btnNavNext, this._floatClass);
        html.removeClass(this.btnNavNext, this._cornerBottom);
        html.removeClass(this.btnNavNext, this._cornerTrailing);

        if(isVertical){
          html.addClass(this.domNode, this._verticalClass);
          html.addClass(this.btnNavZoomIn, this._cornerTop);
          html.addClass(this.btnNavNext, this._cornerBottom);
        }else{
          html.addClass(this.domNode, this._horizontalClass);
          html.addClass(this.btnNavZoomIn, this._floatClass);
          html.addClass(this.btnNavNext, this._floatClass);
          html.addClass(this.btnNavZoomIn, this._cornerLeading);
          html.addClass(this.btnNavNext, this._cornerTrailing);
        }
      }

    });
    return clazz;
  });