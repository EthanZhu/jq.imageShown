$.fn.extend($.imageShown,{_buildImageShown:function(target,name,value){var $t=this,a=$t._getInst(target);a.build=!0;var $l=a.$elem.find("li."+$t._g(a,"_item")),$p=a.$elem.find("li."+$t._g(a,"_pitem")),mainData=[];if(typeof $l[0]=="undefined"&&typeof $p[0]=="undefined")return;$t._optionImageShown(target,name,value),$t._g(a,"preload")?$t._extendRemove(a.settings,{preload:!1}):"";var player,mainLength;player=$t._g(a,"player"),typeof $p[0]!="undefined"?mainLength=$p.length:player?(player=!1,$t._extendRemove(a.settings,{player:!1})):"",typeof $l[0]!="undefined"?mainLength=$l.length:$t._g(a,"tContent")=="image"?$t._extendRemove(a.settings,{tContent:"none"}):"";if(typeof $l[0]=="undefined"&&!player)return;var n=$t._g(a,"tContent"),p=$t._g(a,"pContent"),glink,$thisNav,content,$thisPlay,$navContent,$playContent,$H2,$H3,$tips,tips=$t._g(a,"showTips"),buildData=function(a,b,c,d){typeof c[0]!="undefined"?(c=c.html(),c.charAt(c.length-1)!="/"?c+="/":""):"";if(d=="play"||b!="num"&&b!="none"){var e,f,g,h,i,j=[],k,l;if(b!="hgroup"&b!="btn"&&b!="ot")return e=a.find("a:first"),f=a.find("img"),h=e[0],i=f[0],j.push("{"),typeof h!="undefined"&&b!="content"&&(l=h.href,l.charAt(l.length-1)!="/"?l+="/":"",l!=c?(j.push('"l":"'+h.href+'"'),h.target?j.push('"t":"'+h.target+'"'):""):""),b=="content"?j.push('"p":"'+a.html()+'"'):typeof i!="undefined"?(j.push('"p":"'+i.src+'"'),i.alt?j.push('"a":"'+i.alt+'"'):"",d!="play"?(i.width?j.push('"w":"'+i.width+'"'):"",i.height?j.push('"h":"'+i.height+'"'):""):""):"",j.push("}"),j.join(",");if(b=="hgroup")return e=a.find("a:first"),h=e[0],f=typeof h!="undefined"?e.html():a.html(),typeof h!="undefined"?(j.push("{"),j.push('"t":"'+f+'"'),l=h.href,l.charAt(l.length-1)!="/"?l+="/":"",l!=c?(j.push('"l":"'+h.href+'"'),h.target?j.push('"g":"'+h.target+'"'):""):"",j.push("}")):j.push('"'+f+'"'),j.join(",");if(b=="btn"){e=a.find("a"),f=e[0];if(typeof f!="undefined"){g=e.length,g==1?"":j.push("[");for(k=0;k<g;k++)j.push("{"),h=e.eq(k),i=h[0],l=i.href,i.className!=""?j.push('"c":"'+i.className+'"'):"",l.charAt(l.length-1)!="/"?l+="/":"",l!=c?(j.push('"l":"'+l+'"'),i.target?j.push('"g":"'+i.target+'"'):"",i.title?j.push('"t":"'+i.title+'"'):""):"",h.html()!=""?j.push('"t_":"'+h.html()+'"'):"",j.push("}");g==1?"":j.push("]")}else e=a.html(),e!=""?j.push('"'+e+'"'):"";return j.join(",")}if(b=="ot"){var m,n=a.length;n==1?"":j.push("[");for(m=0;m<n;m++){e=a.eq(m),e=e.find("span"),f=e[0],f=typeof f!="undefined"?e.html():"",j.push("{"),j.push('"n":"'+f+'"'),e=a.eq(m).find("a"),f=e[0];if(typeof f!="undefined"){j.push('"list":'),g=e.length,g==1?"":j.push("[");for(k=0;k<g;k++)j.push("{"),h=e.eq(k),i=h[0],l=i.href,h.html()!=""?(j.push('"t":"'+h.html()+'"'),l.charAt(l.length-1)!="/"?l+="/":"",l!=c?(j.push('"l":"'+l+'"'),i.target?j.push('"g":"'+i.target+'"'):""):""):"",j.push("}");g==1?"":j.push("]")}j.push("}")}n==1?"":j.push("]")}return j.join(",")}return'""'},pType=$t._g(a,"pType"),tipsBtn=$t._g(a,"tipsBtn");for(i=0;i<mainLength;i++){var thisContent=[];thisContent.push("{"),typeof $l[0]!="undefined"?$thisNav=$l.eq(i):"",typeof $p[0]!="undefined"?$thisPlay=$p.eq(i):"",$thisNav&&(glink=$thisNav.find("p.global-link"),typeof glink[0]!="undefined"?thisContent.push('"l":"'+glink.html()+'"'):"",$content=$thisNav.find("p.this-content"),content=typeof $content[0]!="undefined"?buildData($content,n,glink):'""',thisContent.push('"s":'+content)),$thisPlay&&player&&(!glink||typeof glink[0]=="undefined"?(glink=$thisPlay.find("p.global-link"),typeof glink[0]!="undefined"?thisContent.push('"l":"'+glink.html()+'"'):""):"",$content=$thisPlay.find("p.this-content"),content=typeof $content[0]!="undefined"?buildData($content,n,glink,"play"):'""',thisContent.push('"b":'+content),tips&&($tips=$thisPlay.find("label"),$H2=$tips.find("h2"),$H3=$tips.find("h3"),typeof $thisPlay[0]!="undefined"?(content=typeof $H2[0]!="undefined"?buildData($H2,"hgroup",glink):"",content!=""?thisContent.push('"t":'+content):"",content=typeof $H3[0]!="undefined"?buildData($H3,"hgroup",glink):"",content!=""?thisContent.push('"t1":'+content):"",$content=$tips.find("p.tip-message"),typeof $content[0]!="undefined"?thisContent.push('"m":"'+$content.html()+'"'):"",pType?($content=$tips.find("p.play-type"),typeof $content[0]!="undefined"?thisContent.push('"tp":"'+$content.html()+'"'):""):"",tipsBtn?($content=$tips.find("p.tip-btns"),content=typeof $content[0]!="undefined"?buildData($content,"btn",glink):"",content!=""?thisContent.push('"b_":'+content):""):"",$content=$tips.find("p.other-titles"),content=typeof $content[0]!="undefined"?buildData($content,"ot",glink):"",content!=""?thisContent.push('"ot":'+content):""):"")),thisContent.push("}"),content=thisContent.join(","),mainData.push(content)}thisData=mainData.join(",").replace(/([{\[:]),/g,"$1").replace(/,([}\]])/g,"$1"),$t.debug?$("<div />").css("padding","30px").html("Builded data:<br/>["+thisData+"]").prependTo($("body")):"";var thisData=eval("["+thisData+"]");a.data=[];var thisLength=thisData.length,self;for(var i=0;i<thisLength;i++)self=thisData[i],$t._isEmptyObject(self)||a.data.push(self);a.data?$t._updateImageShown(a):""}})