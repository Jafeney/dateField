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
				month:new Date().getMonth()
			};
		var today=new Date();

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
			var _body=$("<div class='dateField-body'>"+self.getDay(today.getMonth())+"</div>");
			var _footer=$("<div class='dateField-footer'><span class='btn dateField-footer-close'>关闭</span></div>");
			_container.append(_header).append(_body).append(_footer);
			_self.parent().append(_container);
			_self.parent().find('.dateField-container').show();

			/*do callback*/
			if(callback) callback();
		});

		/*some functions*/
		self.getDay=function(month){
			var _year=2015,
				_month=8;
			var firstDay=new Date('2014/12/01').getDay();
			var dateObj={};
			var returnStr='';
			returnStr+="<ul class='dateField-body-days'>";

			for(var i=1;i<=42;i++){
				if(i%7===0){
					returnStr+="<li class='dateField-day last'>"+self.filterDay(i-6)+"</li>";
				}else{
					returnStr+="<li class='dateField-day'>"+self.filterDay(i-6)+"</li>";
				}
			}
			returnStr+="</ul>";
			return returnStr;
		}
		self.filterDay=function(day){
			if(day<=0 || day>31) {
				return '';
			}else{
				return day;
			}
		}
		self.isPinYear=function(year){
			var bolRet = false;
			if (0==year%4&&((year%100!=0)||(year%400==0))) {
			bolRet = true;
			}
			return bolRet;
		}
		self.getMonthDays=function(year,month){
			var c=m_aMonHead[month-1];
			if((month==2)&&isPinYear(year)) c++;
			return c;
		}

		/*select day*/
		_parent.on('click','.dateField-day',function(){
			if($(this).text()!==''){
				$('.dateField-day').removeClass('active');
				$(this).addClass('active');
				_self.val($(this).parent().parent().siblings().find('.dateField-header-datePicker').text().replace(/[\u4e00-\u9fa5]/g,'-')+$(this).text());
				_self.parent().find('.dateField-container').remove();

				/*template code： just for this page*/
				$('#check-birthday').removeClass('fail').hide();
			}
		});

		/*go to prev month*/
		_parent.on('click','.dateField-header-btn-left',function(){
			_nowDate.month--;
			if(_nowDate.month===0){
				_nowDate.year--;
				_nowDate.month=12;
			}
			$(this).siblings('.dateField-header-datePicker').text(_nowDate.year+'年'+_nowDate.month+'月');
		});

		/*go to next month*/
		_parent.on('click','.dateField-header-btn-right',function(){
			_nowDate.month++;
			if(_nowDate.month===13){
				_nowDate.year++;
				_nowDate.month=1;
			}
			$(this).siblings('.dateField-header-datePicker').text(_nowDate.year+'年'+_nowDate.month+'月');
		});

		/*select month*/

		/*close the dateFiled*/
		_parent.on('click','.dateField-footer-close',function(){
			$(this).parent().parent().remove();
		});
		/*click other filed to close the dateField*/
		//I don't know

		return _self;
	}
});
