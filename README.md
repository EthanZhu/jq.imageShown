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
Introduction:

 jquery imageShown 插件可以完成多种形式的内容轮显切换， 所有我提供的Demo中虽然都是导航带动的轮显图片，
但是它还能完成内容的切换，即可以完成Tab功能，单纯的图片轮显功能，新闻信息的轮显。 也就是说这个插件在使用合理参数的配合下可以显示任何形式的内容。 
此插件可以在上下左右四个方向上显示导航，背景滑动动画可以独立设置，播放区域动画可以独立设置，每次进入显示区域导航数量可以独立设置，如果设置错误或者设置不合理会被插件内部重置。提示信息是否显示，以及显示动画可以独立设置。具体请参考Demo相关内容。

注：在使用Tab功能时需要设置 pContent为 content 并且由于由于显示区域已经被固定大小，所以针对未知大小的内容请在callback函数中处理。

插件内部已经对请求的资源是否存在做了判断，例如出现错误你可以直接显示参数中你提供默认显示信息，同时你也可以在callback函数中对这个错误区域进行处理。


callback函数你可以接收回传的参数，
回传参数的说明：
id: //当前Dom的ID，在你页面未设置ID的情况下这个ID会是插件自动生成的唯一值。
total//轮显内容的数量
selected//当前选择的第一个内容区域，当你loop设置为false时此内容就是页面Dom中的index值，当loop为true时导航区域需要根据 attr('data-index')来获取当前的index。player区域不受loop限制，永远为当前内容的index值
curMissing//用来标记，当前内容是否加载错误。true为加载错误，false为正常加载。
curData//你传入数据data的当前值。
下一步开发计划：
当你不愿意或者不会使用data参数时，你可以讲需要显示的内容按照固定格式写入html页面，然后使用 build命令由插件自行完成余下内容
例如：
	$('elem').imageShown('bulid');
	$('elem').imageShown('bulid',{'options'});
	$('elem').imageShown('bulid','option','value');
提供外部暂停和重启自动播放的接口，方便你能够在回调函数中进行使用。
提供更多的说明和示例。

How to use:
$('elem').imageShown({'options'});
setter:
$('elem').imageShown('option',{'options'});
$('elem').imageShown('option','option','value');
getter
var option = $('elem').imageShown('option','option name');


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
	
When you do not use the option of data, you want write them into html code, you can use 'build' command to generated data automatically.

I will give  more examples and more descriptions