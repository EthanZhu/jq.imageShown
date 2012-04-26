/**
 * @author Sharon
 */
(function($,undefined){

var PROP_NAME = 'imageShown';
var imguuid = new Date().getTime();

function ImageShownT() {
	this.debug = false; // Change this to true to start debugging
	//this._curInst = null; // The current instance in use
	this._thumbCall = null;
	this.classes = [];
	this.classes[''] = {
		mainClass : 'images-shown',
		thumbClass : 'imgshown-thumbnail',
		thumbItemClass : 'imgshown-thumb-item',
		thumbScrollClass : 'imgshown-thumb-scroll',
		scrollOverClass : 'imgshown-thumb-scroll-over',
		thumbOverClass : 'imgshown-thumb-item-over',
		tbaArrowClass : 'imgshown-tba-arrow',
		tbaArrowAsideClass : 'imgshown-tba-aside',
		tbaPrevClass : 'imgshown-tba-prev', //tba = thumbnail arrow
		tbaNextClass : 'imgshown-tba-next',
		tbapActiveClass : 'imgshown-tbap-active',
		tbapHoverClass : 'imgshown-tbap-hover',
		clearfix : 'clearfix'
	};
	this._defaults = { 				// Global defaults for all the Images Shown instances
		id : null,					 //this for return uuid, when the element hasn't set id by yourself.
		thumbnail : 'setter',
		thumbImage : [],
		addtional : false,
		curThumbnail : 5,			// current selected thumbnail
		tbgAnimate : true,			//thumbnail background animate
		thumbEvent : 'mouseover',
		thumbPosition : 'left',
		thumbCallback : null,
		thumbArrowStep:'one'		//one,half,all
	};
	$.extend(this._defaults, this.classes['']);
}

$.extend(ImageShownT.prototype, {
	/* Class name added to elements to indicate already configured with a Images Shown. */
	markerClassName: 'hasimageShown',

	/* Debug logging (if enabled). */
	log: function () {
		if (this.debug)
			console.log.apply('', arguments);
	},

	/* Override the default settings for all instances of the Images Shown.
	   @param  settings  object - the new settings to use as defaults (anonymous object)
	   @return the manager object */
	setDefaults: function(settings) {
		extendRemove(this._defaults, settings || {});
		return this;
	},

	/* Attach the Images Shown to a jQuery selection.
	   @param  target    element - the target input field or division or span
	   @param  settings  object - the new settings to use for this Images Shown instance (anonymous) */
	_attachImageShownT: function(elem, settings) {
		// check for settings on the control itself - in namespace 'date:'
		var id = elem.id;
		var $elem = $(elem);
		
		var inlineSettings = null;
		for (var attrName in this._defaults) {
			var attrValue = elem.getAttribute('date:' + attrName);
			if (attrValue) {
				inlineSettings = inlineSettings || {};
				try {
					inlineSettings[attrName] = eval(attrValue);
				} catch (err) {
					inlineSettings[attrName] = attrValue;
				}
			}
		}
		if (!id) {
			this.uuid += 1;
			elem.id = 'img' + this.uuid;
		}
		this._defaults.id = elem.id;
		var inst = this._newInst($(elem));
		inst.settings = $.extend({}, settings || {}, inlineSettings || {});
	
		if ($elem.hasClass(this.markerClassName))
			return;
		$elem.addClass(this.markerClassName);
		$.data(elem, PROP_NAME, inst);

		this._updateImageShownT(inst);
	
	},
	
	_updateImageShownT: function(inst){
		console.log(inst);
		this._updateThumbnail(inst);
	},
	_updateThumbnail: function(inst){
		var id = inst.id;
		var $elem = inst.element;
		var thumb = this._get(inst,'thumbnail');
		var className = $elem[0].className
		if(className) className = ' Class: '+className;
		else className='';
		var thumbClass = this._get(inst,'thumbClass');
		var $thumbnail = $elem.find('div.'+thumbClass);
		var thumbnail = $thumbnail[0];
		switch (thumb){
			case 'setter': {
				console.log($thumbnail);
				if(inst.elemThumb){
					$thumbnail = inst.elemThumb;
					$thumbnail.appendTo($elem);
					$thumbnail = $elem.find('div.'+thumbClass);
					thumbnail = $thumbnail[0];
				}
				if(typeof thumbnail=='undefined'){
					return;
				}
				else{
					var $thumbnailItems = $thumbnail.find('.'+this._get(inst,'thumbItemClass'));
					if($thumbnailItems.size()==0){
						var arryThumb = this._get(inst,'thumbImage');
						if(!arryThumb||arryThumb.length==0){
							return;
						}
					}
				}
				break;
			}
			case 'auto': {
				//$elem.html('');
				var totalDistrict = inst.totalDistrict;
				if(!inst.totalDistrict||inst.totalDistrict==0){
					return;
				}
				if(typeof thumbnail!='undefined'){
					inst.elemThumb = $thumbnail;
					$thumbnail.remove();
				}
				$thumbnail = $('<div id="thumbnail-'+id+'" class="hasSetID '+thumbClass+'"><ul class="'+this._get(inst,'clearfix')+'"><\/ul><\/div>');
				$thumbnail.appendTo($elem);
				//console.log(totalDistrict);
				this._autoBuildThumbnail(inst,$thumbnail,totalDistrict);
				break;
			}
			default: {
				$elem.html('').html('id: '+id+ className +' <br>"thumbnail"设置错误，允许的值为："set","auto"'+attention);
				return;
			}
		}
		$thumbnail = $elem.find('div.'+this._get(inst,'thumbClass')).detach();
		thumbnail = $thumbnail[0];
		if(typeof thumbnail !='undefined'){
			if(!$thumbnail.hasClass('hasSetID')){
				if(thumbnail.id){
					thumbnail.id += ' thumbnail-'+id;
				}
				else{
					thumbnail.id = 'thumbnail-'+id;
				}
				$thumbnail.addClass('hasSetId');
			}
			$thumbnail.appendTo($elem);
		}
		this._resetThumbImg(inst);
		this._optionAddtional(inst);
		this._setThumbnailOptions(inst);
		var bgAnimateTag = this._get(inst,'tbgAnimate');
		if(bgAnimateTag) this._appendScrollDiv(inst);
		else{
			var $scroll = $('#scroll-'+id)
			if(typeof $('#scroll-'+id)[0]!='undefined'){
				$scroll.remove();
			}
		}
		this._thumbnailHover(inst);		
		this._instThumbArrow(inst);
		this._setSelectedStyle(inst);
	},

	_setThumbnailOptions: function(inst){
		var id = inst.id;
		var addtional = this._get(inst,'addtional');
		var $thumbail = $('#thumbnail-'+ id);
		var $thumbnailItems =  $thumbail.find('li.' + this._get(inst,'thumbItemClass'));
		var $thumbnailItem =  $thumbail.find('li.' + this._get(inst,'thumbItemClass')).last();
		var curThumbnail = parseInt(this._get(inst,'curThumbnail'));
		var thumbItemSize = $thumbnailItems.size();
		inst.totalThumb = thumbItemSize;
		if(curThumbnail<1||curThumbnail>thumbItemSize)
			curThumbnail = 1;

		if(addtional){
			inst.isAddtional = true;
			curThumbnail +=1;
			inst.totalThumb -=1;
		}
		//thumbItemSize = inst.totalThumb;
		inst.selectedThumbnail = curThumbnail;
		var thumbPosition = this._get(inst,'thumbPosition');

		if(thumbPosition=='left'||thumbPosition=='right'){
			var outerHeight = $thumbnailItem.outerHeight(true);
			inst.thumbDistance = $thumbail.innerHeight(true);
			inst.tbaDistance = outerHeight;
			inst.tbaMargin = outerHeight - $thumbnailItem.height();
		}
		else{
			var outerWidth = $thumbnailItem.outerWidth(true);
			inst.thumbDistance = $thumbail.innerWidth(true);
			inst.tbaDistance = outerWidth;
			inst.tbaMargin = outerWidth - $thumbnailItem.width();
		}
		
		$thumbail = $thumbnailItems = null;
	},
	_instThumbArrow: function(inst){
		var id = inst.id;
		var $elem = inst.element;
		var mainDistance = inst.thumbDistance;
		var tbaDistance = inst.tbaDistance;
		var thumbpos = this._get(inst,'thumbPosition');
		var currentSee;
		currentSee = parseInt(mainDistance/(inst.tbaDistance-inst.tbaMargin));
		inst.thumbSeen = currentSee;
		var $thumbnail = $('#thumbnail-'+ id);
		var totalThumb = inst.totalThumb;
		if((totalThumb*tbaDistance-mainDistance)>0){
			$thumbnail.find('ul').css({'height':totalThumb*tbaDistance,'position':'absolute'});
		}
		//var arrowShow = this._get(inst,'arrowShow');
		var $arrow = $elem.find('div.hasThumbArrow');
		if(totalThumb == currentSee) $arrow.remove();
		if(totalThumb > currentSee && ($arrow.size()==0)){
			$('<div id="arrow-prev-'+id+'" class="hasThumbArrow '+
					this._get(inst,'tbaArrowClass')+'"><span class="'+this._get(inst,'tbaPrevClass')+'"><\/span><\/div><div id="arrow-next-'+
					id+'" class="hasThumbArrow '+this._get(inst,'tbaArrowClass')+' '+
					this._get(inst,'tbaArrowAsideClass')+'"><span class="'+this._get(inst,'tbaNextClass')+'"><\/span><\/div>').
			appendTo($elem);
			
			this._bindArrowHover(inst);
			this._bindArrowClick(inst);
		}
	},
	_bindArrowClick:function(inst){
		var id = inst.id;
		var $elem = inst.element;
		$elem.find('div.'+this._get(inst,'tbaArrowClass')).click(function(){
			var $this = $(this);
			var self = this;
			if($this.hasClass(self._get(inst,'tbapActiveClass'))){
				var thumbDistance = inst.thumbDistance;
				//var totla，
				$this.addClass(self._get(inst,'tbapHoverClass'));
			}
			$this = null;
				
		})
	},
	_bindArrowHover: function(inst){
		var id = inst.id;
		var $elem = inst.element;
		var self = this;
		$elem.find('div.'+this._get(inst,'tbaArrowClass')).hover(function(){
				var $this = $(this);
				if($this.hasClass(self._get(inst,'tbapActiveClass'))){
					$this.addClass(self._get(inst,'tbapHoverClass'));
				}
				$this = null;
			},function(){
				var $this = $(this);
				$this.removeClass(self._get(inst,'tbapHoverClass'));
				$this = null;
			}
		);
	},
	
	
	
	_optionAddtional: function(inst){

		var id = inst.id;
		var addtional = this._get(inst,'addtional');
		var thumbItemClass = this._get(inst,'thumbItemClass');
		var addtionalItem = '<li class="'+ this._get(inst,'thumbItemClass') +' imgshown-addtional" style="display:none;"><\/li>';
		var $thumbail = $('#thumbnail-'+ id);
		var $thumbnailItem;
		if(addtional){
			$thumbnailItem = $thumbail.find('li.' + thumbItemClass+ ':eq(0)');
			if(!$thumbnailItem.hasClass('addtional')){
				$(addtionalItem).prependTo($thumbnailItem.closest('ul'));
				$thumbnailItem = $thumbail.find('li.' + thumbItemClass+ ':eq(0)');
			}
		}
		else{
			$thumbnailItem = $thumbail.find('li.' + thumbItemClass+ ':eq(0)');
			if($thumbnailItem.hasClass('ui-imgshown-addtional')){
				$thumbnailItem.remove();
				$thumbnailItem = $thumbail.find('li.' + thumbItemClass+ ':eq(0)');
			}
		}
		$thumbail = $thumbnailItem = null;
		//console.log($thumbnailItem);
	},
	
	_resetThumbImg: function(inst){
		var images = this._get(inst,'thumbImage');
		var titems = $('#thumbnail-'+inst.id).find('.'+this._get(inst,'thumbItemClass')).not('.imgshown-addtional');
		var tsize = titems.size();
		for(var i in images){
			if(images[i]!=''){
				titems.eq(i).html('').html(images[i]);
			}
			if(parseInt(i)==(tsize-1)){
				return
			}
		}
	},
	_autoBuildThumbnail: function(inst,$thumbnail,total){
		var items = '';
		for(var i=0;i<total;i++){
			items +='<li class="'+this._get(inst,'thumbItemClass')+'">'+(i+1)+'<\/li>';
		}
		var $farther = $thumbnail.closest('div.'+this._get(inst,'thumbClass'));
		$thumbnail.find('ul').html('').html(items);
	},
/*
	_updateThumbnail1: function(inst){
		var id = inst.id;
		var $elem = inst.element;
		var $thumbnail = $elem.find('div.'+this._get(inst,'thumbClass')).detach();
		var thumbnail = $thumbnail[0];
		if(typeof thumbnail !='undefined'){
			if(!$thumbnail.hasClass('hasSetId')){
				if(thumbnail.id){
					thumbnail.id += ' thumbnail-'+id;
				}
				else{
					thumbnail.id = 'thumbnail-'+id;
				}
				$thumbnail.addClass('hasSetId');
			}
			$thumbnail.appendTo($elem);
		}
		else{
			extendRemove(inst.settings,{'thumbnail': false});
			return;
		}
		$thumbnail = $elem = null;
		this._instThumbnail(inst);
		this._instThumbArrow(inst);
		//this._autoPlay(inst);
	},
	*/

	_instThumbnail:function(inst){
		var id = inst.id;
		var thumbTag = this._get(inst,'thumbnail');
		var $elem = inst.element;
		if(thumbTag){
			var $thumbnail = $elem.find('div.'+this._get(inst,'thumbClass'))//.detach();
			if($thumbnail[0].style.display=='none')
				$thumbnail.show();
			//$thumbnail.appendTo($elem);
			
			//this._optionAddtional(inst);
			this._setThumbnailOptions(inst);
			
		}
		else{
			$thumbnail.hide(); 
		}
	},
	_thumbnailHover:function(inst){
		var id = inst.id;
		var self = this;
		var eventType = self._get(inst,'thumbEvent');
		var $thumbnail = $('#thumbnail-' + id);
		$thumbnail.delegate('.'+self._get(inst,'thumbItemClass'), eventType, function(e){
			
			var mySelf = self;
			var myInst = inst;
			if(eventType=='click')
				e.preventDefault();
			var $this = this;
			var $obj = $(this);
			var index = $obj.index();
			var selectedThumbnail = myInst.selectedThumbnail;
			if(index+1!=selectedThumbnail){
				mySelf._thumbCall = null;
				myInst.selectedThumbnail = index+1;
				mySelf._setSelectedStyle(myInst);
			}
			mySelf = myInst = null;
		})
	},
	_appendScrollDiv: function(inst){
		var id = inst.id;
		var $scroll = $('#scroll-' + id);
		var scrollDiv = '<div id="scroll-'+ id +'" class="'+this._get(inst,'thumbScrollClass')+'"> <\/div>';
		if(typeof $scroll[0]=='undefined'){
			$(scrollDiv).appendTo($('#thumbnail-' + id));
		}
	},
	_setSelectedStyle: function(inst){
		var id = inst.id;
		var self = this;
		var curThumbnail = inst.selectedThumbnail-1;
		var animateIndex = curThumbnail;
		if(self._get(inst,'addtional')) animateIndex -=1;
		var bgAnimateTag = self._get(inst,'tbgAnimate');
		var $thumbItem = $('#thumbnail-'+id).find('li.'+self._get(inst,'thumbItemClass')).eq(curThumbnail);
		var thumbOverClass = self._get(inst,'thumbOverClass');
		var scrollOverClass = self._get(inst,'scrollOverClass');
		var selectedClass;
		var thumbDistance = inst.thumbDistance;
		var tbaDistance = inst.tbaDistance;
		var tbaMargin = inst.tbaMargin;
		var animateDistance = tbaDistance*animateIndex;
		var haveSet = animateIndex+1-inst.thumbSeen;
		if(haveSet>0);
			
		console.log();
		if(bgAnimateTag){
			var $thumbScroll = $('#scroll-'+ id);
			selectedClass = scrollOverClass;
			if($thumbItem.hasClass(thumbOverClass))
				$thumbItem.removeClass(thumbOverClass);
			var thumbPosition = self._get(inst,'thumbPosition');
			
			if(thumbPosition=='left'||thumbPosition=='right'){
				var top = animateDistance - thumbDistance;
				$thumbScroll.stop(true,true).css({'z-index':'4'}).stop(true,true).animate({'top':animateDistance},100,function(){
					var $this=$(this);
					$this.css('z-index',2);
					//if(top>thumbDistance)
				});
				//var thumbSeen = inst.thumbSeen;
				//console.log($thumbItem.closest('ul'));
				
				//$thumbItem.closest('ul').css('top',(animateDistance - inst.thumbDistance -inst.tbaDistance));
				//if((animateIndex+1) >thumbSeen){
					//console.log($thumbScroll.position().top)
				//}
				
				
			}
			else{
				$thumbScroll.stop(true,true).css({'z-index':'4'}).stop(true,true).animate({'margin-left':animateDistance},100,function(){
					$(this).css('z-index',2);
				});
			}
		}else{
			selectedClass = thumbOverClass
			if($thumbItem.hasClass(scrollOverClass))
				$thumbItem.removeClass(scrollOverClass);
		}
		$thumbItem.addClass(selectedClass).siblings().removeClass(selectedClass);
		
		
		
		
		var callback = self._get(inst,'thumbCallback')
		if(callback&&this._thumbCall!=callback){
			this._thumbCall = callback;
			callback(inst);
		}
		
	},

	_getScrollDistance: function(inst){
		var thumbTag = this._get(inst,'thumbnail');
		if(!thumbTag) return;
		var id = inst.id;
		var $thumbail = $('#thumbnail-'+ id);
		var $thumbnailItem =  $thumbail.find('li.' + this._get(inst,'thumbItemClass')).last();;
		var thumbPosition = this._get(inst,'thumbPosition');

		if(thumbPosition=='left'||thumbPosition=='right'){
			var outerHeight = $thumbnailItem.outerHeight(true);
			inst.thumbDistance = $thumbail.innerHeight(true);
			inst.tbaDistance = outerHeight;
			inst.tbaMargin = outerHeight - $thumbnailItem.height();
		}
		else{
			var outerWidth = $thumbnailItem.outerWidth(true);
			inst.thumbDistance = $thumbail.innerWidth(true);
			inst.tbaDistance = outerWidth;
			inst.tbaMargin = outerWidth - $thumbnailItem.width();
		}
	},
	/* Create a new instance object. */
	_newInst: function(elem) {
		var id = elem[0].id.replace(/([^A-Za-z0-9_-])/g, '\\\\$1'); // escape jQuery meta chars
		return {id: id, 
			element: elem,
			elemThumb: null,
			selectedThumbnail: 1,
			totalDistrict: 6,
			thumbDistance:0,
			tbaDistance:0,
			tbaMargin:0,
			totalThumb:0,
			isAddtional:false,
			thumbSeen:0,
		};
	},
	
	/* Get a setting value, defaulting if necessary. */
	_get: function(inst, name) {
		return inst.settings[name] !== undefined ?
			inst.settings[name] : this._defaults[name];
	},
	/* Retrieve the instance data for the target control.
	   @param  target  element - the target input field or division or span
	   @return  object - the associated instance data
	   @throws  error if a jQuery problem getting data */
	_getInst: function(target) {
		try {
			return $.data(target, PROP_NAME);
		}
		catch (err) {
			throw 'Missing instance data for this imageShown';
		}
	},

	/* Update or retrieve the settings for a Images Shown attached to an input field or division.
	   @param  target  element - the target input field or division or span
	   @param  name    object - the new settings to update or
	                   string - the name of the setting to change or retrieve,
	                   when retrieving also 'all' for all instance settings or
	                   'defaults' for all global defaults
	   @param  value   any - the new value for the setting
	                   (omit if above is an object or to retrieve a value) */
	_optionImageShownT: function(target, name, value) {
		var inst = this._getInst(target);
		if (arguments.length == 2 && typeof name == 'string') {
			return (name == 'defaults' ? $.extend({}, $.imageShownT._defaults) :
				(inst ? (name == 'all' ? $.extend({}, inst.settings) :
				this._get(inst, name)) : null));
		}
		var settings = name || {};
		if (typeof name == 'string') {
			settings = {};
			settings[name] = value;
		}
		if (inst) {
			if (this._curInst == inst) {
				//this._hideimageShown();
			}
			extendRemove(inst.settings, settings);
			this._updateImageShownT(inst);
		}
		inst = null;
	}
	
});
/* jQuery extend now ignores nulls! */
function extendRemove(target, props) {
	$.extend(target, props);
	for (var name in props)
		if (props[name] == null || props[name] == undefined)
			target[name] = props[name];
	return target;
};

/* Determine whether an object is an array. */
function isArray(a) {
	return (a && (($.browser.safari && typeof a == 'object' && a.length) ||
		(a.constructor && a.constructor.toString().match(/\Array\(\)/))));
};

/* Invoke the imageShown functionality.
   @param  options  string - a command, optionally followed by additional parameters or
                    Object - settings for attaching new imageShown functionality
   @return  jQuery object */
$.fn.imageShownT = function(options){
	
	/* Verify an empty collection wasn't passed - Fixes #6976 */
	if ( !this.length ) {
		return this;
	}
	
	/* Initialise the Images Shown. */
	if (!$.imageShownT.initialized) {
		$.imageShownT.initialized = true;
	}

	var otherArgs = Array.prototype.slice.call(arguments, 1);
	// if (typeof options == 'string' && (options == 'isDisabled' || options == 'getDate' || options == 'widget'))
		// return $.imageShown['_' + options + 'ImageShown'].
			// apply($.imageShown, [this[0]].concat(otherArgs));
	if (options == 'option' && arguments.length == 2 && typeof arguments[1] == 'string')
		return $.imageShownT['_' + options + 'ImageShownT'].
			apply($.imageShownT, [this[0]].concat(otherArgs));
	return this.each(function() {
		typeof options == 'string' ?
			$.imageShownT['_' + options + 'ImageShownT'].
				apply($.imageShownT, [this].concat(otherArgs)) :
			$.imageShownT._attachImageShownT(this, options);
	});
};

$.imageShownT = new ImageShownT(); // singleton instance
$.imageShownT.initialized = false;
$.imageShownT.uuid = new Date().getTime();
$.imageShownT.version = "@VERSION";

// Workaround for #4055
// Add another global to avoid noConflict issues with inline event handlers
window['IMG_jQuery_' + imguuid] = $;

})(jQuery);
