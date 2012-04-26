/******************************************
 * gomesoft.com
 *
 * @author          Ethan.zhu (zhuyidong）
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
		_clear:'clearfix'
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
		preloading: true, 
		target: '_blank', 
		pSpeed:500, 
		pType: false,
		tType:'image',//num,none,image,content
		listPlace:null,
		tipsBtn:false, 
		loadClass: 'img-player-loading',
		pContent:null
	};
	
	$.extend(this._defaults, this.classes['']);
}
$.extend(ImageShown.prototype, {
	_a: 'hasImageShown',
	//log
	_b: function () {
		if (this.debug)
			console.log.apply('', arguments);
	},
	setDefaults: function(settings) {
		extendRemove(this._defaults, settings || {});
		return this;
	},
	_instImageShown: function(b, c) {
		var id = b.id;
		var $elem = $(b);
		var d = null;
		for (var e in this._defaults) {
			var f = b.getAttribute('date:' + e);
			if (f) {
				d = d || {};
				try {
					d[e] = eval(f);
				} catch (err) {
					d[e] = f;
				}
			}
		}
		if (!id) {
			this.uuid += 1;
			b.id = 'img' + this.uuid;
		}
		this._defaults.id = b.id;
		var a = this._newInst($(b));
		a.settings = $.extend({}, c || {}, d || {});
		
		if ($elem.hasClass(this._a)) return;
		$elem.addClass(this._a);
		$.data(b, PROP_NAME, a);
		this._updateImageShown(a);
	
	},
	_updateImageShown: function(a){
		var $t = this;
		a.firstPlay = false;
		if($t._g(a,'player')){
			a.$player = $('<div class="'+$t._g(a,'_player')+'" />');
			if($t._g(a,'preloading')){
				var b = $t._g(a,'loadClass');
				if(!a.$player.hasClass(b)) a.$player.addClass(b);
			}
			else if(a.$player.hasClass(b)) a.$player.removeClass(b);
			$('<ul class="'+ $t._g(a,'_plist') +'" />').appendTo(a.$player);
		} 
		else{
			a.$player = '';
		}
		//console.log(this._g(a,'_thumbnail'));
		a.$nav = $('<div class="'+$t._g(a,'_thumb')+'" />');
		a.$btnPrev = $('<div class="'+$t._g(a,'_btn')+'"><span class="'+$t._g(a,'_btnPrev')+'" />');
		a.$btnNext = $('<div class="'+$t._g(a,'_btn')+' '+$t._g(a,'_aside')+'"><span class="'+$t._g(a,'_btnNext')+'" />');
		a.$navList = $('<div class="'+$t._g(a,'_tlist')+'" />');
		a.$itemList = $('<ul class="'+$t._g(a,'_items')+' '+$t._g(a,'_clear')+'" />');
		
		if($t._g(a,'showTips')){
			a.$tipsBg = $('<div class="'+$t._g(a,'_tbackground')+'" />');
			a.$tipsInfo = $('<div class="'+$t._g(a,'_tinfo')+'">');
		}
		else{
			a.$tipsBg = '';a.$tipsInfo = '';
		}
		var m = $t._g(a,'data'), n = a.data;
		if(m&&!n){
			a.data = [];
			var ml = m.length, f;
			for(var i=0;i<ml;i++){
				f = m[i];
				if(!isEmptyObject(self)) a.data.push(f)
			}
		}
		if (n&&m){
			var il = n.length, ml = m.length, f;
			for(var i=0;i<ml;i++){
				self = m[i];
				if(!isEmptyObject(f)){
					if(i<il) a.data[i] = f;
					else a.data.push(f);
				}
			}
		}
		a.completeImg = [];
		var d = a.data;
		if(d&&isArray(d)){//data is not null and data is an array
			a.total = d.length;
			$t._updeteOptions(a);
			$t._instHtml(a);
			$t._initEvents(a);
		}

	},
	_getProperty: function(A,B,C,W,H){
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
		var GI = function(A,L,W,C,I){
			var i_, g_, $i, c;
			W=='play'? (i_=$t._getProperty(A.b,L,t,w,h) , c=p)
						: (i_=$t._getProperty(A.s,L,t), c=m);
			i_!='nothing'?(
				i_.w&&i_.h&&i_.w!=''&&i_.h!='' ? (g_ = load ? ('data-origital="'+i_.p+'" width="'+i_.w+'" height="'+i_.h+'" src="'+$t._blankImg+'"') : ('width="'+i_.w+'" height="'+i_.h+'" src="'+i_.p+'"'))
											   : (g_ = load ? ('data-origital="'+i_.p+'" src="'+$t._blankImg+'"') :('src="'+i_.p+'"'))
				,
				$i = $(['<li class="'+ c +'"><a href="'+ i_.l +'" target="'+ i_.t +'"><img '+ g_ +' alt="'+ i_.a +'" /></a></li>'].join(""))
			):(
				$i = $(['<li class="'+ c +'">Need image here.</li>'].join(""))
			);
			C ? $i.css({'z-index': t_- I, opacity: 0}):'';
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
	_updeteOptions: function(a){
		var $t = this,
			b = $t._g(a,'navNum'),
			t = a.total,
			s = $t._g(a,'step');
		s= s>=t ? 1 :(s>b ? parseInt(b/2): $t._g(a,'step'));
		
		extendRemove(a.settings,{'step': s });
		
		if(typeof b=='string' && b=='css'){
			extendRemove(a.settings,{'loop':false,'tbgAnimate':false });
			a.$btnPrev =  a.$btnNext = '';
		}
		
		if($t._g(a,'tbgAnimate')) {
			a.$scroll = $('<div class="'+$t._g(a,'_scroll')+'" />');
			a.scrollOver = $t._g(a,'_sover');
		}
		else{
			a.$scroll = ''; a.scrollOver = $t._g(a,'_tover');
		}
		
		var c = $t._g(a,'selected');
		if(c>t) a.selected = 0;
		else a.selected = c-1;
		c = a.selected;
		if(c>0){
			var aa = a.data[c];
			for(var i=c; i>0; i--){
				a.data[i]=a.data[i-1];
			}
			a.data[0]=aa;
			a.selected = 0;
		}
	},
	_btnsHover: function(a){
		var $t=this,$b;
		$b = a.$nav.find('.'+$t._g(a,'_btn'));
		a.$nav = null;
		var b = $t._g(a,'_active');
		var c = $t._g(a,'_hover');
		var d = $t._g(a,'_aside');
		if($b) $b.addClass(b);
		if(!$t._g(a,'loop')){
			if((a.selected+1) <= $t._g(a,'navNum')) {
				 $b.each(function(){
					 var $ts = $(this);
					 $ts.hasClass(d)? $ts.addClass(b): $ts.removeClass(b);
				})
			}
		}
		$b.hover(function(){
				var $ts = $(this);
				if($ts.hasClass(b)) $ts.addClass(c);
			},function(){
				var $ts = $(this);
				if($ts.hasClass(b)&&$ts.hasClass(c)) $ts.removeClass(c);
		});
	},
	_initEvents: function(a){
		var $t = this;
		$t._btnsHover(a);
		$t._btnsNextClick(a);
		$t._btnsPrevClick(a);
		$t._bindItemEvent(a);
        var auto = $t._g(a,'autoPlay'),loop = $t._g(a,'loop');
        a.$elem.hover(function() {
        	a.hoverPause = true;
        	!loop? a.clickSelected = a.selected : '';
			auto? $t._stop(a):''
        },
        function() {
        	a.hoverPause = false;
          	if(auto) $t._start(a);
        });
        $t._thumbSelected(null,a);
       	//$t._startAuto(inst);
	},
	_startAuto: function(a){
		var $t = this;
		a.timeOutID? clearTimeout(a.timeOutID):'';
		if(!a.preLoad){
			a.timeOutID = null;
			a.timeOutID = $t._g(a,'autoPlay')? setTimeout(function(){$t._autoPlay(a);},$t._g(a,'autoTime')):null;
		}
	},
	_autoPlay: function(a){
		var $t = this;
		if(a.timeOutID&&!a.preLoad){
			var obj;
			if($t._g(a,'loop')){
				a._selected = a._selected>=(a.total-1)?0:++a._selected;
				obj = a.$itemList.find('li').eq(a._selected);
				
			}
			else{
				a.selected = a.selected>=(a.total-1)?0:++a.selected;
				obj = a.$itemList.find('li').eq(a.selected)
				
			}
			$t._thumbSelected(obj,a);
		}
		a.timeOutID = $t._g(a,'autoPlay')? setTimeout(function(){$t._autoPlay(a);},$t._g(a,'autoTime')):null;
	},
	_stop: function(a){
		if(a.timeOutID) clearTimeout(a.timeOutID);
	},
	_start: function(a){
		this._startAt(a);
	},
	_startAt: function(a){
		var $t = this, $s=a.$scroll, b = $t._g(a,'loop'), c = $t._g(a,'navSpace'), d = $t._g(a,'navPlace'), 
			e = $t._g(a,'navNum'), f = (e-1)*c, g = $t._g(a,'tbgAnimate');
		var $st = $t._indexAt(a), h = $st.position();

		if(b){
			h = d=='lr'? h.top : h.left;
			if (parseInt(h)>f) {
				if(g){
					var i = d=='lr'? parseInt($s.css('top')):parseInt($s.css('left'));
					i>f? d=='lr'?$s.css('top',0):$s.css('left',0):'';
				}
				$t._thumbSelected(null,a);
			}
		}
		else{
			var $list = a.$itemList, listPos = d=='lr'? $list.css('top') : $list.css('left');
			h = d=='lr'? h.top : h.left;
			listPos = Math.abs(parseInt(listPos)), selecttedPos = Math.abs(parseInt(h));
			
			if (selecttedPos<listPos) a.selected = parseInt(listPos/c);
			else if((listPos+f) < h) {
				a.selected = parseInt(listPos/c);
				if(g){
					var i = d=='lr'? parseInt($s.css('top')):parseInt($s.css('left'));
					i>f? d=='lr'?$s.css('top',0):$s.css('left',0):'';
				}
			}
			else a.clickSelected = a.selected;
			if(a.clickSelected!=a.selected) $t._thumbSelected(null,a);
		}
		
		$t._startAuto(a);
	},
	_bindItemEvent: function(a){
		var $t = this, b = $t._g(a,'navNum'), c=$t._g(a,'addtional'), $l= a.$itemList,ev = $t._g(a,'events')
		$l.delegate('li.',ev,function(e){
			var $this = $(this),
            	index = $this.attr('data-index');
            if (ev==='click') e.preventDefault();
            if(index!=a.selected){
            	$t._thumbSelected($this,a);
            }
		});
		if(b=='css' && c){
			a.$addtional.delegate('li',ev,function(e){
				var $this = $(this), index = $this.attr('data-index');
				if (ev==='click') e.preventDefault();
				if(index!=a.selected){
					$t._thumbSelected($l.find('li').eq(index),a);
				}
			})
		}
	},
	_getTitle: function(t,l,g){
		var t_;
		if (typeof t=='string') return t_ = l=='none'? t:('<a href="'+l+'" target="'+g+'">'+t+'<\/a>');
		else if(typeof t=='object'){
			var l_ = t.l? t.l:l,
				g_=t.g? t.g:g;
			return t_ = l_=='none'? t.t:('<a href="'+l_+'" target="'+g_+'">'+t.t+'<\/a>');
		}
		else return '';
	},
	_resetSelected: function(a){
		var $t=this, b=$t._g(a,'tbgAnimate'),d=$t._g(a,'navPlace'),c=$t._g(a,'tbgSpeed'),$s=a.$scroll;
		$t._scrollNext(a,0,function(){$t._enabledBtnNext(a);$t._disabledBtnPrev(a);});
		b? (d=='lr'? 
						  $s.animate({top:0},c)
						: $s.animate({left:0},c)
				   ): '';
	},
	_thumbSelected: function(o,a){
		var $t = this, 
			b = $t._g(a,'tbgSpeed'),
			c = a.scrollOver, 
			d = $t._g(a,'navPlace'), 
			e = $t._g(a,'tbgAnimate'),
			f = $t._g(a,'tType'),
			$l = a.$itemList,
			g = $t._g(a,'loop'),
			i;
		
		if(!a.firstPlay) a.firstPlay = true;
		!o? (g? o = $l.find('li').eq(0): o = $l.find('li').eq(a.selected) ): '';
		i = o.attr('data-index');
		a.firstPlay? (a.selected = -1,a.firstPlay=false) : '' ;
		a.selected = a.clickSelected = i;
		a._selected = o.index();
		if(f=='image'){
			var $img = o.find('img'), opacity = $t._g(a,'opacity');
			typeof $img[0]!='undefined'? $img.stop().animate({'opacity':1},'fast'):'';
			o.siblings().each(function(){
				var $this = $(this), thisImg = $this.find('img');
				typeof(thisImg[0])!='undefined'? thisImg.stop().animate({opacity:opacity},'fast'):'';
			});
		}
		var x, y, z;
		
		d=='lr'? (x=o.position().top,y= $l.css('top'),z= x-Math.abs(parseInt(y)))
							 : (x=o.position().left,y= $l.css('left'),z= x-Math.abs(parseInt(y)));
		
		var u = $t._g(a,'navSpace'), v = $t._g(a,'navNum'), w = u*(v-1);
		var func = function(tag){
			z > w? $t._scrollNextByStep(a): z<0? $t._resetSelected(a):'';
			!tag?$(this).css('z-index',3):'';
		};
		$t._display(a);

		if(e){
			var $s=a.$scroll;
			d=='lr'? $s.css('z-index',5).stop(true,true).animate({top:z},b,func)
			 					 : $s.css('z-index',5).stop(true,true).animate({left:z},b,func);
		}
		else{
			func(true);
		}
		o.addClass(c).siblings().removeClass(c);
	},
	_setInfo: function(a){
		var $t = this;
		var b = $t._g(a,'showTips');
		if(b){
			var //c = a.$tipsBg, 
				//$tipsInfo = a.$tipsInfo,
				c = a.selected,
				d = a.data[c],
				l = d.l,
				g=$t._g(a,'target'), 
				i = $t._g(a,'_ptype'),
				j = $t._g(a,'ptype');
				
			if(j){
				var k = d.tp, c_;
				c_ = (k ? (i+' '+i+'-'+k) : i) ;
				a.$playType[0].className = c_;
			}
			
			var info = '',
				h2_ = $t._getTitle(d.t,l,g),
				h3_ = $t._getTitle(d.t1,l,g),
				hr_='';
			h2_= h2_!='' ? '<h2>'+h2_+'<\/h2>':'' ;
			h3_= h3_!='' ? '<h3>'+h3_+'<\/h3>':'' ;
			if(h2_!='' || h3_!='') hr_='<hr class="separator" />';
			info += h2_+h3_+hr_;
			var ot = d.ot;
			ot= $t._getOtherTitle(ot,l,g,a);
			ot= typeof ot !='undefined'? ot:'';
			var m = d.m? '<p class="info">'+d.m+'<\/p>':'';
			info += ot+m;
			if ($t._g(a,'tipsBtn')){
				var n = $t._g(a,'_tbtn'), n_ = $t._getTipsBtn(d.b_, l, g, n);
				info +=n_;
			}
			$t._tipsAnimate(a,info);
		}
	},
	_getTipsBtn: function(b,l,g,c){
		if (typeof b=='string') return '<a class="'+c+' '+c+'-'+b+'" href="'+l+'" target="'+g+'"></a>';
		else if (typeof b=='object'){
			var l_,g_,c_,t_;
			if(!isEmptyObject(b)){
				l_ = b.l? b.l:l,
				g_= b.t? b.t:g,
				c_= b.c? c+'-'+b.c:c,
				t_ = b.t_? b.t_:'';
				return '<a class="'+c+' '+c_+'" href="'+l_+'" target="'+g_+'">'+t_+'</a>';
			}
		}
		else return '<a class="'+c+'" href="'+l+'" target="'+g+'"></a>';;
	},
	_tipsAnimate: function(a,i){
		var b = a.$tipsInfo,c = a.$tipsBg, d =this._g(a,'tipsAnimate');
		var e = b.find('div');
		switch (d){
			case 'slide':{
				i!=''?(  e.html('').html(i),
							b.stop(false,true).slideUp('normal').stop(false,true).slideDown('normal'),
							c.stop(false,true).slideUp('normal').stop(false,true).slideDown('normal')
						)
						:(	
							e.html(''), b.stop(false,true).slideUp('fast'), c.stop(false,true).slideUp('fast') 
						);
				break;
			}
			case 'fade':{
				i!=''?(
							e.html('').html(i),
							b.stop(false,true).fadeOut('normal').stop(false,true).fadeIn('normal'),
							c.stop(false,true).fadeOut('normal').stop(false,true).fadeIn('normal')
						)
						:(
							e.html(''),b.stop(false,true).fadeOut('fast'),c.stop(false,true).fadeOut('fast')
						);
				break;
			}
			default:{
				i!=''?(e.html('').html(i),b.show(),c.show()):(e.html(''),b.hide(),c.hide());
			}
		}	
	},
	_getOtherTitle: function(info,link,target,a){
		var $t = this, _class = $t._g(a,'_otitle');
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
	_setCallback: function(a){
		var d = a.data, s = a.selected;
		var r = {
			id: a.id,
			selected:s,
			total:a.total,
			curData: d[s]? d[s] : ''//image:_images[_selected]
		}
		a.callDone = r;
	},
	_display: function(a,callback){
		var $t = this;
		$t._stop(a);
		var player = $t._g(a,'player');
		var callback = $t._g(a,'callback');
		callback? $t._setCallback(a):'';
		a.preLoad = true;
		if(!player){
			callback? callback(a.callDone):''
			a.preLoad = false;
			if (!a.hoverPause) $t._startAuto(a);
		}
		else{
			var _animate = $t._g(a,'animate'),$l=a.$itemList,total = a.total,
				$player=a.$player,$images = a.images;
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
				dataIndex = a.selected,
				//var $li;
				a.$currentli = getList(dataIndex);
			
			loadListImg(a.$currentli);
			var speed = $t._g(a,'pSpeed');
			var pwidth = $t._g(a,'pWidth'), pheight = $t._g(a,'pHeight');
			var completeIndex = a.$currentli.index();
			var $currentImg = a.$currentli.find('img');
			

			var doPlayerAnimate = function(){
				var _$curli = a.$currentli, _$played = a.played;
				switch (_animate){
					case 'fade':
						$t._playWithFade(_$curli,speed,total,function(){a.played = _$curli;});
						break;
					case 'left':
						$t._playLeftRight(_$curli,pwidth,total,speed,function(){a.played=_$curli;_$curli.siblings().css('left',pwidth);},'left');
						break;
					case 'right':
						$t._playLeftRight(_$curli,pwidth,total,speed,function(){a.played=_$curli;_$curli.siblings().css('left',0-pwidth);});
						break;
					case 'bottom':
						$t._playDwonUp(_$curli,pheight,total,speed,function(){a.played=_$curli;_$curli.siblings().css('top',pheight);},'bottom');
						break;
					case 'top':
						$t._playDwonUp($curli,pheight,total,speed,function(){a.played=_$curli;_$curli.siblings().css('top',0-pheight);});
						break;
					default : _$curli.stop().css('opacity',1).show().siblings().css('opacity',0).hide();
				}
				if (!a.hoverPause) $t._startAuto(a);
				$t._setInfo(a);
			};
			$l.each(function(){
				$(this).find('img').unbind();
			});
			
			if(a.completeImg[completeIndex]){
				a.preLoad = false;
				doPlayerAnimate();
				callback? callback(a.callDone):'';
			}
			else{
				var _$played = a.played;
				if(_$played) _$played.css('opacity','0.3');
				$currentImg.load(function(){
					a.preLoad = false;
					doPlayerAnimate();
					callback? callback(a.callDone):'';
				});
				a.completeImg.push($(this));
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
	_indexAt: function(a){
		var b = a.selected;
        var $l = a.$itemList.find("li"),
        	i, j, $f = null, $s;
        for (i = 0, j = $l.length; i < j; i++) {
            $s = $($l[i]);
            if ($s.attr('data-index') === b) {
                $f = $s;
                break;
            }
        }
        return $f;
	},
	_btnsPrevClick: function(a){
		if(!a.$btnPrev||a.$btnPrev=='') return;
		var $t = this;
		var b = $t._g(a,'navSpace'),
			c = $t._g(a,'step'),
			d = a.total,
			e = $t._g(a,'scrollSpeed'),
			f = $t._g(a,'navPlace'),
			g = $t._g(a,'tbgAnimate'),
			h = $t._g(a,'loop'),
			i,$st,$sc,
			$l = a.$itemList;
		a.$btnPrev.bind('click',function(){
			if(h){
				if ( a.btnClick){
					a.btnClick = false;
					if(f=='lr'){
						if(g){
							$sc = a.$scroll;
							$st = $t._indexAt(a);
							i = parseInt($sc.css('top'));
							i >= (d-c)*b ? $sc.css({top:$st.css('top')}):'';
						}
						$l.find('li:gt('+(d-c-1)+')').insertBefore($l.find('li:first')).each(
							function(index){
			                	var $ts = $(this),thisPos = parseInt($ts.css('top'));
			                    $ts.css({top: thisPos - d * b})
			            	}
						);
						$l.find('li').each(function(index){
							var $ts = $(this);
							$ts.stop(true,true)
							   .animate({top:parseInt($ts.css('top'))+c*b},
							   			e,
										function(){
											if(index === d - c) a.btnClick = true;
								});
						});
						if(g){
							var k = $t._g(a,'tbgSpeed')
							$sc.stop(true,true)
								   .animate({top: parseInt($st.css('top')) + (b*c)},
								   			k,
	                    					function(){ 
	                    						if(parseInt($sc.css('top'))=== (d-1)*b)
	                    							$sc.css({top:(b*c)-parseInt($st.css("top"))});
	                    					});
						}
						
					}
					else{
						if(g){
							$sc = a.$scroll;
							$st = $t._indexAt(a);
							i = parseInt($sc.css('left'));
							i >= (d-c)*b ? $sc.css({left:$st.css('left')}):'';
						}
						$l.find('li:gt('+(d-c-1)+')').insertBefore($l.find('li:first')).each(
							function(index){
			                	var $ts = $(this),thisPos = parseInt($ts.css('left'));
			                    $ts.css({left: thisPos - d * b})
			            	}
						);
						$l.find('li').each(function(index){
							var $ts = $(this);
							$ts.stop(true,true)
							   .animate({left:parseInt($ts.css('left'))+c*b},
							   			e,
										function(){
											if(index === d - c) a.btnClick = true;
								});
						});
						if(g){
							var k = $t._g(a,'tbgSpeed')
							$sc.stop(true,true)
								   .animate({left: parseInt($st.css('left')) + (b*c)},
								   			k,
	                    					function(){ 
	                    						if(parseInt($sc.css('left'))=== (d-1)*b)
	                    							$sc.css({left:(b*c)-parseInt($st.css('left'))});
	                    					});
						}
					}
				}
			}
			else{//!loop
				if ( a.btnClick){
					$t._scrollPrevByStep(a)
				}
			}
		});
	},
	_btnsNextClick: function(a){
		if(!a.$btnNext||a.$btnNext=='') return;
		var $t = this;
		a.$btnNext.bind('click',function(){
			if (a.btnClick) $t._scrollNextByStep(a,true);
		});
	},
	_scrollPrevByStep: function(a){
		var $t = this,
			//b=a.total,
			//b=$t._g(a,'navNum'),
			b = $t._g(a,'navSpace'),
			c = $t._g(a,'step'),
			$l = a.$itemList,
			d = $t._g(a,'navPlace'),
			e = $t._g(a,'loop'),
			f = $t._g(a,'tbgAnimate');
		if(!e){
			$t._enabledBtnNext(a);
			var g = d=='lr'? parseInt($l.css('top')): parseInt($l.css('left')),
				h = b*c;
				if(g===0) return;
				a.btnClick = false;
				var l=0, i = d=='lr'? parseInt($l.css('top')) + b*c : parseInt($l.css('left')) + b*c;
				//console.log(i);
				i>0? (l=i,i = 0 ): '';
			$t._scrollPrev( a,
						i,
						function(){
							d=='lr'? (Math.abs(parseInt($l.css('top')))===0? $t._disabledBtnPrev(a):'')
												 : (Math.abs(parseInt($l.css('left')))===0? $t._disabledBtnPrev(a):'');
							a.btnClick = true;
						}
		        	 );
			if(f){
				var $s=a.$scroll, j=$t._g(a,'tbgSpeed'),
					k = d=='lr'? parseInt($s.css('top'))+h : parseInt($s.css('left'))+h;
				d=='lr'? $s.animate({top:k-l},j): $s.animate({left:k-l},j);
			}
		}
	},
	_scrollNextByStep: function(a,b){
		var $t = this,
			c=a.total,
			d=$t._g(a,'navNum'),
			e = $t._g(a,'navSpace'),
			f = $t._g(a,'step'),
			$l = a.$itemList,
			g = $t._g(a,'navPlace'),
			h = $t._g(a,'loop'),
			i = $t._g(a,'tbgAnimate'),
			$s = a.$scroll,
			j = $t._g(a,'tbgSpeed'),
			k = $t._g(a,'scrollSpeed');
		if(!h){
			$t._enabledBtnPrev(a);
			var l = g=='lr'? parseInt($l.css('top')): parseInt($l.css('left')),
				m = (c-d)*e, n = e*f, o;
			if(Math.abs(l)===m) return;
			a.btnClick = false;
			o =l - n,p = 0;
			Math.abs(o)>m? (p=Math.abs(o)-m,o=0-m): '';
			$t._scrollNext( a,
							o,
							function(){
								g=='lr'? (Math.abs(parseInt($l.css('top')))===(c - d) * e? $t._disabledBtnNext(a):'')
													 : (Math.abs(parseInt($l.css('left')))===(c - d) * e? $t._disabledBtnNext(a):'');
								a.btnClick = true;
							}
			        	 );
			if(i){
				var q = g=='lr'? parseInt($s.css('top'))-n : parseInt($s.css('left'))-n;
				g=='lr'? $s.animate({top:q+p},j): $s.animate({left:q+p},j);
			} 
		}
		else{//loop
			a.btnClick = false;
			if(g=='lr'){
				$l.find('li').each(function(index){
					$(this).stop()
						   .animate({top: e * (index - f)},k,
			               		function(){
			    	       			if(index === c - f){
			    	       				a.btnClick = true;
			               				$l.find('li:lt('+(f)+')').insertAfter($l.find('li:last')).each(
			               					function(index){
			               						var $this = $(this), thisPos = parseInt($this.css('top'));
			               						$this.css({top: c * e + thisPos})
			               				});
			               				if(!b){
			               					var $st_ = $t._indexAt(a);
		          							a._selected = $st_.index();
		          						}
			               			}
			                });
		        });

				if(i&&b){
					var $st  = $t._indexAt(a);
					$s.stop(true,true)
						   .animate({top: parseInt($st.css('top')) - (e*f)},
	                				j,
	                				function(){
	                					var _top = parseInt($s.css('top'))
	                    				if(_top<0) $s.css({top:$st.css('top')})
	                    	})
				}

		    	if(i&&!b){
		    		$s.stop().animate({top:(d-f)*e},j)
		    	} 
			}
			else{
				$l.find('li').each(function(index){
					$(this).stop()
						   .animate({left: e * (index - f)},k,
			               		function(){
			    	       			if(index === c - f){
			    	       				a.btnClick = true;
			               				$l.find('li:lt('+(f)+')').insertAfter($l.find('li:last')).each(
			               					function(index){
			               						var $this = $(this), thisPos = parseInt($this.css('left'));
			               						$this.css({left: c * e + thisPos})
			               				});
			               				
			               				if(!b){
			               					var $st_ = $t._indexAt(a);
		          							a._selected = $st_.index();
			               				}			
			               			}
	                        });
		        });
			
				if(i&&b){
					var $st  = $t._indexAt(a);
					$s.stop(true,true)
						   .animate({left: parseInt($st.css('left')) - (e*f)},
	                				j,
	                    			function(){
	                    				var _left = parseInt($s.css('left'))
	                    				if(_left<0) $s.css({left:$st.css('left')})
	                    			});
				}
		    	if(i&&!b){
		    		//var $s = a.$s;
		    		$s.stop().animate({left:(d-f)*e},j)
		    	} 
			}
		}
	},
	_scrollPrev: function(a,distance,fun) {
		var $list = a.$itemList,
            loop = this._g(a,'loop'),
            speed= this._g(a,'scrollSpeed');
           	position = this._g(a,'navPlace'),
            func = fun || function() {};
            if(!loop){
            	position=='lr'? $list.animate({top: distance},speed, func):$list.animate({left: distance},speed, func)
            }
    },
	_scrollNext: function(a,distance,fun) {
		var $list = a.$itemList,
            loop = this._g(a,'loop'),
            speed= this._g(a,'scrollSpeed');
           	position = this._g(a,'navPlace'),
            func = fun || function() {};
            if(!loop){
            	position=='lr'? $list.animate({top: distance},speed, func):$list.animate({left: distance},speed, func)
            }
    },
   	_enabledBtnPrev: function(a){
		var _active = this._g(a,'_active');
		if(!a.$btnPrev.hasClass(_active)) a.$btnPrev.addClass(_active);
	},
	_enabledBtnNext: function(a){
		var _active = this._g(a,'_active');
		if(!a.$btnNext.hasClass(_active)) a.$btnNext.addClass(_active);
	},
	_disabledBtnPrev: function(a){
		var _active = this._g(a,'_active');
		var _hover = this._g(a,'_hover');
		var _prev = a.$btnPrev;
		if(_prev.hasClass(_active)){
			_prev.removeClass(_active);
			if(_prev.hasClass(_hover)) _prev.removeClass(_hover);
		} 
	},
	_disabledBtnNext: function(a){
		var _active = this._g(a,'_active');
		var _hover = this._g(a,'_hover');
		var _next = a.$btnNext;
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

	_g: function(a, name) {
		return a.settings[name] !== undefined ?
			a.settings[name] : this._defaults[name];
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
		var a = this._getInst(target);
		if (arguments.length == 2 && typeof name == 'string') {
			return (name == 'defaults' ? $.extend({}, $.imageShownT._defaults) :
				(a ? (name == 'all' ? $.extend({}, a.settings) :
				this._g(a, name)) : null));
		}
		var settings = name || {};
		if (typeof name == 'string') {
			settings = {};
			settings[name] = value;
		}
		if (a) {
			extendRemove(a.settings, settings);
			this._updateImageShown(a);
		}
		a = null;
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