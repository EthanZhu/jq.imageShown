/******************************************
 * gomesoft.com
 *
 * @author          Ethan.zhu（zhuyidong）
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
		_addtional:'img-thumb-addtional',
		_missing: 'img-load-missing'
	};
	this._defaults = {
		id:	null,
		navSpace: 47, 
		pWidth: 0 , 
		pHeight:0 , 
		navNum: 4, 
		navPlace: null, 
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
		preload: true, 
		target: '_blank', 
		pSpeed:500, 
		pType: false,
		tContent:'image',//num,none,image,content
		listPlace:null,
		tipsBtn:false, 
		loadClass: 'img-player-loading',
		pContent:'image',
		missing:'内容加载错误'
	};
	
	$.extend(this._defaults, this.classes['']);
}
$.extend(ImageShown.prototype, {
	marker: 'hasImageShown',
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
		
		if ($elem.hasClass(this.marker)) return;
		$elem.addClass(this.marker);
		$.data(elem, PROP_NAME, inst);
		this._updateImageShown(inst);
	
	},
	
	_updateImageShown: function(inst){
		//console.log('_updateImageShown');
		var $t = this;
		inst.firstPlay = false;
		if($t._g(inst,'player')){
			inst.$player = $('<div class="'+$t._g(inst,'_player')+'" />');
			if($t._g(inst,'preload')){
				var _loading = $t._g(inst,'loadClass');
				if(!inst.$player.hasClass(_loading)) inst.$player.addClass(_loading);
			}
			else if(inst.$player.hasClass(_loading)) inst.$player.removeClass(_loading);
			$('<ul class="'+ $t._g(inst,'_plist') +'" />').appendTo(inst.$player);
		} 
		else{
			inst.$player = '';
		}
		//console.log(this._g(inst,'_thumbnail'));
		inst.$nav = $('<div class="'+$t._g(inst,'_thumb')+'" />');
		inst.$btnPrev = $('<div class="'+$t._g(inst,'_btn')+'"><span class="'+$t._g(inst,'_btnPrev')+'" />');
		inst.$btnNext = $('<div class="'+$t._g(inst,'_btn')+' '+$t._g(inst,'_aside')+'"><span class="'+$t._g(inst,'_btnNext')+'" />');
		inst.$navList = $('<div class="'+$t._g(inst,'_tlist')+'" />');
		inst.$itemList = $('<ul class="'+$t._g(inst,'_items')+'" />');
		
		if($t._g(inst,'showTips')){
			inst.$tipsBg = $('<div class="'+$t._g(inst,'_tbackground')+'" />');
			inst.$tipsInfo = $('<div class="'+$t._g(inst,'_tinfo')+'">');
		}
		else{
			inst.$tipsBg = '';inst.$tipsInfo = '';
		}
		var thisData = $t._g(inst,'data');
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
			$t._updeteOptions(inst);
			$t._instHtml(inst);
			$t._initEvents(inst);
		}

	},
	_instHtml:function(a){
		var $t=this, 
		//b = $t._g(a,'build'), 
		d =a.data;
		//b=='setter'?'':'';//waiting for to do something
		a.$elem.html('');
		var i, 
			b, //bigs 
			n, //nav 
			l, //link
			b_, //big 
			s, // small
			f, //self 
			t = $t._g(a,'target'), 
			t_ = a.total, 
			h = $t._g(a,'pHeight'), 
			y = $t._g(a,'tContent'), 
			w = $t._g(a,'pWidth'), 
			m = $t._g(a,'_item'), 
			p = $t._g(a,'_pitem'),
			load = $t._g(a,'preload'), 
			p_ = $t._g(a,'player');
		a.images=[];
		var GP = function(A,B,C,W,H){
				var a, b, c, d, w_, h_, f;
				w_ = W||'', h_=H||'';
				if(typeof A=='string'){
					b=A, a=B, c=C, d='';
				}
				else{
					f= isArray(A)? A[0]: A;
					!$.isEmptyObject(f)? (
						a = f.l ? f.l : B,
						b = f.p ? f.p : '',
						c = f.t ? f.t : C,
						d = f.a ? f.a : '',
						w_ = f.w ? f.w : w_,
						h_ = f.h ? f.h : h_
					):'';
				}
				if(b) return {l:a, p: b, t: c, a: d, h:h_, w:w_};
				else return 'nothing';
			},
			GI = function(A,L,W,C,I){
				var i_, g_, $i, c;
				W=='play'? (i_=GP(A.b,L,t,w,h) , c=p)
							: (i_=GP(A.s,L,t), c=m);
				i_!='nothing'?(
					i_.w&&i_.h&&i_.w!=''&&i_.h!='' ? (g_ = load ? ('<img data-origital="'+i_.p+'" width="'+i_.w+'" height="'+i_.h+'" src="'+$t._blankImg+'" alt="'+ i_.a +'" />') : ('<img width="'+i_.w+'" height="'+i_.h+'" src="'+i_.p+'" alt="'+ i_.a +'" />') )
												   : (g_ = load ? ('<img data-origital="'+i_.p+'" src="'+$t._blankImg+'" alt="'+ i_.a +'" />') : ('<img src="'+i_.p+'" alt="'+ i_.a +'" />')),
					$i = $(['<li class="'+ c +'"><a href="'+ i_.l +'" target="'+ i_.t +'">'+g_+'</a></li>'].join(""))
				):(
					$i = $(['<li class="'+ c +'">Need image here.</li>'].join(""))
				);
				C ? $i.css({'z-index': t_- I, opacity: 0}):'';
				if(!load) $(g_).load(function(){$i.attr('data-missing','false')}).error(function(){$i.attr('data-missing','true');$i.html('<p class="'+$t._g(a,'_missing')+'">'+$t._g(a,'missing')+'</p>');});
				return $i;
			},
			GC = function(C, L, W){
				var $C, $H, c =	W =='nav'? m : p;
				if (typeof C=='string'){
					$C = $('<div>'+C+'</div>');
					$H = $C.find('a');
					$C = $H.size()>0? ($H.attr('target',t),$(['<li class="'+ c +'">'+$C.html()+'</li>'].join("")))
									: $(['<li class="'+ c +'"><a href="'+L+'" target="'+t+'">'+C+'</a></li>'].join(""));
				} 
				else if(typeof C=='object'){
					if(!isEmptyObject(C)){
						var l_= C.l? C.l:l, g_= C.t? C.t:t, c_= C.p;
						$C = $('<div>'+c_+'</div>');
						$H = $C.find('a');
						$C = $H.size()>0? ($H.attr('target',g_),$(['<li class="'+ c +'">'+$C.html()+'</li>'].join("")))
										: $(['<li class="'+ c +'"><a href="'+ l_ +'" target="'+ g_ +'">'+ c_ +'</a></li>'].join(""));
					}
				}
				return $C;
				$C = $H = null;
			},
			ST = function(D,T){
				for(i=0; i<t_; i++){
					f = D[i], l = f.l;//global link
					if(!isEmptyObject(f)){
						switch (T){
							case 'image':n = GI(f,l);break;
							case 'num':n = $(['<li class="'+m+'"><span>'+(i+1)+'</span></li>'].join(""));break;
							case 'content':n = GC(f.s,l,'nav');break;
							default : n = $(['<li class="'+ m +'"><span>&nbsp;</span></li>'].join(""));
						}
						n.attr('data-index', i);
						n.appendTo(a.$itemList)
					}
				}
			};
		if(p_){
			var c = $t._g(a,'pContent');
			for(i=0; i<t_; i++){
				f = d[i], l = f.l;
				if(!isEmptyObject(f)){
					b = c=='content'? GC(f.b,l): GI(f,l,'play',true,i);
					a.images.push(b);
					!load ? a.completeImg.push(b):'';
					a.$player.find('ul').append(b);
				}
			}
		}
		
		ST(d,y);
		a.$itemList.appendTo(a.$navList);
		
		var q = $t._g(a,'navNum');
		if(typeof q=='string' && q=='css'){
			a.$btnPrev =  a.$btnNext = '';
		}
		else{
			if($t._g(a,'tbgAnimate')) a.$scroll.appendTo(a.$navList);
			if(t_ <= q) a.$btnPrev =  a.$btnNext = '';
		}
		if($t._g(a,'showTips')) a.$tipsInfo.append($('<div class="'+$t._g(a,'_message')+'" />'));
		a.$nav.append(a.$btnPrev, a.$navList, a.$btnNext);
		if ($t._g(a,'ptype')) a.$playType = $('<div class="'+$t._g(a,'_ptype')+'" />')
		a.$elem.append(a.$player, a.$nav, a.$tipsBg, a.$tipsInfo,a.$playType);

		var np=$t._g(a,'navPlace'),wi, hi, $last, di, th, tw, s_=$t._g(a,'navSpace'),di = s_*$t._g(a,'navNum');
		if(q!='css'){
			$first = a.$itemList.find('li:first');
			if(np=='lr'){
				wi = $first.outerWidth(true), hi = di,tw = wi, th =t_*s_;
			}
			else {
				wi = di, hi = $first.outerHeight(true),tw=t_*s_,th=hi;
			}
			a.$navList.css({'width' : wi + 'px', 'height': hi + 'px'});
			if($t._g(a,'listPlace')=='center'){
				np=='lr' ? a.$navList.css({'top':'50%','margin-top':0-parseInt(hi/2)}) : a.$navList.css({'left':'50%','margin-left':0-parseInt(wi/2)});
			}
			a.$itemList.css({'width' : tw + 'px', 'height': th + 'px'});
			a.$navList = null;
		}
		else{
			if($t._g(a,'addtional')){
				a.$addtional = $('<div class="'+$t._g(a,'_addtional')+'" />');
				a.$itemList.find('li').each(function(){
					var $ts = $(this);
					$ts.height($ts.find('img').height());
					$ts.width($ts.find('img').width());
				});
				a.$nav.append(a.$addtional.append(a.$itemList.clone()));
			} 
		}
		
		var $list = a.$itemList.find('li');
		load ? $list.each(function(){
			var $image = $(this).find('img'), img = $image[0];
			typeof img !='undefined'? img.src=$image.attr('data-origital'):'';
		}):'';
		$t._g(a,'loop')?(	np=='lr'?($list.each(function(x){$(this).css({'position':'absolute','top' : x*s_+'px'})}))
								:($list.each(function(x){$(this).css({'position':'absolute','left' : x*s_+'px'})}))
						):''
		if(p_){
			var an = $t._g(a,'animate'),$p = a.$player.find('li');
			switch (an){
				case 'left':$p.css({'left':w,'opacity':1});break;
				case 'right':$p.css({'left':0-w,'opacity':1});break;
				case 'top':$p.css({'top':0-h,'opacity':1});break;
				case 'bottom':$p.css({'top':h,'opacity':1});break;
			}
		}

	},
	_updeteOptions: function(inst){
		var $t = this ,
			_navNum = $t._g(inst,'navNum'),
			_total = inst.total,
			_step = $t._g(inst,'step');
		_step = _step>=_total ? 1 : (_step>=_navNum ? parseInst(_navNum/2) : $t._g(inst,'step'));
		
		extendRemove(inst.settings,{'step': _step });
		if(typeof _navNum=='string' && _navNum=='css'){
			extendRemove(inst.settings,{'loop':false,'tbgAnimate':false });
			inst.$btnPrev =  inst.$btnNext = '';
		}
		
		if($t._g(inst,'tbgAnimate')) {
			inst.$scroll = $('<div class="'+$t._g(inst,'_scroll')+'" />');
			inst.scrollOver = $t._g(inst,'_sover');
		}
		else{
			inst.$scroll = '';inst.scrollOver = $t._g(inst,'_tover');
		}
		
		var _selected = $t._g(inst,'selected');
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
	
	_initEvents: function(inst){
		var $t = this;
		var bindItemEvent = function(){
			var tag = $t._g(inst,'navNum'), addtional =$t._g(inst,'addtional'), $list= inst.$itemList, $items = $list.find('li'), ev = $t._g(inst,'events');
			if(tag=='css' && addtional) $list = inst.$addtional.find('ul');
			$list.delegate('li.',ev,function(e){
				var $this = $(this), index = $this.attr('data-index');
	            if (ev=='click') e.preventDefault();
	            if(index!=inst.selected){
	            	!addtional?$t._thumbSelected($this,inst):$t._thumbSelected($items.eq(index),inst)
	            }
			});
		},
		btnsHover= function(){
			var $arrows = inst.$nav.find('.'+$t._g(inst,'_btn'));
			inst.$nav = null;
			var _active = $t._g(inst,'_active');
			var _hover = $t._g(inst,'_hover');
			var _aside = $t._g(inst,'_aside');
			if($arrows) $arrows.addClass(_active);
			if(!$t._g(inst,'loop')){
				if((inst.selected+1) <= $t._g(inst,'navNum'))
					$arrows.each(function(){ var $ts = $(this); $ts.hasClass(_aside)? $ts.addClass(_active): $ts.removeClass(_active);});
			}
			$arrows.hover(function(){
					var $ts = $(this); if($ts.hasClass(_active)) $ts.addClass(_hover);
				},function(){
					var $ts = $(this); if($ts.hasClass(_active)&&$ts.hasClass(_hover)) $ts.removeClass(_hover);
			});
		};
		btnsHover();
		$t._btnsNextClick(inst);
		$t._btnsPrevClick(inst);
		bindItemEvent();
        var auto = $t._g(inst,'autoPlay'),loop = $t._g(inst,'loop');
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
			inst.timeOutID = $t._g(inst,'autoPlay')? setTimeout(function(){$t._autoPlay(inst);},$t._g(inst,'autoTime')):null;
		}
	},
	_autoPlay: function(inst){
		var $t = this;
		if(inst.timeOutID&&!inst.preLoad){
			var obj;
			if($t._g(inst,'loop')){
				inst._selected = inst._selected>=(inst.total-1)?0:++inst._selected;
				obj = inst.$itemList.find('li').eq(inst._selected);
				
			}
			else{
				inst.selected = inst.selected>=(inst.total-1)?0:++inst.selected;
				obj = inst.$itemList.find('li').eq(inst.selected)
				
			}
			$t._thumbSelected(obj,inst);
		}
		inst.timeOutID = $t._g(inst,'autoPlay')? setTimeout(function(){$t._autoPlay(inst);},$t._g(inst,'autoTime')):null;
	},
	_stop: function(inst){
		if(inst.timeOutID) clearTimeout(inst.timeOutID);
	},
	_start: function(inst){
		this._startAt(inst);
	},
	_startAt: function(inst){
		var $scroll=inst.$scroll, loop = this._g(inst,'loop'), space = this._g(inst,'navSpace'), position = this._g(inst,'navPlace'), 
			seen = this._g(inst,'navNum'), thumbSeen = (seen-1)*space, bgAnimate = this._g(inst,'tbgAnimate');
		var $selected = this._indexAt(inst), selectedPos = $selected.position();

		if(loop){
			selectedPos = position=='lr'? selectedPos.top : selectedPos.left;
			if (parseInt(selectedPos)>thumbSeen) {
				if(bgAnimate){
					var scrollPos = position=='lr'? parseInt($scroll.css('top')):parseInt($scroll.css('left'));
					scrollPos>thumbSeen? position=='lr'?$scroll.css('top',0):$scroll.css('left',0):'';
				}
				this._thumbSelected(null,inst);
			}
		}
		else{
			var $list = inst.$itemList, listPos = position=='lr'? $list.css('top') : $list.css('left');
			selectedPos = position=='lr'? selectedPos.top : selectedPos.left;
			listPos = Math.abs(parseInt(listPos)), selecttedPos = Math.abs(parseInt(selectedPos));
			
			if (selecttedPos<listPos) inst.selected = parseInt(listPos/space);
			else if((listPos+thumbSeen) < selectedPos) {
				inst.selected = parseInt(listPos/space);
				if(bgAnimate){
					var scrollPos = position=='lr'? parseInt($scroll.css('top')):parseInt($scroll.css('left'));
					scrollPos>thumbSeen? position=='lr'?$scroll.css('top',0):$scroll.css('left',0):'';
				}
			}
			else inst.clickSelected = inst.selected;
			if(inst.clickSelected!=inst.selected) this._thumbSelected(null,inst);
		}
		
		this._startAuto(inst);
	},

	_thumbSelected: function(obj,inst){
		var $t = this, 
			speed = $t._g(inst,'tbgSpeed'),
			overClass = inst.scrollOver, 
			position = $t._g(inst,'navPlace'), 
			bgAnimate = $t._g(inst,'tbgAnimate'),
			dataIndex = '',
			tc = $t._g(inst,'tContent'),
			$list = inst.$itemList,
			loop = $t._g(inst,'loop');
		
		if(!inst.firstPlay) inst.firstPlay = true;
		!obj? (loop? obj = $list.find('li').eq(0): obj = $list.find('li').eq(inst.selected) ): '';
		dataIndex = obj.attr('data-index');
		inst.firstPlay? (inst.selected = -1,inst.firstPlay=false) : '' ;
		inst.selected = inst.clickSelected = dataIndex;
		inst._selected = obj.index();
		if(tc=='image'){
			var $img = obj.find('img'), opacity = $t._g(inst,'opacity');
			typeof $img[0]!='undefined'? $img.stop().animate({'opacity':1},'fast'):'';
			obj.siblings().each(function(){
				var $this = $(this), thisImg = $this.find('img');
				typeof(thisImg[0])!='undefined'? thisImg.stop().animate({opacity:opacity},'fast'):'';
			});
		}
		var objPos, listPos, overPos;
		
		position=='lr'? (objPos=obj.position().top,listPos= $list.css('top'),overPos= objPos-Math.abs(parseInt(listPos)))
							 : (objPos=obj.position().left,listPos= $list.css('left'),overPos= objPos-Math.abs(parseInt(listPos)));
		
		var space = $t._g(inst,'navSpace'), seen = $t._g(inst,'navNum'), thumbSeen = space*(seen-1);
		var func = function(tag){
			overPos > thumbSeen? $t._scrollNextByStep(inst): overPos<0? $t._resetSelected(inst):'';
			!tag?$(this).css('z-index',3):'';
		};
		$t._display(inst);
		
		
		if(bgAnimate){
			var space = $t._g(inst,'navSpace'), $scroll=inst.$scroll;
			position=='lr'? $scroll.css('z-index',5).stop(true,true).animate({top:overPos},speed,func)
			 					 : $scroll.css('z-index',5).stop(true,true).animate({left:overPos},speed,func);
		}
		else{
			func(true);
		}
		obj.addClass(overClass).siblings().removeClass(overClass);
	},
	_resetSelected: function(inst){
		var $t=this, bgAnimate=$t._g(inst,'tbgAnimate'),position=$t._g(inst,'navPlace'),bgSpeed=$t._g(inst,'tbgSpeed'),$scroll=inst.$scroll;
		$t._scrollNext(inst,0,function(){$t._enabledBtnNext(inst);$t._disabledBtnPrev(inst);});
		bgAnimate? (position=='lr'? 
						  $scroll.animate({top:0},bgSpeed)
						: $scroll.animate({left:0},bgSpeed)
				   ): '';
	},
	
	_setInfo: function(inst){
		var $t = this;
		var tips = $t._g(inst,'showTips');
		if(tips){
			var $tipsBg = inst.$tipsBg, 
				$tipsInfo = inst.$tipsInfo,
				dataIndex = inst.selected,
				thisInfo = inst.data[dataIndex],
				_link = thisInfo.l,
				target=$t._g(inst,'target'), 
				_ptype = $t._g(inst,'_ptype'),
				ptype = $t._g(inst,'ptype');
				
			if(ptype){
				var _type = thisInfo.tp, _class;
				_class = (_type ? (_ptype+' '+_ptype+'-'+_type) : _ptype) ;
				inst.$playType[0].className = _class;
			}
			var GT= function(T,L,G){
					var T_;
					if (typeof T=='string') return T_ = L=='none'? T:('<a href="'+L+'" target="'+G+'">'+T+'<\/a>');
					else if(typeof T=='object'){
						var L_ = T.l? T.l:L, G_=T.g? T.g:G;
						return T_ = L_=='none'? T.t:('<a href="'+L_+'" target="'+G_+'">'+T.t+'<\/a>');
					}
					else return '';
				},
				GL = function(E,L,T){
					if(E&& !isArray(E)) return GT(E,L,T);
						var l_ = E.length, e_='';
						for(var i=0; i<l_; i++){e_ +=GT(E[i],L,T);}
						return e_;				
				};
				GOT= function(I,L,T){
					var c_ = $t._g(inst,'_otitle');
					if (typeof I=='string') return '<p class="'+c_+'">'+I+'<\/p>';
					if (typeof I=='object'){
						if(I&&!isArray(I)) 
							return '<p class="'+c_+'"><label class="name">'+GT(I.n,'none')+': <\/label>'+GL(I.list,L,T)+'<\/p>';
						var L_ = I.length,O=[],I_;
						for(var i=0; i<L_; i++){
							I_ = I[i];
							O.push('<p class="'+c_+'">');
							O.push('<label class="name">'+GT(I_.n,'none')+': <\/label>');
							O.push(GL(I_.list, L, T))
							O.push('<\/p>');
						}
						return O.join("");
					}
				};
			var GTB = function(B,L,G,C){
				if (typeof B=='string') return '<a class="'+C+' '+C+'-'+B+'" href="'+L+'" target="'+G+'"></a>';
				else if (typeof B=='object'){
					var L_,G_,C_,T_;
					if(!isEmptyObject(B)){
						L_ = B.l? B.l:L,
						G_= B.t? B.t:G,
						C_= B.c? C+'-'+B.c:C,
						T_ = B.t_? B.t_:'';
						return '<a class="'+C+' '+C_+'" href="'+L_+'" target="'+G_+'">'+T_+'</a>';
					}
				}
				else return '<a class="'+C+'" href="'+L+'" target="'+G+'"></a>';
			};
			var info = '',
				h2_ = GT(thisInfo.t,_link,target),
				h3_ = GT(thisInfo.t1,_link,target),
				hr_='';
			h2_= h2_!='' ? '<h2>'+h2_+'<\/h2>':'' ;
			h3_= h3_!='' ? '<h3>'+h3_+'<\/h3>':'' ;
			if(h2_!='' || h3_!='') hr_='<hr class="separator" />';
			info += h2_+h3_+hr_;
			var ot = thisInfo.ot;
			ot= GOT(ot,_link,target,inst);
			ot= typeof ot !='undefined'? ot:'';
			var msg = thisInfo.m? '<p class="info">'+thisInfo.m+'<\/p>':'';
			info += ot+msg;
			if ($t._g(inst,'tipsBtn')){
				var _btn = $t._g(inst,'_tbtn');
				var _tbtn = GTB(thisInfo.b_, _link,target, _btn);
				info +=_tbtn;
			}
			$t._tipsAnimate(inst,info);
		}
	},
	
	_tipsAnimate: function(inst,info){
		var $tipsInfo = inst.$tipsInfo,$tipsBg = inst.$tipsBg, tipsAnimate =this._g(inst,'tipsAnimate');
		var _$info = $tipsInfo.find('div').not('.tips-corner');
		switch (tipsAnimate){
			case 'slide':{
				info!=''?(  _$info.html('').html(info),
							$tipsInfo.stop(false,true).slideUp('normal').stop(false,true).slideDown('normal'),
							$tipsBg.stop(false,true).slideUp('normal').stop(false,true).slideDown('normal')
						)
						:(	
							_$info.html(''), $tipsInfo.stop(false,true).slideUp('fast'), $tipsBg.stop(false,true).slideUp('fast') 
						);
				break;
			}
			case 'fade':{
				info!=''?(
							_$info.html('').html(info),
							$tipsInfo.stop(false,true).fadeOut('normal').stop(false,true).fadeIn('normal'),
							$tipsBg.stop(false,true).fadeOut('normal').stop(false,true).fadeIn('normal')
						)
						:(
							_$info.html(''),$tipsInfo.stop(false,true).fadeOut('fast'),$tipsBg.stop(false,true).fadeOut('fast')
						);
				break;
			}
			default:{
				info!=''?(_$info.html('').html(info),$tipsInfo.show(),$tipsBg.show()):(_$info.html(''),$tipsInfo.hide(),$tipsBg.hide());
			}
		}
		
	},
	_setCallback: function(inst){
		var _data = inst.data, _selected = inst.selected,_images = inst.images;
		var returnCall = {
			id: inst.id,
			total:inst.total,
			selected:inst.selected,
			curNav: this._indexAt(inst),
			curPlayer: inst.$currentli,
			curData: _data[_selected]? _data[_selected] : ''//image:_images[_selected]
		}
		inst.callDone = returnCall;
	},
	_display: function(inst,callback){
		var $t = this;
		$t._stop(inst);
		var player = $t._g(inst,'player');
		var callback = $t._g(inst,'callback');
		callback? $t._setCallback(inst):'';
		inst.preLoad = true;
		if(!player){
			callback? callback(inst.callDone):''
			inst.preLoad = false;
			if (!inst.hoverPause) $t._startAuto(inst);
		}
		else{
			var _animate = $t._g(inst,'animate'),$list=inst.$itemList,total = inst.total,
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
			
			$t._g(inst,'preload')?loadListImg(inst.$currentli):'';
			var speed = $t._g(inst,'pSpeed');
			var pwidth = $t._g(inst,'pWidth'), pheight = $t._g(inst,'pHeight');
			var completeIndex = inst.$currentli.index();
			var $currentImg = inst.$currentli.find('img');
			

			var doPlayerAnimate = function(){
				var _$curli = inst.$currentli, _$played = inst.played;
				switch (_animate){
					case 'fade':
						$t._playWithFade(_$curli,speed,total,function(){inst.played = _$curli;});
						break;
					case 'left':
						$t._playLeftRight(_$curli,pwidth,total,speed,function(){inst.played=_$curli;_$curli.siblings().css('left',pwidth);},'left');
						break;
					case 'right':
						$t._playLeftRight(_$curli,pwidth,total,speed,function(){inst.played=_$curli;_$curli.siblings().css('left',0-pwidth);});
						break;
					case 'bottom':
						$t._playDwonUp(_$curli,pheight,total,speed,function(){inst.played=_$curli;_$curli.siblings().css('top',pheight);},'bottom');
						break;
					case 'top':
						$t._playDwonUp($curli,pheight,total,speed,function(){inst.played=_$curli;_$curli.siblings().css('top',0-pheight);});
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
				var loadFunc = function(){
					inst.preLoad = false;
					doPlayerAnimate();
					callback? callback(inst.callDone):'';
				}
				if($currentImg[0]){
					$currentImg.load(function(){
						$(this).closest('li').attr('data-missing','false')
						loadFunc();
					}).error(function(){
						$(this).closest('li').attr('data-missing','true')
						inst.$currentli.html('<p class="'+$t._g(inst,'_missing')+'">'+$t._g(inst,'missing')+'</p>')
						loadFunc();
					});
				}
				else{
					loadFunc();
				}
				inst.completeImg.push($(this));
			}

		}
	},
	_playLeftRight:function(obj,width,total,speed,fun,where){
		var w_ = width, t_ = total ,s_ = speed, l, l_;
		var f_ = fun||function(){};
		where=='left'?(l=w_, l_=0-w_): (l=0-w_, l_=w_);
		obj.siblings('li').each(function(index){
			var $m = $(this);
			$m.css({'z-index': t_ - index});
			var left = parseInt($m.css('left'));
			where=='left' ? (
				left<l && left>=0 ?($m.animate({'left':l_},speed,function(){$m.css({'left':l});})):''
			):(
				left<l_ && left>=0 ?($m.animate({'left':l_},speed,function(){$m.css({'left':l});})):''
			);
		})
		if(obj.css('opacity')&& obj.css('opacity')<1) obj.css('opacity',1)
		obj.stop(true,true).css({'z-index': t_ + 1,'left':l}).animate({'left':0},speed,f_);
	},
	_playDwonUp:function(obj,height,total,speed,fun,where){
		var h_ = height, t_ = total ,s_ = speed, top, top_;
		var f_ = fun||function(){};
		where=='bottom'?(top=h_,top_=0-h_): (top=0-h_,top_=h_);
		obj.siblings('li').each(function(index){
			var $m = $(this);
			$m.css({'z-index': t_ - index});
			var tp = parseInt($m.css('top'));
			where=='bottom' ? (
				tp<top && tp>=0 ?($m.animate({'top':top_},speed,function(){$m.css({'top':top});})):''
			):(
				tp<top_ && tp>=0 ?($m.animate({'top':top_},speed,function(){$m.css({'top':top});})):''
			);
		})
		if(obj.css('opacity')&& obj.css('opacity')<1) obj.css('opacity',1)
		obj.stop(true,true).css({'z-index': t_ + 1,'top':top}).animate({'top':0},speed,f_);
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
		var space = $t._g(inst,'navSpace'),
			step = $t._g(inst,'step'),
			total = inst.total,
			speed = $t._g(inst,'scrollSpeed'),
			position = $t._g(inst,'navPlace'),
			bgAnimate = $t._g(inst,'tbgAnimate'),
			loop = $t._g(inst,'loop'),
			$selected,$scroll,
			$list = inst.$itemList;
		inst.$btnPrev.bind('click',function(){
			if(loop){
				if ( inst.btnClick){
					inst.btnClick = false;
					if(position=='lr'){
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
							var tbgSpeed = $t._g(inst,'tbgSpeed')
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
							var tbgSpeed = $t._g(inst,'tbgSpeed')
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
			seen=$t._g(inst,'navNum'),
			space = $t._g(inst,'navSpace'),
			step = $t._g(inst,'step'),
			$list = inst.$itemList,
			position = $t._g(inst,'navPlace'),
			loop = $t._g(inst,'loop'),
			bgAnimate = $t._g(inst,'tbgAnimate');
		if(!loop){
			$t._enabledBtnNext(inst);
			var listPos = position=='lr'? parseInt($list.css('top')): parseInt($list.css('left')),
				stepPos = space*step;
				if(listPos===0) return;
				inst.btnClick = false;
				var over=0, listScroll = position=='lr'? parseInt($list.css('top')) + space*step : parseInt($list.css('left')) + space*step;
				//console.log(listScroll);
				listScroll>0? (over=listScroll,listScroll = 0 ): '';
			$t._scrollPrev( inst,
						listScroll,
						function(){
							position=='lr'? (Math.abs(parseInt($list.css('top')))===0? $t._disabledBtnPrev(inst):'')
												 : (Math.abs(parseInt($list.css('left')))===0? $t._disabledBtnPrev(inst):'');
							inst.btnClick = true;
						}
		        	 );
			if(bgAnimate){
				var $scroll=inst.$scroll, bgSpeed=$t._g(inst,'tbgSpeed'),
					bgPos = position=='lr'? parseInt($scroll.css('top'))+stepPos : parseInt($scroll.css('left'))+stepPos;
				position=='lr'? $scroll.animate({top:bgPos-over},bgSpeed): $scroll.animate({left:bgPos-over},bgSpeed);
			}
		}
	},
	_scrollNextByStep: function(inst,btnClick){
		var $t = this,
			total=inst.total,
			seen=$t._g(inst,'navNum'),
			space = $t._g(inst,'navSpace'),
			step = $t._g(inst,'step'),
			$list = inst.$itemList,
			position = $t._g(inst,'navPlace'),
			loop = $t._g(inst,'loop'),
			bgAnimate = $t._g(inst,'tbgAnimate'),
			$scroll = inst.$scroll,
			bgSpeed=$t._g(inst,'tbgSpeed'),
			speed = $t._g(inst,'scrollSpeed');
		if(!loop){
			$t._enabledBtnPrev(inst);
			var listPos = position=='lr'? parseInt($list.css('top')): parseInt($list.css('left')),
				overPos = (total-seen)*space, stepPos = space*step, listScroll;
			if(Math.abs(listPos)===overPos) return;
			inst.btnClick = false;
			listScroll =listPos - stepPos,over = 0;
			Math.abs(listScroll)>overPos? (over=Math.abs(listScroll)-overPos,listScroll=0-overPos): '';
			$t._scrollNext( inst,
							listScroll,
							function(){
								position=='lr'? (Math.abs(parseInt($list.css('top')))===(total - seen) * space? $t._disabledBtnNext(inst):'')
													 : (Math.abs(parseInt($list.css('left')))===(total - seen) * space? $t._disabledBtnNext(inst):'');
								inst.btnClick = true;
							}
			        	 );
			if(bgAnimate){
				var bgPos = position=='lr'? parseInt($scroll.css('top'))-stepPos : parseInt($scroll.css('left'))-stepPos;
				position=='lr'? $scroll.animate({top:bgPos+over},bgSpeed): $scroll.animate({left:bgPos+over},bgSpeed);
			} 
		}
		else{//loop
			inst.btnClick = false;
			if(position=='lr'){
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
            loop = this._g(inst,'loop'),
            speed= this._g(inst,'scrollSpeed');
           	position = this._g(inst,'navPlace'),
            func = fun || function() {};
            if(!loop){
            	position=='lr'? $list.animate({top: distance},speed, func):$list.animate({left: distance},speed, func)
            }
    },
	_scrollNext: function(inst,distance,fun) {
		var $list = inst.$itemList,
            loop = this._g(inst,'loop'),
            speed= this._g(inst,'scrollSpeed');
           	position = this._g(inst,'navPlace'),
            func = fun || function() {};
            if(!loop){
            	position=='lr'? $list.animate({top: distance},speed, func):$list.animate({left: distance},speed, func)
            }
    },
   	_enabledBtnPrev: function(inst){
		var _active = this._g(inst,'_active');
		if(!inst.$btnPrev.hasClass(_active)) inst.$btnPrev.addClass(_active);
	},
	_enabledBtnNext: function(inst){
		var _active = this._g(inst,'_active');
		if(!inst.$btnNext.hasClass(_active)) inst.$btnNext.addClass(_active);
	},
	_disabledBtnPrev: function(inst){
		var _active = this._g(inst,'_active');
		var _hover = this._g(inst,'_hover');
		var _prev = inst.$btnPrev;
		if(_prev.hasClass(_active)){
			_prev.removeClass(_active);
			if(_prev.hasClass(_hover)) _prev.removeClass(_hover);
		} 
	},
	_disabledBtnNext: function(inst){
		var _active = this._g(inst,'_active');
		var _hover = this._g(inst,'_hover');
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
			$nav: '', 
			$btnPrev: '',	
			$btnNext: '',	
			$scroll: '', 
			$navList: '', 
			$itemList: '',	
			$player: '', 
			hoverPause:false,
			preLoad:true,
			selected:0,
			_selected:0,
			timeOutID:null,
			$currentli:null,
			clickSelected:0, 
			$tipsBg: '', 
			$tipsInfo: '', 
			$deepNav: '', 
			completeImg:[],
			scrollOver: null, 
			data:null, 
			images:[], 
			total:0,
			btnClick:true,
			callDone:null,
			played:null,
			$tipsType:null,
			firstPlay:null,
			$playType:'',
			build:false
//			curMissing:false
		};
	},

	_g: function(inst, name) {
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
				this._g(inst, name)) : null));
		}
		var settings = name || {};
		if (typeof name == 'string') {
			settings = {};
			settings[name] = value;
		}
		if (inst) {
			extendRemove(inst.settings, settings);
			//console.log(inst.build);
			//if(!inst.build) this._updateImageShown(inst)
			inst.build? inst.build = false:	this._updateImageShown(inst);
			//this._updateImageShown(inst)
		}
		inst = null;
	},
	_extendRemove:function(target, props) {
		extendRemove(target, props);
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