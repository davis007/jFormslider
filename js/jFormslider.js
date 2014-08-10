/*
**************************************
******jFormsliderv 1.0.2**************
******jFormslider.js******************
******Created by Harish U Warrier*****
******Created on 08-06-2014***********
******Modified on 08-08-2014**********
******huwz1it@gmail.com***************
**************************************
*/
if("undefined"==typeof jQuery)
{
	if('undefined'!==typeof console)
	{
	
		console.log('%c Sorry!!There is no jquery please get jquery ','color: red');
		
	}else
	{
		throw new Error("Sorry!!There is no jquery please get jquery");
	}
}
$.fn.jFormslider=function(options)
{
	var $this=$(this);
	var lilength=$this.find('li').length;
	var randomid='jformslider'+new Date().valueOf();
	var defaults=
	{
		width:600,
		height:300,
		next_prev:true,
		submit_btn:true,
		submit_class:'',
		next_class:'',
		prev_class:'',
		nav_class:'',
		error_class:'error',
		error_element:true,
		error_position:'',
		texts:{
				next:'next',
				prev:'prev',
				submit:'submit'
			  },
		speed:400,
		bootstrap:false,
		full_navigation:true,
		ajax:false,
		validation:true,
		disabletab:true,
	}
	if(arguments.length>0)
	{
		var text=$.extend(defaults.texts,options.texts);
		options=$.extend(defaults,options);
		options.texts=text;
			
	}else
	{
		options=defaults;
	}
	var msgspan='<div class="'+options.error_class+'" id="'+randomid+'" style="display:none"></div>';
	var next_button='<a class="'+options.next_class+'" next style="float:right">'+options.texts.next+'</a>';
	var prev_button='<a class="'+options.prev_class+'" prev style="float:left">'+options.texts.prev+'</a>';
	var width=options.width;
	var height=options.height;
	var widthpc=width*lilength*100;
	var errorspan="";
	var errorclasses=splitclass($.trim(options.error_class));
	var error_selector='.'+errorclasses.join('.');
	var submit_element="";
	if(options.submit_btn)
	{
		submit_element='<button type="submit" class="'+options.submit_class+'"  style="float:right">'+options.texts.submit+'</button>';
		
	}
		if(options.error_element)
		{
			if(options.error_position=="inside")
			{
				errorspan="<span class='"+options.error_class+"' style='display:none'></span>";
			}else
			{
			
				$(this).after(msgspan);
			}
		
		}else
		{
		errorspan="";
		
		}
	
	
	var navigation_div='<div class="'+options.nav_class+'">'+prev_button+errorspan+next_button+'</div>';
	var divcss=
	{
		"width":width+"px",
		"height":height+"px",
		"overflow":"hidden",
	};
	var ulcss=
	{
		"margin":"0",
		"padding":"0",
		"list-style":"none",
		"width":widthpc+"%",
	};
	var licss=
	{
		"display":"inline",
		"float":"left",
		"width":width+"px",
	};
	$(this).css(divcss);
	$(this).find('ul').css(ulcss);
	$(this).find('li').css(licss);
	
	if($(this).find('li:first').hasAttr('call-before'))
		{
			var func=$(this).find('li:first').attr('call-before');
			eval(func);		
		}
	
	if(options.next_prev)
	{
		$(this).find('li').each(function(index,element){
			var errspan=errorspan;
			var nav_div=navigation_div;
			
			if($(this).find(error_selector).length>=1)
			{
				errspan="";
				nav_div='<div class="'+options.nav_class+'">'+prev_button+next_button+'</div>';
			}			
			if(index==0 || $(this).hasAttr('no-prev'))
			{
				$(this).append('<div class="'+options.nav_class+'">'+next_button+errspan+'</div>');
			}else if(index==lilength-1 || $(this).hasAttr('no-next'))
			{
				if(index==lilength-1)
				{
					$(this).append('<div class="'+options.nav_class+'">'+errspan+prev_button+submit_element+'</div>');
				}else
				{
					$(this).append('<div class="'+options.nav_class+'">'+errspan+prev_button+'</div>');
				}				
			
			}else if(!$(this).hasAttr('no-next-prev'))
			{
				$(this).append(nav_div);
			}
			
		
		});
	}else
	{
		$(this).find('li').each(function(index,element){
			var errspan=errorspan;
			if($(this).find(error_selector).length>=1)
			{
				errspan="";
			}			
		
			$(this).append('<div class="">'+errspan+'</div>');
				
		});
	
	}
	
	$(this).find('li').each(function(index,element){
		
		$(this).find('input,select').last().keydown(function(e) {
			
			if(e.which==9 )
			{	if(options.disabletab)
				return false;
			}
		});
					
	});	

	$(this).find('[number]').keydown(function(e){ 
					
		var numberarray=[96,97,98,99,100,101,102,103,104,105,109,189,8,46,48,49,50,51,52,53,54,55,56,57,9,16]
						
		if($.inArray(e.keyCode,numberarray)==-1)
		{	if(options.validation)
			e.preventDefault();
			
		}
		if(e.keyCode>=65 && e.keyCode<=90)
		{
			if(options.validation)
			e.preventDefault();
			
		}
	});	
	//disable shift tab
	$("body").keydown(function(e){
		
		if(e.which==9 && e.shiftKey)
		{ console.log('as');
			if(e.target.nodeName=="INPUT")
			{
				var id=e.target.id;
				$(e.target).parents('li').find('input').each(function(index, element) {
				   
				   if($(this).attr('id')==id)
					{
						$(e.target).parents('li').find('input:eq('+(index-1)+')').focus();
						return false;
					}
				});
			}
			return false;
		}
	});
	
	$('[prev]').click(function(e){
		
		e.preventDefault();
		$this.prevSlide();
		
	});
	$('[next]').click(function(e){
		
		e.preventDefault();
		$this.nextSlide();
	});
	$.fn.nextSlide=function(){
		var current_slide=$(this).get_current_slide();
		var next_slide=$(this).get_next_slide();
		var slidestart=false;
		if(options.validation)
		{
			current_slide.find('input[required],select[required],input[email]').each(function(index,element){
				if($(this).hasAttr('required'))
				{
					if($.trim($(this).val())=='')
					{
						var msg=$(this).hasAttr('data-msg')?$(this).attr('data-msg'):'Please fill this field';
						if(options.error_position=="inside")
						{
							current_slide.find(error_selector).html(msg).show();
						}else
						{
							
							$('#'+randomid).html(msg).show();
						
						}
						
						$(this).focus();
						slidestart=false;
						return false;
					}
				}
				
				if($(this).hasAttr('email'))
				{
					if(!emailvalid($.trim($(this).val())))
					{
						if(options.error_position=="inside")
						{
							current_slide.find(error_selector).html('Please Enter a valid email').show();
						}else
						{
							
							$('#'+randomid).html('Please Enter a valid email').show();
						
						}
						
						$(this).focus();
						slidestart=false;
						return false;
					}
				}
				if($(this).is('select'))
				{
					if($.trim($(this).val())=='-1')
					{
						var msg=$(this).hasAttr('data-msg')?$(this).attr('data-msg'):'Please fill this field';
						if(options.error_position=="inside")
						{
							current_slide.find(error_selector).html(msg).show();
						}else
						{
							
							$('#'+randomid).html(msg).show();
						
						}
						
						$(this).focus();
						slidestart=false;
						return false;
					}
				}
				if(options.error_position=="inside")
				{
					current_slide.find(error_selector).html('').hide();
				}else
				{
					
					$('#'+randomid).html('').hide();
				
				}
				slidestart=true;
			
					
			});
		}else
		{
			slidestart=true;
		}
		if(current_slide.find('input[required],select[required],input[email]').length<=0)
		{
			slidestart=true;
		}		
		if(slidestart)	
		{	
				if(next_slide.hasAttr('call-before'))
				{
					var func=next_slide.attr('call-before');
					if(!eval(func))
					{
						slidestart=false;
						return false;
					}else
					{
						slidestart=true;
					}
					
				}else
				{
					slidestart=true;
				}	
		}
		if(slidestart)
		{
			var px=Number($(this).find('ul').css('margin-left').replace("px",""));
			px-=width;
			$(this).find('ul').animate({ marginLeft: px+'px' }, options.speed);
		}
	
	};
	
	$.fn.prevSlide=function(){
		
		var px=Number($(this).find('ul').css('margin-left').replace("px",""));
		px+=width;
		$(this).find('ul').animate({ marginLeft: px+'px' }, options.speed);
		
	};
	$.fn.gotoSlide= function(slideid){
		
			var count=0;
			var found=false;
			$(this).find('li').filter(':visible').each(function(index, element) {
				
				count++;
				if($(this).hasAttr('data-id'))
				{
					if($(this).attr('data-id')==$.trim(slideid))
					{
						found=true;
						return false;
					}
				}
			});
			
			var go_to=(count-1)*width;	
			var px='-'+go_to+'px';
			if(found)
			{
				$(this).find('ul').animate({ marginLeft:px }, options.speed);
			}else
			{
				message('nodataid');
			}
			
	};
	message('startup');
	$.fn.get_current_slide= function(){
		var px=Number($this.find('ul').css('margin-left').replace("px",""));
		var slide=-px/width;
		var slcount=-1;
		var current='';
		$this.find('li').filter(':visible').each(function(index, element) {
				slcount++;
				if(slcount==slide)
				{
					current=$(this);
					return false;
				}
		});
		if(current=="")
		{
			message('unknown');
		}else
		{
			return current;		
		}
	}
	$.fn.get_next_slide= function(){
		var px=Number($this.find('ul').css('margin-left').replace("px",""));
		var slide=-px/width;
		var slcount=-2;
		var current='';
		$this.find('li').filter(':visible').each(function(index, element) {
				slcount++;
				if(slcount==slide)
				{
					current=$(this);
					return false;
				}
		});
		if(current=="")
		{
			message('unknown');
		}else
		{
			return current;		
		}
	}
	$.fn.get_prev_slide= function(){
		var px=Number($this.find('ul').css('margin-left').replace("px",""));
		var slide=-px/width;
		var slcount=0;
		var current='';
		$this.find('li').filter(':visible').each(function(index, element) {
				slcount++;
				if(slcount==slide)
				{
					current=$(this);
					return false;
				}
		});
		if(current=="")
		{
			message('unknown');
		}else
		{
			return current;		
		}
	}
	$.fn.disableTab=function()
	{ 
		$(this).keydown(function(e) {
			
			if(e.which==9 )
			{
				return false;
			}
		});
	}
	
	$.fn.get_page_nos=function()
	{
		var px=Number($this.css('margin-left').replace("px",""));
		var slide_nos=(-px/790)+1;
		var count=1;
		var did='';
		count=lilength;
		var pages={current:slide_nos,total:count};
		return pages;
	}
	function form_message()
	{
	
	}
	function message(type)
	{
		var msg='';
		var style=""
		switch(type)
		{
			case 'startup':msg='%c Congratulations!!!  You are using %cjFormslider v 1.1';
						  style='color: green';
						  if('undefined'!==typeof console)
							{
								console.log(msg,style,'font-style:italic;font-size:15px;font-weight:bold;'+style);
							}
						  break;
			case 'nodataid':msg='%c No %c"data-id" %cdefined; Please define a %c"data-id" %cin a li to use function %c"gotoSlide()" ';
						  style='color: red';
						  style1=style+';font-style:italic;font-size:15px;font-weight:bold;';
						  if('undefined'!==typeof console)
							{
								console.log(msg,style,style1,style,style1,style,style1);
							}
						  break;
			case "nojquery":
						  msg='%c Sorry!!There is no jquery please get jquery ';
						  style='color: red';
						    if('undefined'!==typeof console)
							{
								console.log(msg,style);
							}else
							{
								throw new Error("Sorry!!There is no jquery please get jquery");
							}
			
						break;	
			case 'unknown':msg='%c Sorry!! Some Unknown Error Occured.Please try again ';
						  style='color: red';
						  style1=style+';font-style:italic;font-size:15px;font-weight:bold;';
						  if('undefined'!==typeof console)
							{
								console.log(msg,style);
							}
						  break;					
		}
	}
	
	function emailvalid(email) 
	{
		var rexp = /\S+@\S+\.\S+/;
		return rexp.test(email);
	}
	
	function splitclass(str)
	{
		return str.split(/\s+/);
	}
	
	
	
};

/* Function to check attr*/
$.fn.hasAttr = function(name) 
{  
   	return this.attr(name) !== undefined;
};
