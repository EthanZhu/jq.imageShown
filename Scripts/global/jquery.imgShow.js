/**
 * @author Ethan.zhu
 * @version 1.0.0
 * @email pig.whose@gmail.com
**/
(function($){
	var PROP_NAME = 'imageShow';
	var imguuid = new Date().getTime();
	var instActive;
	
function ImageShow() {
		this.debug = true; // Change this to true to start debugging
		this._curInst = null; // The current instance in use
		this._cuttentSmall = null;//当前小图片获取焦点，未指定显示第一个。
		this._currentList = null;
		this._currentImg = null;//当前指定显示的图片，如果未设置_currentSmall 则显示页面区域中最顶端一张。
		this._keyEvent = false; // If the last event was a key event
		this._inlineClass = 'ui-imgshow-inline'; // The name of the inline marker class
		this._numCurrentClass = 'ui-imgshow-current-num'; // The name of the current day marker class
		this._smallCurrentClass = 'ui-imgshow-current-small';
		this._smallOverClass = 'ui-imgshow-over-small';
		this._imgSmallClass = 'ui-imgshow-small';
		this._imgSmallItem = 'ui-imgshow-small-item';
		this._imgDistrictClass = 'ui-imgshow-district';
		this._imgListsClass = 'ui-imgshow-images';
		this._imgFatherClass = 'ui-imgshow-image';
		this._imgAddtionalClass = 'ui-imgshow-addtional';
		this._imgNumClass = 'ui-imgshow-imgnums';
		this._tipsInfoClass = 'ui-imgshow-tipinfo';
		this._tipsBackground = 'ui-imgshow-tipbackground';
		this._tipsInfoAlpha = 0.5; //提示区域背景透明度
		this._smallImageAlpha = 0.6, //小图片的透明度
		this._animateInTime = 1000; //淡入时间，减去300为淡出时间（fade时起作用）
		this._backgroundSpeed = 500;//背景动画执行时间（backgroundAnimate 为true时起作用）
		this._defaults = { // Global defaults for all the date picker instances
			isShowTips : true,
			isTipsAnimate : true, //是否动画切换
			imageEventType : 'click',//图片数组区域触发事件
			smallEventType : 'click',//小图区域触发事件
			//backgroundAnimate : false, //小图片背景动画，背景动画需要 jquery.backgroundposition 插件，以及设置图片背景
			animateType : 'fade', //动画类型
			//autoBuild : false, //自动构建图片展示区域
			//builsTwoDistricts : true,//构建两个区域
			//smallDistricts : 'left', //预览小图区域位置 top,right,bottom,left
			//showAdditional : true, //显示附加的第一屏幕
			additionNumsTop : false, //附加首屏图片数量置顶
			showAdditional : true,
			setLists : 2
			
		};
		//$.extend(this._defaults, this.regional['']);
		this.imgDiv = $('<div class="' + this._inlineClass + ' clearfix"><\/div>');
}

$.extend(ImageShow.prototype, {
	markerClassName: 'hasImageShow',
	log: function () {
		if (this.debug)
			console.log.apply('', arguments);
	},
	
	/* Override the default settings for all instances of the image show.
	   @param  settings  object - the new settings to use as defaults (anonymous object)
	   @return the manager object */
	setDefaults: function(settings) {
		extendRemove(this._defaults, settings || {});
		return this;
	},
	
	/* Attach the image show to a jQuery selection.
	   @param  target    element - the target division
	   @param  settings  object - the new settings to use for this image show instance (anonymous) */
	_attachImageShow: function(target, settings) {
		// check for settings on the control itself - in namespace 'date:'
		var inlineSettings = null;
		for (var attrName in this._defaults) {
			var attrValue = target.getAttribute('date:' + attrName);
			if (attrValue) {
				inlineSettings = inlineSettings || {};
				try {
					inlineSettings[attrName] = eval(attrValue);
				} catch (err) {
					inlineSettings[attrName] = attrValue;
				}
			}
		}
		if (!target.id) {
			this.uuid += 1;
			target.id = 'img' + this.uuid;
		}
		var inst = this._newInst($(target));
		//this.log(inst);
		inst.settings = $.extend({}, settings || {}, inlineSettings || {});
		//this._inlineImageShow(target, inst);
		var divSpan = $(target);
		if (divSpan.hasClass(this.markerClassName))
			return;
		$.data(target, PROP_NAME, inst);
		inst.imgDiv.css( "display", "block" );
		this._initSmallDistrict(inst);
		
	},
	
	_initSmallDistrict : function(inst){
		var setLists, $smallList, isShowAddtional, $smallItem, smallNums;
		$smallList = $('.'+this._imgSmallClass);
		$smallItem = $('.'+this._imgSmallItem);
		smallNums = $smallItem.size();
		isShowAddtional = this._get(inst,'showAdditional');
		setLists = this._get(inst,'setLists');
		if(setLists){
			if(setLists > smallNums){
				this._currentSmall = this._currentList = 0;
				this.log('setLists is too big');
			}else{
				this._currentSmall = this._currentList = setLists - 1;
			}
			if(isShowAddtional)
				this._currentList += 1;
			
		}else{
			this._currentSmall = this._currentList = 0;
			if(isShowAddtional)
				this._currentSmall = -1;
		}
		var currentSmall = this._currentSmall
		this._setSmallStyle(currentSmall);
	},
	_setSmallStyle : function(index){
		var $obj = $('.'+this._imgSmallItem);
		$obj.removeClass(this._smallCurrentClass);
		if(index!=-1){
			console.log(index);
			$obj.eq(index).addClass(this._smallCurrentClass);
		}
	},
	_initImageShow: function(inst){
		var isShowAddtional, setLists, $nums, nums, $currentDist, $imagesList, $addtionalDist;
		isShowAddtional = this._get(inst,'showAdditional');
		setLists = this._get(inst,'setLists');
		$imagesList = $('.'+this._imgListsClass);
		$imagesList.hide();
		if(setLists){
			$currentDist = $imagesList.eq(setLists-1);
			$currentDist.show();
		}else{
			$currentDist = $imagesList.eq(0);
			if(isShowAddtional){
				$addtionalDist = $currentDist;
				$addtionalDist.addClass(this._imgAddtionalClass);
			}
		}
		nums = $currentDist.find('.'+this._imgFatherClass).size();
		$currentDist.show();
		var id = inst.id;
		this._initImageNums(id,$currentDist,nums,$nums);
		
		
	},
	
	_initImageNums : function(id,$obj,nums){
		var $nums = $('.'+this._imgNumClass);
		$nums.html('');
		for(var i =0; i<nums; i++){
			$('<a href="javascript:void(0)" >'+(i+1)+'</a>').appendTo($nums);
		}
		$nums.width(nums*(20));//16+2+2,width+border+margin-left
		//var id = delegate
		//if($(id))
		var $events = $nums.data('events')
		if(!$events){
			this._bindNumsEvent(id,$nums);
		}else{
			var $eventClick = $events['click'];
			if(!$eventClick)
				this._bindNumsEvent(id,$nums);
		}
	},
	_showTipsInfo : function($obj,index){
		var $imgShow = this;
		var $tipInfo = $('.'+$imgShow._tipsInfo);
		var $tipBackground = $('.'+$imgShow._tipsBackground);
		var tipInfo = $obj.closest('p').siblings().eq(index).find('label').html();
		console.log(tipInfo);
		if($imgShow.isTipsAnimate){
			$imgShow._tipsAnimate($tipBackground,$tipInfo,tipInfo);
		}else{
			$imgShow._tipsNoAnimate($tipBackground,$tipInfo,tipInfo);
		}
		$imgShow = null;
	},
	_tipsAnimate : function($tipBackground,$tipInfo,tipInfo){
		if(tipInfo){
			$tipInfo.stop(true,true).slideUp().html('').html(tipInfo).stop(true,true).slideDown();
			$tipBackground.stop(true,true).slideUp().stop(true,true).slideDown();
		}else{
			$tipInfo.stop(true,true).slideUp().html('');
			$tipBackground.stop(true,true).slideUp()
		}
	},
	_tipsNoAnimate : function($tipBackground,$tipInfo,tipInfo){
		if(tipInfo){
			$tipBackground.show();
			$tipInfo.html('').html(tipInfo);
		}else{
			$tipInfo.html('');
			$tipBackground.hide();
		}
	},
	
	_bindNumsEvent : function(id,$nums){
		//console.log(id);
		var $target = $('#'+id);
		var $imgShow = this;
		var inst = $imgShow._getInst($target[0]);
		$nums.delegate('a','click',function(){
			var $this = this;
			var $obj = $(this);
			var index = $obj.index();
			//alert(index);
			//var tipInfo  = $.text($tipLable);
			var numCurrentClass = $imgShow._numCurrentClass;
			$obj.blur().siblings().removeClass(numCurrentClass);
			$this.className = numCurrentClass;
			if($imgShow._get(inst,'isShowTips')){
				$imgShow._showTipsInfo($obj,index);
			}
// 					
					// //alert(numIndex);
					// //
					// $this.className = 'ui-imgshow-current';
					// $obj.blur().siblings().removeClass('ui-imgshow-current');
					// if(_defaults.isShowTips){
						// imgShow._showTipsInfo(imgShow,$obj,numIndex);
					// }
					// imgShow._showImageCurrent(numIndex);
		})
		
	},
	
	/* Create a new instance object. */
	_newInst: function(target) {
		var id = target[0].id.replace(/([^A-Za-z0-9_-])/g, '\\\\$1'); // escape jQuery meta chars
		return {
			id: id, 
			district: target, // associated target
			imgDiv: this.imgDiv
		};
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
			throw 'Missing instance data for this datepicker';
		}
	},
	/* Get a setting value, defaulting if necessary. */
	_get: function(inst, name) {
		return inst.settings[name] !== undefined ?
			inst.settings[name] : this._defaults[name];
	}
});
	
	
	
function isArray(a) {
	return (a && (($.browser.safari && typeof a == 'object' && a.length) ||
		(a.constructor && a.constructor.toString().match(/\Array\(\)/))));
};
	
$.fn.imageShow = function(options){
	/* Verify an empty collection wasn't passed - Fixes #6976 */
	if ( !this.length ) return this;
	
	/* Initialise the date picker. */
	if (!$.imageShow.initialized) {
		//alert('aa');
		//$(document).find('body').append($.imageShow.dpDiv);
		$.imageShow.initialized = true;
	}
	
	var otherArgs = Array.prototype.slice.call(arguments, 1);
		
	if(typeof options =='string'){
			
	}
	console.log((this));
	return this.each(function() {
		$.imageShow._attachImageShow(this, options);
	});
/*
		typeof options == 'string' ?
			$.imageShow['_' + options + 'ImageShow'].
				apply($.imageShow, [this].concat(otherArgs)) :
			$.imageShow._attachImageShow(this, options);
*/
};

$.imageShow = new ImageShow(); // singleton instance
$.imageShow.initialized = false;
$.imageShow.uuid = new Date().getTime();
$.imageShow.version = "@VERSION";

// Add another global to avoid noConflict issues with inline event handlers
window['IMG_jQuery_' + imguuid] = $;

})(jQuery)