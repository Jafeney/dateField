/*
 * jquery extend: dateField
 * author:jafeney
 * createTime:2015-8-28
 */

jQuery.fn.extend({
	dateField:function(options,callback){
		var self=this,
			_self=$(this),
			_eventType=options.eventType || 'click',
			_style=options.style || 'default',
			_parent=$(this).parent(),
			_nowDate={
				year:new Date().getFullYear(),
				month:new Date().getMonth()+1
			},
			_switchState=0; 
		var daysArray=[31,28,31,30,31,30,31,31,30,31,30,31];

		/*init*/
		_self.on(_eventType,function(){
			/*before use this extend,the '_self' must have a container*/
			_self.parent().css('position','relative');

			/*create element as dateField's container*/
			var _container=$("<div class='dateField-container'></div>");
			var _header=$("<div class='dateField-header'>"
					+"<div class='dateField-header-btns'>"
					+"<span class='btn dateField-header-btn-left'>«</span>"
					+"<span class='btn dateField-header-datePicker'>"+_nowDate.year+"年"+_nowDate.month+"月</span>"
					+"<span class='btn dateField-header-btn-right'>»</span>"
					+"</div>"
					+"<ul class='dateField-header-week'><li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li></ul>"
					+"</div>");
			var _body=$("<div class='dateField-body'>"+self.getDays(_nowDate.year,_nowDate.month)+"</div>");
			var _footer=$("<div class='dateField-footer'><span class='btn dateField-footer-close'>关闭</span></div>");
			_container.append(_header).append(_body).append(_footer);
			_self.parent().append(_container);
			_self.parent().find('.dateField-container').show();

			/*do callback*/
			if(callback) callback();
		});

		/*some functions*/
		/*get any year and any month's days into a list*/
		self.getDays=function(year,month){
			var _monthDay=self.getMonthDays(year,month);
			var _firstDay=new Date(year+'/'+month+'/'+'01').getDay();  //get this month's first day's weekday
			var returnStr='';
			returnStr+="<ul class='dateField-body-days'>";
			for(var i=1;i<=42;i++){
				if(i<=_monthDay+_firstDay){
					if(i%7===0){
						returnStr+="<li class='dateField-select select-day last'>"+self.filterDay(i-_firstDay)+"</li>";
					}else{
						returnStr+="<li class='dateField-select select-day'>"+self.filterDay(i-_firstDay)+"</li>";
					}
				}else{
					if(i%7===0){
						returnStr+="<li class='dateField-select select-day last'></li>";
					}else{
						returnStr+="<li class='dateField-select select-day'></li>";
					}
				}
			}
			returnStr+="</ul>";
			return returnStr;
		}
		/*filter days*/
		self.filterDay=function(day){
			if(day<=0 || day>31) {
				return '';
			}else{
				return day;
			}
		}
		/*judge any year is LeapYear*/
		self.isLeapYear=function(year){
			var bolRet = false;
			if (0===year%4&&((year%100!==0)||(year%400===0))) {
				bolRet = true;
			}
			return bolRet;
		}
		/*get any year and any month's full days*/
		self.getMonthDays=function(year,month){
			var c=daysArray[month-1];
			if((month===2) && self.isLeapYear(year)) c++;
			return c;
		}
		/*get this year's months*/
		self.getMonths=function(){
			var returnStr="";
			returnStr="<ul class='dateField-body-days dateField-body-months'>";
			for(var i=0;i<12;i++){
				if((i+1)%3===0){
					returnStr+="<li class='dateField-select select-month last' data-month='"+(i+1)+"'>"+self.switchMonth(i)+"</li>";
				}else{
					returnStr+="<li class='dateField-select select-month' data-month='"+(i+1)+"'>"+self.switchMonth(i)+"</li>";
				}
			}
			returnStr+='</ul>';
			return returnStr;
		}
		/*get siblings 12 years*/
		self.getYears=function(year){
			var returnStr="";
			returnStr="<ul class='dateField-body-days dateField-body-years'>";
			for(var i=0;i<12;i++){
				if((i+1)%3===0){
					returnStr+="<li class='dateField-select select-year last' data-year='"+(year+i)+"'>"+(year+i)+"</li>";
				}else{
					returnStr+="<li class='dateField-select select-year' data-year='"+(year+i)+"'>"+(year+i)+"</li>";
				}
			}
			returnStr+='</ul>';
			return returnStr;	
		}
		/*switch month number to chinese*/
		self.switchMonth=function(number){
			var monthArray=['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
			return monthArray[number];
		}

		/*go to prev month*/
		_parent.on('click','.dateField-header-btn-left',function(){
			switch(_switchState){
				/*prev month*/
				case 0:
					_nowDate.month--;
					if(_nowDate.month===0){
						_nowDate.year--;
						_nowDate.month=12;
					}
					$(this).siblings('.dateField-header-datePicker').text(_nowDate.year+'年'+_nowDate.month+'月');
					$('.dateField-header-week').show();
					$('.dateField-body').html(self.getDays(_nowDate.year,_nowDate.month));
					break;
				/*next 12 years*/
				case 2:
					_nowDate.year-=12;
					$('.dateField-body').html(self.getYears(_nowDate.year));
					break;
				default:
					break;
			}
		});

		/*go to next month*/
		_parent.on('click','.dateField-header-btn-right',function(){
			switch(_switchState){
				/*next month*/
				case 0:
					_nowDate.month++;
					if(_nowDate.month===13){
						_nowDate.year++;
						_nowDate.month=1;
					}
					$(this).siblings('.dateField-header-datePicker').text(_nowDate.year+'年'+_nowDate.month+'月');
					$('.dateField-header-week').show();
					$('.dateField-body').html(self.getDays(_nowDate.year,_nowDate.month));
					break;
				/*next 12 years*/
				case 2:
					_nowDate.year+=12;
					$('.dateField-body').html(self.getYears(_nowDate.year));
					break;
				default:
					break;
			}
		});

		/*switch choose year or month*/
		_parent.on('click','.dateField-header-datePicker',function(){
			switch(_switchState){
				case 0:
					/*switch month select*/
					$('.dateField-header-week').hide();
					$('.dateField-body').html(self.getMonths());
					_switchState=1;
					break;
				case 1:
					/*switch year select*/
					$('.dateField-body').html(self.getYears(_nowDate.year));
					_switchState=2;
					break;
				default:
					break;
			}
		});
		
		/*select a year*/
		_parent.on('click','.dateField-select.select-year',function(){
			if($(this).text()!==''){
				$('.dateField-select.select-month').removeClass('active');
				$(this).addClass('active');
				_nowDate.year=$(this).data('year');
				$(this).parent().parent().siblings().find('.dateField-header-datePicker').text(_nowDate.year+'年'+_nowDate.month+'月');
				$('.dateField-header-week').hide();
				$('.dateField-body').html(self.getMonths());
				_switchState=1;
			}
		});

		/*select a month*/
		_parent.on('click','.dateField-select.select-month',function(){
			if($(this).text()!==''){
				$('.dateField-select.select-month').removeClass('active');
				$(this).addClass('active');
				_nowDate.month=$(this).attr('data-month');
				$(this).parent().parent().siblings().find('.dateField-header-datePicker').text(_nowDate.year+'年'+_nowDate.month+'月');
				$('.dateField-header-week').show();
				$('.dateField-body').html(self.getDays(_nowDate.year,_nowDate.month));
				_switchState=0;
			}
		});

		/*select a day*/
		_parent.on('click','.dateField-select.select-day',function(){
			if($(this).text()!==''){
				$('.dateField-select.select-day').removeClass('active');
				$(this).addClass('active');
				_self.val($(this).parent().parent().siblings().find('.dateField-header-datePicker').text().replace(/[\u4e00-\u9fa5]/g,'-')+$(this).text());
				_self.parent().find('.dateField-container').remove();

				/*template code： just for this page*/
				$('#check-birthday').removeClass('fail').hide();
			}
		});

		/*close the dateFiled*/
		/*click other field to close the dateField (outclick event)*/
		$(document).on('click',function(e){
			if($(e.target).hasClass('dateField-container') || $(e.target).hasClass('dateField-header-btn-left') || $(e.target).hasClass('dateField-header-datePicker') || $(e.target).hasClass('dateField-header-btn-right') || $(e.target).hasClass('dateField-select') || $(e.target)[0].id=='input-date'){
				;
			}else{
				$('.dateField-container').hide();
				_switchState=0;
			}
		});

		return self;
	}
});
