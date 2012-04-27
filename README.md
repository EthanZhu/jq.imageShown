/******************************************
 * gomesoft.com
 *
 * @author          Ethan.zhu（zhuyidong）
 * @copyright       Copyright (c) 2012 gomesoft.com
 * @license         This imageShown jQuery plug-in is dual licensed under the MIT and GPL licenses.
 * @link            http://www.gomesoft.com
 * @docs            http://ethanzhu.github.com/jquery.imageShown/
 * @demo            http://ethanzhu.github.com/jquery.imageShown/Demo.html
 * @version         Version 1.0
 * @email			pig.whose@gmail.com; 12377166@qq.com
 * 
 *
 ******************************************/
How to use:
$('elem').imageShown({'options'});
setter:
$('elem').imageShown('option',{'options'});
$('elem').imageShown('option','option','value');
getter
var option = $('elem').imageShown('option','option name');
$('elem').imageShown('option',{'options'});

default options ：

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
		pContent:'image'
    
Future：
	$('elem').imageShown('bulid');
	$('elem').imageShown('bulid',{'options'});
	$('elem').imageShown('bulid','option','value');
	
When you do not use the option of data, you want write them into html, you can use 'build' command to generated data automatically
I will give For more examples and more descriptions