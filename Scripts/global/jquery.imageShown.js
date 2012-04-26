/******************************************
 * gomesoft.com
 *
 * @author          Ethan.zhu 朱宜栋（zhuyidong）
 * @copyright       Copyright (c) 2012 gomesoft.com
 * @license         This imageShown jQuery plug-in is dual licensed under the MIT and GPL licenses.
 * @link            http://www.gomesoft.com
 * @docs            http://www.gomesoft.com/plugins/ethan/imageshown
 * @version         Version 1.0
 * @email			pig.whose@gmail.com; 12377166@qq.com
 * 
 *
 ******************************************/
(function($,undefined){
var PROP_NAME = 'imageShown';
var imguuid = new Date().getTime();

function ImageShown(){
	this.debug = true;
	this._blankImg = 'Content/images/blank.gif';
	this.classes = [];
	this.classes['']= {
		_thumb: 'img-thumbnail', 
		_tlist: 'img-thumb-list', 
		_items: 'img-thumb-items', 
		_item: 'img-thumb-item', 
		_btn: 'img-thumb-btn',
		_btnPrev: 'img-thumb-btn-prev', 
		_btnNext: 'img-thumb-btn-next', 
		_active: 'img-thumb-active', 
		_hover: 'img-thumb-hover', 
		_aside: 'img-thumb-aside',
		_scroll: 'img-thumb-scroll', 
		_sover: 'img-thumb-scroll-over', 
		_tover: 'img-thumb-item-over', 
		_player: 'img-thumb-player', 
		_message:'img-tips-message',
		_tbackground: 'img-tips-background', 
		_tinfo: 'img-tips-info', 
		_tipsDeep: 'img-tips-deep-nav',
		_pitem:'img-player-item',
		_plist:'img-player-list',
		_otitle:'img-tips-ot',
		_tbtn:'img-tips-btn',
		_ptype:'img-player-type',
		_addtional:'img-thumb-addtional'
	};
	this._defaults = {
		id:	null, 
		build: 'auto',
		thumbSpace: 47, 
		pWidth: 0 , 
		pHeight:0 , 
		thumbNum: 4, 
		navPosition: null, 
		autoPlay: true, 
		autoTime: 4000, 
		events: 'mouseenter', 
		tbgAnimate: true, 
		tbgSpeed: 'fast', 
		addtional:false,
		step: 1, 
		scrollSpeed:'fast',
		opacity:0.6, 
		data: null, 
		loop: true, 
		player: true, 
		animate: 'fade',//left,right,top,bottom,fade,none
		deepNav: false, 
		showTips: true, 
		tipsAnimate: 'fade',//fade,slide
		selected: 1, 
		callback: null, 
		preloading: true, 
		target: '_blank', 
		pSpeed:500, 
		pType: false,
		tType:'image',//num,none,image,content
		listPosition:'',
		tipsBtn:false, 
		loadClass: 'img-player-loading'
	};
	
	$.extend(this._defaults, this.classes['']);
}
$.extend(ImageShown.prototype, {
	markerClassName: 'hasImageShown',
	log: function () {
		if (this.debug)
			console.log.apply('', arguments);
	},
	setDefaults: function(settings) {
		extendRemove(this._defaults, settings || {});
		return this;
	},
	_instImageShown: function(elem, settings) {
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
		
		if ($elem.hasClass(this.markerClassName)) return;
		$elem.addClass(this.markerClassName);
		$.data(elem, PROP_NAME, inst);
		this._updateImageShown(inst);
	
	},
	_updateImageShown: function(inst){
		inst.firstPlay = false;
		if(this._get(inst,'player')){
			inst.$player = $('<div class="'+this._get(inst,'_player')+'" />');
			if(this._get(inst,'preloading')){
				var _loading = this._get(inst,'loadClass');
				if(!inst.$player.hasClass(_loading)) inst.$player.addClass(_loading);
			}
			else if(inst.$player.hasClass(_loading)) inst.$player.removeClass(_loading);
			$('<ul class="'+ this._get(inst,'_plist') +'" />').appendTo(inst.$player);
		} 
		else{
			inst.$player = '';
		}
		//console.log(this._get(inst,'_thumbnail'));
		inst.$nav = $('<div class="'+this._get(inst,'_thumb')+'" />');
		inst.$btnPrev = $('<div class="'+this._get(inst,'_btn')+'"><span class="'+this._get(inst,'_btnPrev')+'" />');
		inst.$btnNext = $('<div class="'+this._get(inst,'_btn')+' '+this._get(inst,'_aside')+'"><span class="'+this._get(inst,'_btnNext')+'" />');
		inst.$navList = $('<div class="'+this._get(inst,'_tlist')+'" />');
		inst.$itemList = $('<ul class="'+this._get(inst,'_items')+'" />');
		
		if(this._get(inst,'showTips')){
			inst.$tipsBg = $('<div class="'+this._get(inst,'_tbackground')+'" />');
			inst.$tipsInfo = $('<div class="'+this._get(inst,'_tinfo')+'">');
		}
		else{
			inst.$tipsBg = '';inst.$tipsInfo = '';
		}
		var thisData = this._get(inst,'data');
		var instData = inst.data;
		if(thisData&&!instData){
			inst.data = [];
			var thisLength = thisData.length, self;
			for(var i=0;i<thisLength;i++){
				self = thisData[i];
				if(!isEmptyObject(self)) inst.data.push(self)
			}
		}
		if (instData&&thisData){
			var instLength = instData.length, thisLength = thisData.length, self;
			for(var i=0;i<thisLength;i++){
				self = thisData[i];
				if(!isEmptyObject(self)){
					if(i<instLength) inst.data[i] = self;
					else inst.data.push(self);
				
				}
			}
		}
		inst.completeImg = [];
		var data = inst.data;
		if(data&&isArray(data)){//data is not null and data is an array
			inst.total = data.length;
			this._updeteOptions(inst);
			this._instHtml(inst);
			this._initEvents(inst);
		}

	},
	_getProperty: function(image,link,target,width,height){
		var _link, _src, _target, _alt, _width, _height, self;
		_width = width||'', _height=height||'';
		if(typeof image=='string'){
			_src=image, _link=link, _target=target, _alt='';
		}
		else{
			self= isArray(image)? image[0]: image;
			!$.isEmptyObject(self)? (
				_link = self.l ? self.l : link,
				_src = self.p ? self.p : '',
				_target = self.t ? self.t : target,
				_alt = self.a ? self.a : '',
				_width = self.w ? self.w : _width,
				_height = self.h ? self.h : _height
			):'';
		}
		
		if(_src) return {l:_link, p: _src, t: _target, a: _alt, h:_height, w:_width};
		else return 'nothing';

	},
	_instHtml:function(inst){
		var $t=this, build = $t._get(inst,'build'), data =inst.data;
		build=='setter'?'':'';//waiting for to do something
		inst.$elem.html('');
		var i, bigs, thumb, l, b, s, self, t = $t._get(inst,'target'), total = inst.total, 
			ph = $t._get(inst,'pHeight'), td = $t._get(inst,'tType'), 
			pw = $t._get(inst,'pWidth'), ti = $t._get(inst,'_item'), pi = $t._get(inst,'_pitem'),
			pl = $t._get(inst,'preloading'), py = $t._get(inst,'player');
		inst.images=[];
		var getImage = function(image,l,witch,css,i){
			var im, img, $img, wh, cls;
			witch=='big'? (im=$t._getProperty(image.b,l,t,pw,ph) , cls=pi)
						: (im=$t._getProperty(image.s,l,t), cls=ti);
			im!='nothing'?(
				im.w&&im.h&im.w!=''&&im.h!='' ?
						 (img = pl ? 'data-origital="'+im.p+'" width="'+im.w+'" height="'+im.h+'" src="'+$t._blankImg+'"' : 'width="'+im.w+'" height="'+im.h+'" src="'+im.p+'"')
						:(img = pl ? 'data-origital="'+im.p+'" src="'+$t._blankImg+'"' : 'src="'+im.p+'"')
				,
				$img = $(['<li class="'+ cls +'"><a href="'+ im.l +'" target="'+ im.t +'"><img '+ img +' alt="'+ im.a +'" /></a></li>'].join(""))
			):(
				$img = $(['<li class="'+ cls +'">Need image here.</li>'].join(""))
			);
			css? $img.css({'z-index':total-i,opacity: 0}):'';
			return $img;
		};
		if(py){
			for(i=0; i<total; i++){
				self = data[i], l = self.l;
				if(!isEmptyObject(self)){
					bigs = getImage(self,l,'big',true,i);
					inst.images.push(bigs);
					inst.$player.find('ul').append(bigs);
				}
			}
		}
		var getContent = function(content,l,which){
			var cls
			which=='small'? cls = ti : '';
			if (typeof content=='string') return $(['<li class="'+ cls +'"><a href="'+l+'" target="'+t+'">'+content+'</a></li>'].join(""));
			else if(typeof content=='object')
				var _l= content.l? content.l:l, _t= content.t? content.t:t, _c= content.p;
				return $(['<li class="'+ cls +'"><a href="'+_l+'" target="'+_t+'">'+_c+'</a></li>'].join(""));
		};
		var setTunbnail = function(data,type){
			for(i=0; i<total; i++){
				self = data[i], l = self.l;//global link
				if(!isEmptyObject(self)){
					switch (type){
						case 'image':thumb = getImage(self,l);break;
						case 'num':thumb = $(['<li class="'+ti+'"><span>'+(i+1)+'</span></li>'].join(""));break;
						case 'content':thumb = getContent(self.s,l,'small');break;
						default : thumb = $(['<li class="'+ ti +'"><span>&nbsp;</span></li>'].join(""));
					}
					thumb.attr('data-index', i);
					thumb.appendTo(inst.$itemList)
				}
			}
		};
		setTunbnail(data,td);
		
		inst.$itemList.appendTo(inst.$navList);
		
		var thumbnail = $t._get(inst,'thumbNum');
		if(typeof thumbnail=='string' && thumbnail=='css'){
			inst.$btnPrev =  inst.$btnNext = '';
		}
		else{
			if($t._get(inst,'tbgAnimate')) inst.$scroll.appendTo(inst.$navList);
			if(total <= thumbnail) inst.$btnPrev =  inst.$btnNext = '';
		}
		if($t._get(inst,'showTips')) inst.$tipsInfo.append($('<div class="'+$t._get(inst,'_message')+'" />'));
		inst.$nav.append(inst.$btnPrev, inst.$navList, inst.$btnNext);
		if ($t._get(inst,'ptype')) inst.$playType = $('<div class="'+$t._get(inst,'_ptype')+'" />')
		inst.$elem.append(inst.$player, inst.$nav, inst.$tipsBg, inst.$tipsInfo,inst.$playType);

		if(thumbnail!='css'){
			var _thumbPos=$t._get(inst,'navPosition');
			var _width, _height, $last, distance, _totalHeight,_totalWidth, _total=inst.total, _space=$t._get(inst,'thumbSpace');
			distance = _space*$t._get(inst,'thumbNum');
			$last = inst.$itemList.find('li.'+$t._get(inst,'_item')+':last');
			if(_thumbPos=='leftRight')	_width = $last.outerWidth(true), _height = distance,_totalHeight = _width, _totalHeight =_total*_space;
			else _width = distance, _height = $last.outerHeight(true),_totalWidth=_total*_space,_totalHeight=_height;
			inst.$navList.css({'width' : _width + 'px', 'height': _height + 'px'});
			if($t._get(inst,'listPosition')=='center'){
				_thumbPos=='leftRight' ? inst.$navList.css({'top':'50%','margin-top':0-parseInt(_height/2)}) : inst.$navList.css({'left':'50%','margin-left':0-parseInt(_width/2)});
			}
			inst.$itemList.css({'width' : _totalWidth + 'px', 'height': _totalHeight + 'px'});
			inst.$navList = null;
		}
		else{
			if($t._get(inst,'addtional')){
				inst.$addtional = $('<div class="'+$t._get(inst,'_addtional')+'" />');
				inst.$nav.append(inst.$addtional.append(inst.$itemList.clone()));
			}
			 
		}
		
		var $list = inst.$itemList.find('li');
		pl? $list.each(function(){
			var $this=$(this);
			var $image = $this.find('img'),_img = $image[0];
			typeof _img !='undefined'? _img.src=$image.attr('data-origital'):'';
		}):'';
		if($t._get(inst,'loop')){
				_thumbPos=='leftRight'?(
					$list.each(function(index){
						$(this).css({'position':'absolute','top' : index*_space+'px'})
					})
				)
				:(
					$list.each(function(index){
						$(this).css({'position':'absolute','left' : index*_space+'px'})
					})
				);			
		}
		var _animate = $t._get(inst,'animate');
		switch (_animate){
			case 'left':{
				inst.$player.find('li').css({'left':pw,'opacity':1});
				break;
			}
			case 'right':{
				inst.$player.find('li').css({'left':0-pw,'opacity':1});
				break;
			}
			case 'top':{
				inst.$player.find('li').css({'top':0-ph,'opacity':1});
				break;
			}
			case 'bottom':{
				inst.$player.find('li').css({'top':ph,'opacity':1});
				break;
			}
		}
	},
	_updeteOptions: function(inst){
		var _thumbNum = this._get(inst,'thumbNum'),
			_total = inst.total,
			_step = this._get(inst,'step');
		_step>=_total ? _step=1 : 
				(_step>=_thumbNum ? _step=_thumbNum: 
							_step=this._get(inst,'step'));
		
		extendRemove(inst.settings,{'step': _step });
		if(typeof _thumbNum=='string' && _thumbNum=='css'){
			extendRemove(inst.settings,{'loop':false,'tbgAnimate':false });
			inst.$btnPrev =  inst.$btnNext = '';
		}
		
		if(this._get(inst,'tbgAnimate')) {
			inst.$scroll = $('<div class="'+this._get(inst,'_scroll')+'" />');
			inst.scrollOver = this._get(inst,'_sover');
		}
		else{
			inst.$scroll = '';inst.scrollOver = this._get(inst,'_tover');
		}
		
		var _selected = this._get(inst,'selected');
		if(_selected>inst.total) inst.selected = 0;
		else inst.selected = _selected-1;
		_selected = inst.selected;
		if(_selected>0){
			var aa = inst.data[_selected];
			for(var i=_selected; i>0; i--){
				inst.data[i]=inst.data[i-1];
			}
			inst.data[0]=aa;
			inst.selected = 0;
		}
	},
	_btnsHover: function(inst){
		var $t=this,$arrows;
		$arrows = inst.$nav.find('.'+$t._get(inst,'_btn'));
		inst.$nav = null;
		var _active = $t._get(inst,'_active');
		var _hover = $t._get(inst,'_hover');
		var _aside = $t._get(inst,'_aside');
		if($arrows) $arrows.addClass(_active);
		if(!$t._get(inst,'loop')){
			if((inst.selected+1) <= $t._get(inst,'thumbNum')) {
				 $arrows.each(function(){
					 var $ts = $(this);
					 $ts.hasClass(_aside)? $ts.addClass(_active): $ts.removeClass(_active);
				})
			}
		}
		$arrows.hover(function(){
				var $ts = $(this);
				if($ts.hasClass(_active)) $ts.addClass(_hover);
			},function(){
				var $ts = $(this);
				if($ts.hasClass(_active)&&$ts.hasClass(_hover)) $ts.removeClass(_hover);
		});
	},
	_initEvents: function(inst){
		var $t = this;
		$t._btnsHover(inst);
		$t._btnsNextClick(inst);
		$t._btnsPrevClick(inst);
		$t._bindItemEvent(inst);
        var auto = $t._get(inst,'autoPlay'),loop = $t._get(inst,'loop');
        inst.$elem.hover(function() {
        	inst.hoverPause = true;
        	!loop? inst.clickSelected = inst.selected : '';
			auto? $t._stop(inst):''
        },
        function() {
        	inst.hoverPause = false;
          	if(auto) $t._start(inst);
        });
        $t._thumbSelected(null,inst);
       	//$t._startAuto(inst);
	},
	_startAuto: function(inst){
		var $t = this;
		inst.timeOutID? clearTimeout(inst.timeOutID):'';
		if(!inst.preLoad){
			inst.timeOutID = null;
			inst.timeOutID = $t._get(inst,'autoPlay')? setTimeout(function(){$t._autoPlay(inst);},$t._get(inst,'autoTime')):null;
		}
	},
	_autoPlay: function(inst){
		var $t = this;
		if(inst.timeOutID&&!inst.preLoad){
			var obj;
			if($t._get(inst,'loop')){
				inst._selected = inst._selected>=(inst.total-1)?0:++inst._selected;
				obj = inst.$itemList.find('li').eq(inst._selected);
				
			}
			else{
				inst.selected = inst.selected>=(inst.total-1)?0:++inst.selected;
				obj = inst.$itemList.find('li').eq(inst.selected)
				
			}
			$t._thumbSelected(obj,inst);
		}
		inst.timeOutID = $t._get(inst,'autoPlay')? setTimeout(function(){$t._autoPlay(inst);},$t._get(inst,'autoTime')):null;
	},
	_stop: function(inst){
		if(inst.timeOutID) clearTimeout(inst.timeOutID);
	},
	_start: function(inst){
		this._startAt(inst);
	},
	_startAt: function(inst){
		var $scroll=inst.$scroll, loop = this._get(inst,'loop'), space = this._get(inst,'thumbSpace'), position = this._get(inst,'navPosition'), 
			seen = this._get(inst,'thumbNum'), thumbSeen = (seen-1)*space, bgAnimate = this._get(inst,'tbgAnimate');
		var $selected = this._indexAt(inst), selectedPos = $selected.position();

		if(loop){
			selectedPos = position=='leftRight'? selectedPos.top : selectedPos.left;
			if (parseInt(selectedPos)>thumbSeen) {
				if(bgAnimate){
					var scrollPos = position=='leftRight'? parseInt($scroll.css('top')):parseInt($scroll.css('left'));
					scrollPos>thumbSeen? position=='leftRight'?$scroll.css('top',0):$scroll.css('left',0):'';
				}
				this._thumbSelected(null,inst);
			}
		}
		else{
			var $list = inst.$itemList, listPos = position=='leftRight'? $list.css('top') : $list.css('left');
			selectedPos = position=='leftRight'? selectedPos.top : selectedPos.left;
			listPos = Math.abs(parseInt(listPos)), selecttedPos = Math.abs(parseInt(selectedPos));
			
			if (selecttedPos<listPos) inst.selected = parseInt(listPos/space);
			else if((listPos+thumbSeen) < selectedPos) {
				inst.selected = parseInt(listPos/space);
				if(bgAnimate){
					var scrollPos = position=='leftRight'? parseInt($scroll.css('top')):parseInt($scroll.css('left'));
					scrollPos>thumbSeen? position=='leftRight'?$scroll.css('top',0):$scroll.css('left',0):'';
				}
			}
			else inst.clickSelected = inst.selected;
			if(inst.clickSelected!=inst.selected) this._thumbSelected(null,inst);
		}
		
		this._startAuto(inst);
	},
	_bindItemEvent: function(inst){
		var $t = this, _css = $t._get(inst,'thumbNum'), _addtional=$t._get(inst,'addtional'), $list= inst.$itemList,events = $t._get(inst,'events')
		$list.delegate('li.',events,function(){
			var $this = $(this),
            	index = $this.attr('data-index');
            if(index!=inst.selected){
            	$t._thumbSelected($this,inst);
            }
		});
		if(_css=='css' && _addtional){
			inst.$addtional.delegate('li',events,function(){
				var $this = $(this), index = $this.attr('data-index');
				if(index!=inst.selected){
					$t._thumbSelected($list.find('li').eq(index),inst);
				}
			})
		}
	},
	_thumbSelected: function(obj,inst){
		var $t = this, 
			speed = $t._get(inst,'tbgSpeed'),
			overClass = inst.scrollOver, 
			position = $t._get(inst,'navPosition'), 
			bgAnimate = $t._get(inst,'tbgAnimate'),
			dataIndex = '',
			td = $t._get(inst,'tType'),
			$list = inst.$itemList,
			loop = $t._get(inst,'loop');
		
		if(!inst.firstPlay) inst.firstPlay = true;
		!obj? (loop? obj = $list.find('li').eq(0): obj = $list.find('li').eq(inst.selected) ): '';
		dataIndex = obj.attr('data-index');
		inst.firstPlay? (inst.selected = -1,inst.firstPlay=false) : '' ;
		inst.selected = inst.clickSelected = dataIndex;
		inst._selected = obj.index();
		if(td=='image'){
			var $img = obj.find('img'), opacity = $t._get(inst,'opacity');
			typeof $img[0]!='undefined'? $img.stop().animate({'opacity':1},'fast'):'';
			obj.siblings().each(function(){
				var $this = $(this), thisImg = $this.find('img');
				typeof(thisImg[0])!='undefined'? thisImg.stop().animate({opacity:opacity},'fast'):'';
			});
		}
		var objPos, listPos, overPos;
		
		position=='leftRight'? (objPos=obj.position().top,listPos= $list.css('top'),overPos= objPos-Math.abs(parseInt(listPos)))
							 : (objPos=obj.position().left,listPos= $list.css('left'),overPos= objPos-Math.abs(parseInt(listPos)));
		
		var space = $t._get(inst,'thumbSpace'), seen = $t._get(inst,'thumbNum'), thumbSeen = space*(seen-1);
		var func = function(tag){
			overPos > thumbSeen? $t._scrollNextByStep(inst): overPos<0? $t._resetSelected(inst):'';
			!tag?$(this).css('z-index',3):'';
		};
		$t._display(inst);
		
		
		if(bgAnimate){
			var space = $t._get(inst,'thumbSpace'), $scroll=inst.$scroll;
			position=='leftRight'? $scroll.css('z-index',5).stop(true,true).animate({top:overPos},speed,func)
			 					 : $scroll.css('z-index',5).stop(true,true).animate({left:overPos},speed,func);
		}
		else{
			func(true);
		}
		obj.addClass(overClass).siblings().removeClass(overClass);
	},
	_resetSelected: function(inst){
		var $t=this, bgAnimate=$t._get(inst,'tbgAnimate'),position=$t._get(inst,'navPosition'),bgSpeed=$t._get(inst,'tbgSpeed'),$scroll=inst.$scroll;
		$t._scrollNext(inst,0,function(){$t._enabledBtnNext(inst);$t._disabledBtnPrev(inst);});
		bgAnimate? (position=='leftRight'? 
						  $scroll.animate({top:0},bgSpeed)
						: $scroll.animate({left:0},bgSpeed)
				   ): '';
	},
	_getTitle: function(title,link,target){
		var _title;
		if (typeof title=='string') return _title = link=='none'? title:('<a href="'+link+'" target="'+target+'">'+title+'<\/a>');
		else if(typeof title=='object'){
			var _link = title.l? title.l:link,
				_target=title.g? title.g:target;
			return _title = _link=='none'? title.t:('<a href="'+_link+'" target="'+_target+'">'+title.t+'<\/a>');
		}
		else return '';
	},
	_setInfo: function(inst){
		var $t = this;
		var tips = $t._get(inst,'showTips');
		if(tips){
			var $tipsBg = inst.$tipsBg, 
				$tipsInfo = inst.$tipsInfo,
				dataIndex = inst.selected,
				thisInfo = inst.data[dataIndex],
				_link = thisInfo.l,
				target=$t._get(inst,'target'), 
				_ptype = $t._get(inst,'_ptype'),
				ptype = $t._get(inst,'ptype');
				
			if(ptype){
				var _type = thisInfo.tp, _class;
				_class = (_type ? (_ptype+' '+_ptype+'-'+_type) : _ptype) ;
				inst.$playType[0].className = _class;
			}
			
			var info = '',
				_h2 = $t._getTitle(thisInfo.t,_link,target),
				_h3 = $t._getTitle(thisInfo.t1,_link,target),
				_hr='';
			_h2= _h2!='' ? '<h2>'+_h2+'<\/h2>':'' ;
			_h3= _h3!='' ? '<h3>'+_h3+'<\/h3>':'' ;
			if(_h2!='' || _h3!='') _hr='<hr class="separator" />';
			info += _h2+_h3+_hr;
			var ot = thisInfo.ot;
			ot= $t._getOtherTitle(ot,_link,target,inst);
			ot= typeof ot !='undefined'? ot:'';
			var msg = thisInfo.m? '<p class="info">'+thisInfo.m+'<\/p>':'';
			info += ot+msg;
			if ($t._get(inst,'tipsBtn')){
				var _btn = $t._get(inst,'_tbtn');
				var _tbtn = $t._getTipsBtn(thisInfo.b_, _link,target, _btn);
				info +=_tbtn;
			}
			$t._tipsAnimate(inst,info);
		}
	},
	_getTipsBtn: function(btn,link,target,cls){
		if (typeof btn=='string') return '<a class="'+cls+' '+cls+'-'+btn+'" href="'+link+'" target="'+target+'"></a>';
		else if (typeof btn=='object'){
			var _link,_target,_class,_txt;
			if(!isEmptyObject(btn)){
				_link = btn.l? btn.l:link,
				_target= btn.t? btn.t:target,
				_class= btn.c? cls+'-'+btn.c:cls,
				_txt = btn.t_? btn.t_:'';
				return '<a class="'+cls+' '+_class+'" href="'+_link+'" target="'+_target+'">'+txt+'</a>';
			}
		}
		else return '<a class="'+cls+'" href="'+link+'" target="'+target+'"></a>';;
		
	},
	_tipsAnimate: function(inst,info){
		var $tipsInfo = inst.$tipsInfo,$tipsBg = inst.$tipsBg, tipsAnimate =this._get(inst,'tipsAnimate');
		
		var _$info = $tipsInfo.find('div').not('.tips-corner');
		switch (tipsAnimate){
			case 'slide':{
				info!=''?(_$info.stop(true,true).slideUp('normal').html('').html(info).stop(true,true).slideDown('normal'),
							$tipsBg.stop(true,true).slideUp('normal').stop(true,true).slideDown())
						:(_$info.stop(true,true).slideUp('normal').html(''),$tipsBg.stop(true,true).slideUp('normal')
				);
				break;
			}
			case 'fade':{
				info!=''?(_$info.stop(true,true).fadeOut('normal').html('').html(info).stop(true,true).fadeIn('normal'),
							$tipsBg.stop(true,true).fadeOut('normal').stop(true,true).fadeIn('normal'))
						:(_$info.stop(true,true).fadeOut('normal').html(''),$tipsBg.stop(true,true).fadeOut('normal'));
				break;
			}
			default:{
				info!=''?(_$info.html('').html(info).show(),$tipsBg.show()):(_$info.hide().html(''),$tipsBg.hide());
			}
		}
		
	},
	_getOtherTitle: function(info,link,target,inst){
		var $t = this, _class = $t._get(inst,'_otitle');
		if (typeof info=='string') return '<p class="'+_class+'">'+info+'<\/p>';
		if (typeof info=='object'){
			var getlist = function(list){
				if(list&& !isArray(list)) return $t._getTitle(list,link,target);
				var _Length = list.length, _list='';
				for(var i=0; i<_Length; i++){
					_list +=$t._getTitle(list[i],link,target);
				}
				return _list;				
			};
			
			if(info&&!isArray(info)) 
				return '<p class="'+_class+'"><label class="name">'+$t._getTitle(info.n,'none')+': <\/label>'+getlist(info.list)+'<\/p>';
			var length = info.length,ot=[],_info;
			for(var i=0;i<length;i++){
				_info = info[i];
				ot.push('<p class="'+_class+'">');
				ot.push('<label class="name">'+$t._getTitle(_info.n,'none')+': <\/label>');
				ot.push(getlist(_info.list))
				ot.push('<\/p>');
			}
			return ot.join("");
		}

	},
	_setCallback: function(inst){
		var _data = inst.data, _selected = inst.selected,_images = inst.images;
		var returnCall = {
			id: inst.id,
			selected:inst.selected,
			total:inst.total,
			curData: _data[_selected]? _data[_selected] : ''//image:_images[_selected]
		}
		inst.callDone = returnCall;
	},
	_display: function(inst,callback){
		var $t = this;
		$t._stop(inst);
		var player = $t._get(inst,'player');
		var callback = $t._get(inst,'callback');
		callback? $t._setCallback(inst):'';
		inst.preLoad = true;
		if(!player){
			callback? callback(inst.callDone):''
			inst.preLoad = false;
			if (!inst.hoverPause) $t._startAuto(inst);
		}
		else{
			var _animate = $t._get(inst,'animate'),$list=inst.$itemList,total = inst.total,
				$player=inst.$player,$images = inst.images;
				getList = function(index){
					return $images[index];
				},
				loadListImg = function(obj){
					var $img = obj.find('img');
					if(typeof $img[0] !='undefined') {
						var curSrc = $img[0].src;
						var origital = $img.attr('data-origital');
						curSrc===$t._blankImg ? $img[0].src=$img.attr('data-origital'):
											(curSrc!=origital ? $img[0].src=origital:'');
					}
					
				},
				dataIndex = inst.selected,
				//var $li;
				inst.$currentli = getList(dataIndex);
			
			loadListImg(inst.$currentli);
			var speed = $t._get(inst,'pSpeed');
			var pwidth = $t._get(inst,'pWidth'), pheight = $t._get(inst,'pHeight');
			var completeIndex = inst.$currentli.index();
			var $currentImg = inst.$currentli.find('img');
			

			var doPlayerAnimate = function(){
				var _$curli = inst.$currentli, _$played = inst.played;
				switch (_animate){
					case 'fade':
						$t._playWithFade(_$curli,speed,total,function(){inst.played = _$curli;});
						break;
					case 'left':
						$t._playLeftRight(_$curli,_$played,'left',pwidth,speed,total,function(){inst.played=_$curli;_$curli.siblings().css('left',pwidth);});
						break;
					case 'right':
						$t._playLeftRight(_$curli,_$played,'right',pwidth,speed,total,function(){inst.played=_$curli;_$curli.siblings().css('left',0-pwidth);});
						break;
					case 'bottom':
						$t._playDwonUp(_$curli,_$played,'bottom',pheight,speed,total,function(){inst.played=_$curli;_$curli.siblings().css('top',pheight);});
						break;
					case 'top':
						$t._playDwonUp(_$curli,_$played,'top',pheight,speed,total,function(){inst.played=_$curli;_$curli.siblings().css('top',0-pheight);});
						break;
					default : _$curli.stop().css('opacity',1).show().siblings().css('opacity',0).hide();
				}
				if (!inst.hoverPause) $t._startAuto(inst);
				$t._setInfo(inst);
			};
			$list.each(function(){
				$(this).find('img').unbind();
			});
			
			if(inst.completeImg[completeIndex]){
				inst.preLoad = false;
				doPlayerAnimate();
				callback? callback(inst.callDone):'';
			}
			else{
				var _$played = inst.played;
				if(_$played) _$played.css('opacity','0.3');
				$currentImg.load(function(){
					inst.preLoad = false;
					doPlayerAnimate();
					callback? callback(inst.callDone):'';
				});
				inst.completeImg.push($(this));
			}

		}
	},
	_playLeftRight:function(obj,played,where,pwidth,speed,total,fun){
		var _left=0,__left=0;
		where=='left'? (_left=pwidth,__left=0-pwidth):(_left=0-pwidth,__left=pwidth);
		var func = fun||function(){};
		if(played) played.stop(true,true).animate({left:__left},speed,function(){$(this).css('left',_left)});
		obj.siblings().each(function(index){$(this).css({'z-index':total-index,'opacity':1});});
		obj.css('z-index',total+1).stop(true,true).animate({left:0},speed,func);
	},
	_playDwonUp:function(obj,played,where,pheight,speed,total,fun){
		var _top=0,__top=0;
		where=='top'? (_top=0-pheight,__top=pheight):(_top=pheight,__top=0-pheight);
		var func = fun||function(){};
		if(played) played.stop(true,true).animate({top:__top},speed,function(){$(this).css('top',_top);});
		obj.siblings().each(function(index){
			$(this).css({'z-index':total-index,'opacity':1});
		});
		obj.css('z-index',total+1).stop(true,true).animate({top:0},speed,func)
	},
	_playWithFade: function(obj,speed,total,fun){
		var func = fun || function(){};
		obj.siblings().each(function(index){$(this).css({'z-index':total-index});});
		obj.siblings().stop().animate({'opacity':0},speed);
		obj.css('z-index',total+1).stop().animate({'opacity':1},speed,func);
	},
	_indexAt: function(inst){
		var selected = inst.selected;
        var $list = inst.$itemList.find("li"),
        	i, j, $find = null, $selected;
        for (i = 0, j = $list.length; i < j; i++) {
            $selected = $($list[i]);
            if ($selected.attr('data-index') === selected) {
                $find = $selected;
                break;
            }
        }
        return $find;
	},
	_btnsPrevClick: function(inst){
		if(!inst.$btnPrev||inst.$btnPrev=='') return;
		var $t = this;
		var space = $t._get(inst,'thumbSpace'),
			step = $t._get(inst,'step'),
			total = inst.total,
			speed = $t._get(inst,'scrollSpeed'),
			position = $t._get(inst,'navPosition'),
			bgAnimate = $t._get(inst,'tbgAnimate'),
			loop = $t._get(inst,'loop'),
			$selected,$scroll,
			$list = inst.$itemList;
		inst.$btnPrev.bind('click',function(){
			if(loop){
				if ( inst.btnClick){
					inst.btnClick = false;
					if(position=='leftRight'){
						if(bgAnimate){
							$scroll = inst.$scroll;
							$selected = $t._indexAt(inst);
							scrollPos = parseInt($scroll.css('top'));
							scrollPos >= (total-step)*space ? $scroll.css({top:$selected.css('top')}):'';
						}
						$list.find('li:gt('+(total-step-1)+')').insertBefore($list.find('li:first')).each(
							function(index){
			                	var $ts = $(this),thisPos = parseInt($ts.css('top'));
			                    $ts.css({top: thisPos - total * space})
			            	}
						);
						$list.find('li').each(function(index){
							var $ts = $(this);
							$ts.stop(true,true)
							   .animate({top:parseInt($ts.css('top'))+step*space},
							   			speed,
										function(){
											if(index === total - step) inst.btnClick = true;
								});
						});
						if(bgAnimate){
							var tbgSpeed = $t._get(inst,'tbgSpeed')
							$scroll.stop(true,true)
								   .animate({top: parseInt($selected.css('top')) + (space*step)},
								   			tbgSpeed,
	                    					function(){ 
	                    						if(parseInt($scroll.css('top'))=== (total-1)*space)
	                    							$scroll.css({top:(space*step)-parseInt($selected.css("top"))});
	                    					});
						}
						
					}
					else{
						if(bgAnimate){
							$scroll = inst.$scroll;
							$selected = $t._indexAt(inst);
							scrollPos = parseInt($scroll.css('left'));
							scrollPos >= (total-step)*space ? $scroll.css({left:$selected.css('left')}):'';
						}
						$list.find('li:gt('+(total-step-1)+')').insertBefore($list.find('li:first')).each(
							function(index){
			                	var $ts = $(this),thisPos = parseInt($ts.css('left'));
			                    $ts.css({left: thisPos - total * space})
			            	}
						);
						$list.find('li').each(function(index){
							var $ts = $(this);
							$ts.stop(true,true)
							   .animate({left:parseInt($ts.css('left'))+step*space},
							   			speed,
										function(){
											if(index === total - step) inst.btnClick = true;
								});
						});
						if(bgAnimate){
							var tbgSpeed = $t._get(inst,'tbgSpeed')
							$scroll.stop(true,true)
								   .animate({left: parseInt($selected.css('left')) + (space*step)},
								   			tbgSpeed,
	                    					function(){ 
	                    						if(parseInt($scroll.css('left'))=== (total-1)*space)
	                    							$scroll.css({left:(space*step)-parseInt($selected.css('left'))});
	                    					});
						}
					}
				}
			}
			else{//!loop
				if ( inst.btnClick){
					$t._scrollPrevByStep(inst)
				}
			}
		});
	},
	_btnsNextClick: function(inst){
		if(!inst.$btnNext||inst.$btnNext=='') return;
		var $t = this;
		inst.$btnNext.bind('click',function(){
			if (inst.btnClick) $t._scrollNextByStep(inst,true);
		});
	},
	_scrollPrevByStep: function(inst){
		var $t = this,
			total=inst.total,
			seen=$t._get(inst,'thumbNum'),
			space = $t._get(inst,'thumbSpace'),
			step = $t._get(inst,'step'),
			$list = inst.$itemList,
			position = $t._get(inst,'navPosition'),
			loop = $t._get(inst,'loop'),
			bgAnimate = $t._get(inst,'tbgAnimate');
		if(!loop){
			$t._enabledBtnNext(inst);
			var listPos = position=='leftRight'? parseInt($list.css('top')): parseInt($list.css('left')),
				stepPos = space*step;
				if(listPos===0) return;
				inst.btnClick = false;
				var over=0, listScroll = position=='leftRight'? parseInt($list.css('top')) + space*step : parseInt($list.css('left')) + space*step;
				//console.log(listScroll);
				listScroll>0? (over=listScroll,listScroll = 0 ): '';
			$t._scrollPrev( inst,
						listScroll,
						function(){
							position=='leftRight'? (Math.abs(parseInt($list.css('top')))===0? $t._disabledBtnPrev(inst):'')
												 : (Math.abs(parseInt($list.css('left')))===0? $t._disabledBtnPrev(inst):'');
							inst.btnClick = true;
						}
		        	 );
			if(bgAnimate){
				var $scroll=inst.$scroll, bgSpeed=$t._get(inst,'tbgSpeed'),
					bgPos = position=='leftRight'? parseInt($scroll.css('top'))+stepPos : parseInt($scroll.css('left'))+stepPos;
				position=='leftRight'? $scroll.animate({top:bgPos-over},bgSpeed): $scroll.animate({left:bgPos-over},bgSpeed);
			}
		}
	},
	_scrollNextByStep: function(inst,btnClick){
		var $t = this,
			total=inst.total,
			seen=$t._get(inst,'thumbNum'),
			space = $t._get(inst,'thumbSpace'),
			step = $t._get(inst,'step'),
			$list = inst.$itemList,
			position = $t._get(inst,'navPosition'),
			loop = $t._get(inst,'loop'),
			bgAnimate = $t._get(inst,'tbgAnimate'),
			$scroll = inst.$scroll,
			bgSpeed=$t._get(inst,'tbgSpeed'),
			speed = $t._get(inst,'scrollSpeed');
		if(!loop){
			$t._enabledBtnPrev(inst);
			var listPos = position=='leftRight'? parseInt($list.css('top')): parseInt($list.css('left')),
				overPos = (total-seen)*space, stepPos = space*step, listScroll;
			if(Math.abs(listPos)===overPos) return;
			inst.btnClick = false;
			listScroll =listPos - stepPos,over = 0;
			Math.abs(listScroll)>overPos? (over=Math.abs(listScroll)-overPos,listScroll=0-overPos): '';
			$t._scrollNext( inst,
							listScroll,
							function(){
								position=='leftRight'? (Math.abs(parseInt($list.css('top')))===(total - seen) * space? $t._disabledBtnNext(inst):'')
													 : (Math.abs(parseInt($list.css('left')))===(total - seen) * space? $t._disabledBtnNext(inst):'');
								inst.btnClick = true;
							}
			        	 );
			if(bgAnimate){
				var bgPos = position=='leftRight'? parseInt($scroll.css('top'))-stepPos : parseInt($scroll.css('left'))-stepPos;
				position=='leftRight'? $scroll.animate({top:bgPos+over},bgSpeed): $scroll.animate({left:bgPos+over},bgSpeed);
			} 
		}
		else{//loop
			inst.btnClick = false;
			if(position=='leftRight'){
				$list.find('li').each(function(index){
					$(this).stop()
						   .animate({top: space * (index - step)},speed,
			               		function(){
			    	       			if(index === total - step){
			               				$list.find('li:lt('+(step)+')').insertAfter($list.find('li:last')).each(
			               					function(index){
			               						var $this = $(this), thisPos = parseInt($this.css('top'));
			               						$this.css({top: total * space + thisPos})
			               				});
			               				if(!btnClick){
			               					var _$selected = $t._indexAt(inst);
		          							inst._selected = _$selected.index();
		          						}
			               			}
			                });
		        });

				if(bgAnimate&&btnClick){
					var $selected  = $t._indexAt(inst);
					$scroll.stop(true,true)
						   .animate({top: parseInt($selected.css('top')) - (space*step)},
	                				bgSpeed,
	                				function(){
	                					var _top = parseInt($scroll.css('top'))
	                    				if(_top<0) $scroll.css({top:$selected.css('top')})
	                    	})
				}

		    	if(bgAnimate&&!btnClick){
		    		$scroll.stop().animate({top:(seen-step)*space},bgSpeed)
		    	} 
			}
			else{
				$list.find('li').each(function(index){
					$(this).stop()
						   .animate({left: space * (index - step)},speed,
			               		function(){
			    	       			if(index === total - step){
			    	       				inst.btnClick = true;
			               				$list.find('li:lt('+(step)+')').insertAfter($list.find('li:last')).each(
			               					function(index){
			               						var $this = $(this), thisPos = parseInt($this.css('left'));
			               						$this.css({left: total * space + thisPos})
			               				});
			               				
			               				if(!btnClick){
			               					var _$selected = $t._indexAt(inst);
		          							inst._selected = _$selected.index();
			               				}			
			               			}
	                        });
		        });
			
				if(bgAnimate&&btnClick){
					var $selected  = $t._indexAt(inst);
					$scroll.stop(true,true)
						   .animate({left: parseInt($selected.css('left')) - (space*step)},
	                				bgSpeed,
	                    			function(){
	                    				var _left = parseInt($scroll.css('left'))
	                    				if(_left<0) $scroll.css({left:$selected.css('left')})
	                    			});
				}
		    	if(bgAnimate&&!btnClick){
		    		var $scroll = inst.$scroll;
		    		$scroll.stop().animate({left:(seen-step)*space},bgSpeed)
		    	} 
			}
		}
	},
	_scrollPrev: function(inst,distance,fun) {
		var $list = inst.$itemList,
            loop = this._get(inst,'loop'),
            speed= this._get(inst,'scrollSpeed');
           	position = this._get(inst,'navPosition'),
            func = fun || function() {};
            if(!loop){
            	position=='leftRight'? $list.animate({top: distance},speed, func):$list.animate({left: distance},speed, func)
            }
    },
	_scrollNext: function(inst,distance,fun) {
		var $list = inst.$itemList,
            loop = this._get(inst,'loop'),
            speed= this._get(inst,'scrollSpeed');
           	position = this._get(inst,'navPosition'),
            func = fun || function() {};
            if(!loop){
            	position=='leftRight'? $list.animate({top: distance},speed, func):$list.animate({left: distance},speed, func)
            }
    },
   	_enabledBtnPrev: function(inst){
		var _active = this._get(inst,'_active');
		if(!inst.$btnPrev.hasClass(_active)) inst.$btnPrev.addClass(_active);
	},
	_enabledBtnNext: function(inst){
		var _active = this._get(inst,'_active');
		if(!inst.$btnNext.hasClass(_active)) inst.$btnNext.addClass(_active);
	},
	_disabledBtnPrev: function(inst){
		var _active = this._get(inst,'_active');
		var _hover = this._get(inst,'_hover');
		var _prev = inst.$btnPrev;
		if(_prev.hasClass(_active)){
			_prev.removeClass(_active);
			if(_prev.hasClass(_hover)) _prev.removeClass(_hover);
		} 
	},
	_disabledBtnNext: function(inst){
		var _active = this._get(inst,'_active');
		var _hover = this._get(inst,'_hover');
		var _next = inst.$btnNext;
		if(_next.hasClass(_active)){
			_next.removeClass(_active);
			if(_next.hasClass(_hover)) _next.removeClass(_hover);
		} 
	},
	/* Create a new instance object. */
	_newInst: function(elem) {
		var id = elem[0].id.replace(/([^A-Za-z0-9_-])/g, '\\\\$1'); // escape jQuery meta chars
		return {id: id, 
			$elem: elem,
			$nav: '', $btnPrev: '',	$btnNext: '',	$scroll: '', $navList: '', $itemList: '',	$player: '', hoverPause:false,preLoad:true,
			selected:0,_selected:0,timeOutID:null,$currentli:null,clickSelected:0, $tipsBg: '', $tipsInfo: '', $deepNav: '', completeImg:[],
			scrollOver: null, data:null, images:[], total:0,btnClick:true,callDone:null,played:null,$tipsType:null,firstPlay:null,$playType:''
		};
	},

	_get: function(inst, name) {
		return inst.settings[name] !== undefined ?
			inst.settings[name] : this._defaults[name];
	},

	_getInst: function(target) {
		try {
			return $.data(target, PROP_NAME);
		}
		catch (err) {
			throw 'Missing instance data for this imageShown';
		}
	},
	_optionImageShown: function(target, name, value) {
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
			extendRemove(inst.settings, settings);
			this._updateImageShown(inst);
		}
		inst = null;
	}
});

function isEmptyObject(obj){
	for(var name in obj)
		return false;
	return true;
};
function extendRemove(target, props) {
	$.extend(target, props);
	for (var name in props)
		if (props[name] == null || props[name] == undefined)
			target[name] = props[name];
	return target;
};
function isArray(a) {
	return (a && (($.browser.safari && typeof a == 'object' && a.length) ||
		(a.constructor && a.constructor.toString().match(/\Array\(\)/))));
};
$.fn.imageShown = function(options){
	if ( !this.length ) return this;
	if (!$.imageShown.initialized) $.imageShown.initialized = true;

	var otherArgs = Array.prototype.slice.call(arguments, 1);
	if (options == 'option' && arguments.length == 2 && typeof arguments[1] == 'string')
		return $.imageShown['_' + options + 'ImageShown'].
			apply($.imageShown, [this[0]].concat(otherArgs));
	return this.each(function() {
		typeof options == 'string' ?
			$.imageShown['_' + options + 'ImageShown'].
				apply($.imageShown, [this].concat(otherArgs)) :
			$.imageShown._instImageShown(this, options);
	});
};

$.imageShown = new ImageShown();
$.imageShown.initialized = false;
$.imageShown.uuid = new Date().getTime();
$.imageShown.version = "@VERSION";

})(jQuery);