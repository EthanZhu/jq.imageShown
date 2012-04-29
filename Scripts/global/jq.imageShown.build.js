$.fn.extend($.imageShown,{
	_buildImageShown: function(target, name, value){
		var $t = this, a = $t._getInst(target);
		a.build = true;
		var $l = a.$elem.find('li.'+$t._g(a,'_item')), $p = a.$elem.find('li.'+$t._g(a,'_pitem')),mainData = [];
		if(typeof $l[0]=='undefined' && typeof $p[0]=='undefined') return;//nothing to shown;
		$t._optionImageShown(target, name, value);
		$t._g(a,'preload')? $t._extendRemove(a.settings,{'preload':false}):'';
		var player,mainLength;
		player = $t._g(a,'player');
		typeof $p[0]!='undefined'? mainLength = $p.length: (player? (player = false, $t._extendRemove(a.settings,{'player':false})): '');
		typeof $l[0]!='undefined'? mainLength = $l.length: ($t._g(a,'tContent')=='image'? $t._extendRemove(a.settings,{'tContent':'none'}):'');
		if (typeof $l[0]=='undefined' && !player) return;//nothing to shown;
		var n = $t._g(a,'tContent'), p = $t._g(a,'pContent'),glink, $thisNav, content, $thisPlay,$navContent,$playContent,$H2,$H3,$tips,tips = $t._g(a,'showTips');
		
		var buildData = function(A,T,L,W){
			typeof L[0]!='undefined'? (L= L.html(),L.charAt(L.length - 1)!='/'? L +='/':''):'';
			if(T=='num'||T=='none') return
			var B,C,D,H,I,data=[],J,hf;
			if(T!='hgroup'&T!='btn'&&T!='ot'){
				B = A.find('a:first'), C = A.find('img'),
				H=B[0],I=C[0];
				data.push('{')
				if(typeof H!='undefined'&&T!='content'){
					hf=H.href;
					hf.charAt(hf.length - 1)!='/'? hf +='/':''
					hf!=L ? (data.push('"l":"'+H.href+'"'),H.target? data.push('"t":'+'"'+H.target+'"'):''):''
				}
				T=='content'?data.push('"p":"'+A.html()+'"'):(
					typeof I!='undefined'?(
						data.push('"p":"'+I.src+'"'),
						I.alt? data.push('"a":"'+I.alt+'"'):'',
						W!='big'?(I.width? data.push('"w":"'+I.width+'"'):'',I.height? data.push('"h":'+'"'+I.height+'"'):''):''
			
					):''
				);
				data.push('}');
				return data.join(",");
			}
			if(T=='hgroup'){
				B = A.find('a:first'),H = B[0], C = typeof H!='undefined'? B.html(): A.html();
				
				if(typeof H!='undefined'){
					data.push('{')
					data.push('"t":"'+ C +'"');
					hf=H.href;
					hf.charAt(hf.length - 1)!='/'? hf +='/':''
					hf!=L ? (data.push('"l":"'+H.href+'"'),H.target? data.push('"g":'+'"'+H.target+'"'):''):''
					data.push('}');
				}
				else{
					data.push('"'+ C +'"');
				}
				return data.join(",");
			}
			if(T=='btn'){
				B = A.find('a'), C=B[0];
				if(typeof C!='undefined'){
					D = B.length;
					//D==1? data.push('"{"'):data.push('"[{"');
					D==1? '':data.push('[');
					for (J=0;J<D;J++){
						//'b_':'tv',//{'c':'','l':'','t':'','t_':''} class, link, target, text
						data.push('{');
						H = B.eq(J),I = H[0]
						hf=I.href;
						I.className!=''? data.push('"c":"'+I.className+'"'):'';
						hf.charAt(hf.length - 1)!='/'? hf +='/':''
						hf!=L ? (data.push('"l":"'+hf+'"'),I.target? data.push('"t":'+'"'+I.target+'"'):''):'';
						H.html()!=''? data.push('"t_":"'+H.html()+'"'):'';
						data.push('}')
					}
					D==1? '':data.push(']');
				}
				else{
					B = A.html();
					B!=''? data.push('"'+ B +'"'):''
				}
				return data.join(",");
			}
			if(T=='ot'){
				var M,N = A.length;
				N==1?'':data.push('[');
				for(M=0;M<N;M++){
					B=A.eq(M);
					B = B.find('span'),C=B[0], C= typeof C!='undefined'?B.html():''
					data.push('{');
					data.push('"n":"'+C+'"');
					B = A.eq(M).find('a'),C=B[0];
					console.log(B);
					if(typeof C!='undefined'){
						data.push('"list":');
						D = B.length;
						D==1? '':data.push('[');
						for (J=0;J<D;J++){
							data.push('{');
							H = B.eq(J),I = H[0];
							hf=I.href;
							H.html()!=''? (
								data.push('"t":"'+H.html()+'"'),
								hf.charAt(hf.length - 1)!='/'? hf +='/':'',
								hf!=L ? (data.push('"l":"'+hf+'"'),I.target? data.push('"g":'+'"'+I.target+'"'):''):''
							):'';
							data.push('}');
						}
						D==1? '':data.push(']');
					}		
					data.push('}')
				}
				N==1?'':data.push(']');
			}
			return data.join(",");
		}
		var pType = $t._g(a,'pType'), tipsBtn = $t._g(a,'tipsBtn');
		for(i=0; i<mainLength;i++){
			var thisContent=[];
			thisContent.push('{');
			typeof $l[0]!='undefined'?$thisNav = $l.eq(i):'';
			typeof $p[0]!='undefined'?$thisPlay = $p.eq(i):'';
			if($thisNav){
				glink = $thisNav.find('p.global-link');
				typeof glink[0]!='undefined' ? thisContent.push('"l":'+'"'+glink.html()+'"'):''
				$content = $thisNav.find('p.this-content');
				content = typeof $content[0]!='undefined'?buildData($content, n, glink):'""';
				thisContent.push('"s":'+ content);
			}
			if($thisPlay&&player){
				typeof glink[0]=='undefined'? (glink = $thisPlay.find('p.global-link'),typeof glink[0]!='undefined' ? thisContent.push('"l":'+'"'+glink.html()+'"'):''):'';
				$content = $thisPlay.find('p.this-content');
				content = typeof $content[0]!='undefined'?buildData($content, n, glink, 'big'):'""';
				thisContent.push('"b":'+ content);
				if(tips){
					$tips = $thisPlay.find('label'),$H2 = $tips.find('h2'), $H3 = $tips.find('h3');
					typeof $thisPlay[0]!='undefined' ?(
						content = typeof $H2[0]!='undefined'? buildData($H2, 'hgroup', glink):'',
						content!=''? thisContent.push('"t":'+content):'',
						content = typeof $H3[0]!='undefined'? buildData($H3, 'hgroup', glink):'',
						content!=''? thisContent.push('"t1":'+content):'',
						$content = $tips.find('p.tip-message'),
						typeof $content[0]!='undefined'?thisContent.push('"m":"'+$content.html()+'"'):'',
						pType?(
							$content = $tips.find('p.play-type'),
							typeof $content[0]!='undefined'?thisContent.push('"tp":"'+$content.html()+'"'):''
						):'',
						tipsBtn ? (
							$content = $tips.find('p.tip-btns'),
							content = typeof $content[0]!='undefined'?buildData($content, 'btn', glink):'',
							content!=''? thisContent.push('"b_":'+content):''
						):'',
						$content = $tips.find('p.other-titles'),
						content = typeof $content[0]!='undefined'?buildData($content, 'ot', glink):'',
						content!=''? thisContent.push('"ot":'+content):''
					):'';
				}
			}
			thisContent.push('}');
			content = thisContent.join(",").replace(/{,/g,"{").replace(/,}/g,"}").replace(/\[,/g,"[").replace(/,]/g,"]").replace(/:,/g,":");
			mainData.push(content);
		}
		a.data = '['+mainData.join(",")+']';
		//$('#build-data').html(a.data);
		a.data?	$t._updateImageShown(a):'';
	}
})