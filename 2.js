var comp = {};
var acsel = false;
var jetOn = false;
var keepCalm = true;

comp.prepare = function(rivalCar,CPU,rival){ //Приготовить к соревнованию

clearInterval(snowTimer);// выключить снег
ctx = document.getElementById('smokeCanv').getContext('2d');
ctx.clearRect(0,0,1000,1000);
jetOn=false;
$('#jetHelp').css('display','none');
$('#jetDiv').css('display','none');
$('#jetHelpDiv').css('display','none');

	comp.rival = {};
	comp.own = {};
//Данные об авто
	comp.own.car = JSON.parse(JSON.stringify(myCar));
	comp.own.car.pos.y+=comp.own.car.suspH; //Высота подвески
	comp.own.car.whPos.color = comp.own.car.ringColor;
	comp.own.car.whPos.yr-=comp.own.car.suspH;
	comp.own.car.whPos.yf-=comp.own.car.suspH;
	
	comp.rival.car = JSON.parse(JSON.stringify(rivalCar));
	comp.rival.car.pos.y+=comp.rival.car.suspH; //Высота подвески
	comp.rival.car.whPos.color = comp.rival.car.ringColor;
	comp.rival.car.whPos.yr-=comp.rival.car.suspH;
	comp.rival.car.whPos.yf-=comp.rival.car.suspH;
	comp.rival.car.whPos.xr+=comp.rival.car.whPos.dx;
	comp.rival.car.whPos.xf+=comp.rival.car.whPos.dx;
	
//Подготовка элементов кузова своего авто
	comp.own.x = 5 - imgs[comp.own.car.id+'Body'].width; //Положение в пространстве
	comp.own.suspTilt = 0; //Угол крена подвески
	
	var own_down_canv = document.createElement('canvas');//Нижний слой кузова
	own_down_canv.width = canvW;
	own_down_canv.height = canvH;
	var own_down_ctx = own_down_canv.getContext('2d');
	
	var own_body_canv = document.createElement('canvas');// Верхний слой кузова
	own_body_canv.width = canvW;
	own_body_canv.height = canvH;
	var own_body_ctx = own_body_canv.getContext('2d');
	
	var own_wheel_canv = document.createElement('canvas');// Слой колеса
	var own_wheel_ctx = own_wheel_canv.getContext('2d');
	var slip_own_wheel_canv = document.createElement('canvas');// Слой колеса
	var slip_own_wheel_ctx = slip_own_wheel_canv.getContext('2d');
	slip_own_wheel_ctx._slip = true;
	
	own_down_ctx.drawImage(imgs[comp.own.car.id+'Down'],0,0);
	//own_down_ctx.drawImage(imgs['shadow2'],-25, comp.own.car.whPos.yf+Math.round(comp.own.car.whPos.r/2)-5, imgs[car.id+'Down'].width+50, 60);
	own_body_ctx.drawImage(imgs[comp.own.car.id+'Body'],0,0);
	paintCar(comp.own.car.color, own_body_ctx ,comp.own.car.saturation,comp.own.car.lightnes);

	
	//НАНОСИМ ВИНИЛЫ _________________
	if(typeof(car.vinil)!='undefined'){
		//Наносим все винилы
			applyStickersInRace(car, own_body_canv);
	}
	
	//Полупрозрачная копия колеса
	comp.own.alphaWheel = document.createElement('canvas');
	comp.own.alphaWheel.width = imgs['w'+comp.own.car.rings.toString()].width;
	comp.own.alphaWheel.height = imgs['w'+comp.own.car.rings.toString()].height;
	comp.own.alphaWheelCtx = comp.own.alphaWheel.getContext('2d');
	comp.own.alphaWheelCtx.drawImage(imgs['w'+comp.own.car.rings.toString()],0,0);
	paintWheel(comp.own.car.whPos.color,0,0,own_wheel_ctx);// Покраска диска
	var imData = comp.own.alphaWheelCtx.getImageData(0,0,imgs['w'+comp.own.car.rings.toString()].width,imgs['w'+comp.own.car.rings.toString()].height);
	var data = imData.data;
	for(var i = 3; i<=data.length; i+=4)if(data[i]>50)data[i]=150;
	comp.own.alphaWheelCtx.putImageData(imData,0,0);
	
	
	own_body_ctx.drawImage(imgs[comp.own.car.id+'Light'],0,0);
	if(comp.own.car.jet>=0){
		own_body_ctx.drawImage(jet1,50,50);
	}
	//Прорисовка колес
	own_wheel_ctx.translate(Math.round(comp.own.car.whPos.r/2),Math.round(comp.own.car.whPos.r/2));
	own_wheel_ctx.drawImage(imgs['w'+comp.own.car.rings.toString()],-Math.round(comp.own.car.whPos.r/2),-Math.round(comp.own.car.whPos.r/2),comp.own.car.whPos.r,comp.own.car.whPos.r);
	paintWheel(comp.own.car.whPos.color,0,0,own_wheel_ctx);// Покраска диска
	slip_own_wheel_ctx.translate(Math.round(comp.own.car.whPos.r/2),Math.round(comp.own.car.whPos.r/2));
	slip_own_wheel_ctx.drawImage(imgs['w'+comp.own.car.rings.toString()],-Math.round(comp.own.car.whPos.r/2),-Math.round(comp.own.car.whPos.r/2),comp.own.car.whPos.r,comp.own.car.whPos.r);
	paintWheel(comp.own.car.whPos.color,0,0,slip_own_wheel_ctx);// Покраска диска
	
	//Записываем все в объект comp.own
	comp.own.body_ctx = own_body_ctx;
	comp.own.down_ctx = own_down_ctx;
	comp.own.wheel_ctx = own_wheel_ctx;
	comp.own.slip_wheel_ctx = slip_own_wheel_ctx;
	comp.own.body_canv = own_body_canv;
	comp.own.down_canv = own_down_canv;
	comp.own.wheel_canv = own_wheel_canv;
	comp.own.slip_wheel_canv = slip_own_wheel_canv;
	
//Подготовка элементов кузова СОПЕРНИКА
	comp.rival.x = 680; //Положение в пространстве
	comp.rival.suspTilt = 0; //Угол крена подвески
	
	var rival_down_canv = document.createElement('canvas');//Нижний слой кузова
	rival_down_canv.width = canvW;
	rival_down_canv.height = canvH;
	var rival_down_ctx = rival_down_canv.getContext('2d');
	
	var rival_body_canv = document.createElement('canvas');// Верхний слой кузова
	rival_body_canv.width = canvW;
	rival_body_canv.height = canvH;
	var rival_body_ctx = rival_body_canv.getContext('2d');
	
	var rival_wheel_canv = document.createElement('canvas');// Слой колеса
	var rival_wheel_ctx = rival_wheel_canv.getContext('2d');
	var slip_rival_wheel_canv = document.createElement('canvas');// Слой колеса
	var slip_rival_wheel_ctx = slip_rival_wheel_canv.getContext('2d');

	//Поворот изображений
	var canv = document.createElement('canvas');
	canv.width = imgs[comp.rival.car.id+'Body'].width;
	canv.height = imgs[comp.rival.car.id+'Body'].height;
	var ctx = canv.getContext('2d');
		//Прорисовка изображений на временном холсте
	ctx.drawImage(imgs[comp.rival.car.id+'Down'],0,0);
		//Поворот
	var w = imgs[comp.rival.car.id+'Body'].width;
	var h = imgs[comp.rival.car.id+'Body'].height;
	var imgData = ctx.getImageData(0,0,1,1);
	for(var x=w; x>=0; x--){
		imgData = ctx.getImageData(x,0,1,h);
		rival_down_ctx.putImageData(imgData,w-x,0);
	}
		//Прорисовка изображений на временном холсте
	ctx.clearRect(0,0,canvW,canvH);
	ctx.drawImage(imgs[comp.rival.car.id+'Body'],0,0);
	paintCar(comp.rival.car.color, ctx ,comp.rival.car.saturation,comp.rival.car.lightnes);
		
	//НАНОСИМ ВИНИЛЫ _________________
	if(typeof(comp.rival.car.vinil)!='undefined'){
		//Наносим все винилы
		applyStickersInRace(comp.rival.car, canv);
		
	}
	
	
	ctx.drawImage(imgs[comp.rival.car.id+'Light'],0,0);
	if(comp.rival.car.jet>=0){
		ctx.drawImage(jet1,50,50);
	}
		//Поворот
	for(x=w; x>=0; x--){
		imgData = ctx.getImageData(x,0,1,h);
		rival_body_ctx.putImageData(imgData,w-x,0);
	}
	
	//Прорисовка колес
	rival_wheel_ctx.translate(Math.round(comp.rival.car.whPos.r/2),Math.round(comp.rival.car.whPos.r/2));
	rival_wheel_ctx.drawImage(imgs['w'+comp.rival.car.rings.toString()],-Math.round(comp.rival.car.whPos.r/2),-Math.round(comp.rival.car.whPos.r/2),comp.rival.car.whPos.r,comp.rival.car.whPos.r);
	paintWheel(comp.rival.car.whPos.color,0,0,rival_wheel_ctx);// Покраска диска
	slip_rival_wheel_ctx.translate(Math.round(comp.rival.car.whPos.r/2),Math.round(comp.rival.car.whPos.r/2));
	slip_rival_wheel_ctx.drawImage(imgs['w'+comp.rival.car.rings.toString()],-Math.round(comp.rival.car.whPos.r/2),-Math.round(comp.rival.car.whPos.r/2),comp.rival.car.whPos.r,comp.rival.car.whPos.r);
	paintWheel(comp.rival.car.whPos.color,0,0,slip_rival_wheel_ctx);// Покраска диска
	
	//Записываем все в объект comp.rival
	comp.rival.body_ctx = rival_body_ctx;
	comp.rival.down_ctx = rival_down_ctx;
	comp.rival.slip_wheel_ctx = slip_rival_wheel_ctx;
	comp.rival.wheel_ctx = rival_wheel_ctx;
	comp.rival.body_canv = rival_body_canv;
	comp.rival.down_canv = rival_down_canv;
	comp.rival.slip_wheel_canv = slip_rival_wheel_canv;
	comp.rival.wheel_canv = rival_wheel_canv;
	
	//Очистка canvas'ов для Соревнования
	$("#carInfoDiv").html('');
	$("#otherDiv").html('');
	car3_ctx.clearRect(-translX,-translY,canvW,canvH);
	car2_ctx.clearRect(0,0,canvW,canvH);
	car1_ctx.clearRect(-translX,-translY,canvW,canvH);
	shadow_ctx.clearRect(0,0,canvW,canvH);
	rival3_ctx.clearRect(-translX,-translY,canvW,canvH);
	rival2_ctx.clearRect(0,0,canvW,canvH);
	rival1_ctx.clearRect(-translX,-translY,canvW,canvH);
	
	//rival info
	
	if(typeof(rival)!='undefined'){
		api.getRival(rival,function(){//Выводим инфо о сопернике
		 //Свое инфо
		 try{
			if(api.rival[0].photo=='https://vk.com/images/deactivated_50.png'){
				api.rival[0].last_name = 'Иванов';
				api.rival[0].first_name = 'Иван';
				//api.rival[0].photo = '';
			
			}
			$("#otherDiv").html("<div class='vsLeft'></div>");
			$(".vsLeft").html("<div><img style='float:left;' src='"+api_result.photo+"'>"+api_result.last_name+"<br>"+api_result.first_name+"</div>");
			$(".vsLeft").append("<br><font color='#d9cb2c'>Мощность: "+myCar.power+" л.с.</font>");
			$(".vsLeft").append("<br>Двигатель: "+myCar.engine);
			$(".vsLeft").append("<br>Турбо: "+myCar.turbo);
			$(".vsLeft").append("<br>КПП: "+myCar.transm);
			$(".vsLeft").append("<br>Подвеска: "+myCar.susp);
			$(".vsLeft").append("<br>Покрышки: "+myCar.tires);
			$(".vsLeft").append("<br>Выхлоп: "+myCar.exhaust);
		 //Инфо соперника
			$("#otherDiv").append("<div class='vsRight'></div>");
			$(".vsRight").html("<div><a target='_blank' href='//vk.com/id"+api.rival[0].uid+"'><img style='float:left;' src='"+api.rival[0].photo+"'></a>"+api.rival[0].last_name+"<br>"+api.rival[0].first_name+"</div>");
			$(".vsRight").append("<br><font color='#d9cb2c'>Мощность: "+rivalCar.power+" л.с.</font>");
			$(".vsRight").append("<br>Двигатель: "+rivalCar.engine);
			$(".vsRight").append("<br>Турбо: "+rivalCar.turbo);
			$(".vsRight").append("<br>КПП: "+rivalCar.transm);
			$(".vsRight").append("<br>Подвеска: "+rivalCar.susp);
			$(".vsRight").append("<br>Покрышки: "+rivalCar.tires);
			$(".vsRight").append("<br>Выхлоп: "+rivalCar.exhaust);
			//----------------------
		//Переключение передач
			
			$("#otherDiv").append("<div class='vsCenter'></div>");
			//$("#otherDiv .vsCenter").html('<div id="currentOwnGear">1</div>');
			//$("#otherDiv .vsCenter").append('<div id="scaleOwnRPM"><div id="currentOwnRPM">200</div></div>');
			$("#otherDiv .vsCenter").html("<div class='info'><b>Управление</b></div>");
			$("#otherDiv .vsCenter").append("<div class='info'><div class='btn'>&#8593;</div> Газ</div>");
			//$("#otherDiv .vsCenter").append("<div class='info'><div class='btn btn-left'>&#8592;</div><div class='btn btn-right'>&#8594;</div> Переключение передач</div>");
			$("#otherDiv .vsCenter").append("<div class='info'><div class='btn btn-ctrl'>ctrl</div> Реактивный двигатель</div>");
			
		//----------------------
		
		
		 }catch(e){console.log(e);}
			
		/*	vinilLoadAbort = function(){
				query={}; query.head='vinilLoadAbort';
				socket.send(JSON.stringify(query));
				$("#vinilLoadAbortDiv").hide();
				user.vinilLoadAbort=true;
			}
			if(typeof user.vinilLoadAbort=='undefined')
				$("#otherDiv").append('<div id="vinilLoadAbortDiv">Отключить винилы <div class="inviteOkNo" style="float: left; height: 16px;" title="Не загружать винилы соперника" onclick="javascript: vinilLoadAbort(); ">x</div></div>');
		*/		
		});
		
	}else{	//	play whith bot
	
	
		$("#otherDiv").html("<div class='vsLeft'></div>");
			$(".vsLeft").html("<div><img style='float:left;' src='"+api_result.photo+"'>"+api_result.last_name+"<br>"+api_result.first_name+"</div>");
			$(".vsLeft").append("<br><font color='#d9cb2c'>Мощность: "+myCar.power+" л.с.</font>");
			$(".vsLeft").append("<br>Двигатель: "+myCar.engine);
			$(".vsLeft").append("<br>Турбо: "+myCar.turbo);
			$(".vsLeft").append("<br>КПП: "+myCar.transm);
			$(".vsLeft").append("<br>Подвеска: "+myCar.susp);
			$(".vsLeft").append("<br>Покрышки: "+myCar.tires);
			$(".vsLeft").append("<br>Выхлоп: "+myCar.exhaust);
		 //Инфо соперника
			$("#otherDiv").append("<div class='vsRight'></div>");
			$(".vsRight").html("<div><a target='_blank' href='https://vk.com/tyaganina_group'><img style='float:left;' src='images/bot.jpg'></a>Просто<br>Я бот</div>");
			$(".vsRight").append("<br><font color='#d9cb2c'>Мощность: 1 ботская сила</font>");
			$(".vsRight").append("<br>Двигатель: "+myCar.engine);
			$(".vsRight").append("<br>Турбо: "+myCar.turbo);
			$(".vsRight").append("<br>КПП: "+myCar.transm);
			$(".vsRight").append("<br>Подвеска: "+myCar.susp);
			$(".vsRight").append("<br>Покрышки: "+myCar.tires);
			$(".vsRight").append("<br>Выхлоп: "+myCar.exhaust);
			
			$("#otherDiv").append("<div class='vsCenter'></div>");
			$("#otherDiv .vsCenter").html("<div class='info'><b>Управление</b></div>");
			$("#otherDiv .vsCenter").append("<div class='info'><div class='btn'>&#8593;</div> Газ</div>");
			$("#otherDiv .vsCenter").append("<div class='info'><div class='btn btn-ctrl'>ctrl</div> Реактивный двигатель</div>");

	}
	
	
	$("#blockMenu").css('display','block');
	comp.own_ready();
	comp.rival_ready();
	if(typeof(CPU)!='undefined' && CPU=='bot'){
		startTrafficLights();
		setTimeout(function(){comp.startBOT();},2000);
	}else if(typeof(CPU)!='undefined' && CPU=='cpu'){
		startTrafficLights();
		setTimeout(function(){comp.startCPU();},2000);
	}else{
		startTrafficLights();
		setTimeout(function(){if(race_key!=-777){comp.start();}else{race_key=0;}},2000);
	}
}

comp.own_ready = function(){//подготовка окончена,вывести свое авто
	car1_ctx.drawImage(comp.own.down_canv, comp.own.car.pos.x-translX+comp.own.x, comp.own.car.pos.y-translY);
	shadow_ctx.drawImage(imgs['shadow2'],comp.own.car.pos.x-shadowDelta+comp.own.x, comp.own.car.pos.y+comp.own.car.whPos.yf+Math.round(comp.own.car.whPos.r/2)-5, imgs[comp.own.car.id+'Down'].width+2*shadowDelta, 60);
	
	car2_ctx.drawImage(imgs.support, comp.own.car.pos.x+comp.own.car.whPos.xr+comp.own.x, comp.own.car.pos.y+comp.own.car.whPos.yr,comp.own.car.whPos.r,comp.own.car.whPos.r);
	car2_ctx.drawImage(imgs.support, comp.own.car.pos.x+comp.own.car.whPos.xf+comp.own.x, comp.own.car.pos.y+comp.own.car.whPos.yf,comp.own.car.whPos.r,comp.own.car.whPos.r);
	car2_ctx.drawImage(comp.own.wheel_canv, comp.own.car.pos.x+comp.own.car.whPos.xr+comp.own.x, comp.own.car.pos.y+comp.own.car.whPos.yr);
	car2_ctx.drawImage(comp.own.wheel_canv, comp.own.car.pos.x+comp.own.car.whPos.xf+comp.own.x, comp.own.car.pos.y+comp.own.car.whPos.yf);
	car3_ctx.drawImage(comp.own.body_canv,comp.own.car.pos.x-translX+comp.own.x,comp.own.car.pos.y-translY);
	//drawNightLights(comp.own.car);
}

comp.rival_ready = function(){//подготовка окончена,вывести авто
	rival1_ctx.drawImage(comp.rival.down_canv, comp.rival.car.pos.x-translX+comp.rival.x, comp.rival.car.pos.y-translY);
	shadow_ctx.drawImage(imgs['shadow2'],comp.rival.car.pos.x-shadowDelta+comp.rival.x, comp.rival.car.pos.y+comp.rival.car.whPos.yf+Math.round(comp.rival.car.whPos.r/2)-5, imgs[comp.rival.car.id+'Down'].width+2*shadowDelta, 60);
	
	rival2_ctx.drawImage(imgs.support, comp.rival.car.pos.x+comp.rival.car.whPos.xr+comp.rival.x, comp.rival.car.pos.y+comp.rival.car.whPos.yr, comp.rival.car.whPos.r, comp.rival.car.whPos.r);
	rival2_ctx.drawImage(imgs.support, comp.rival.car.pos.x+comp.rival.car.whPos.xf+comp.rival.x, comp.rival.car.pos.y+comp.rival.car.whPos.yf, comp.rival.car.whPos.r, comp.rival.car.whPos.r);
	rival2_ctx.drawImage(comp.rival.wheel_canv, comp.rival.car.pos.x+comp.rival.car.whPos.xr+comp.rival.x, comp.rival.car.pos.y+comp.rival.car.whPos.yr);
	rival2_ctx.drawImage(comp.rival.wheel_canv, comp.rival.car.pos.x+comp.rival.car.whPos.xf+comp.rival.x, comp.rival.car.pos.y+comp.rival.car.whPos.yf);
	rival3_ctx.drawImage(comp.rival.body_canv, comp.rival.car.pos.x-translX+comp.rival.x,comp.rival.car.pos.y-translY);

}

comp.own_move = function(dx, rpm){
	var wheelRPF  = (rpm/60/24)*0.3 //(rotatePerFrame)*peredChislo
	car3_ctx.clearRect(-translX,-translY,canvW,canvH+30);
	car2_ctx.clearRect(0,0,canvW,canvH);
	shadow_ctx.clearRect(0,0,canvW,canvH);
	car1_ctx.clearRect(-translX,-translY,canvW,canvH);
	
	comp.own.x+=dx;
	var l2rad = (Math.PI*2)/(Math.PI*comp.own.car.whPos.r);
	comp.rotateWheel(dx*l2rad, comp.own.wheel_ctx, comp.own.car);
	if(rpm==200){//Холостые, сцепление отключено
		comp.rotateWheel(dx*l2rad, comp.own.slip_wheel_ctx, comp.own.car);
	}else{//На оборотах
		comp.rotateWheel(2*Math.PI*wheelRPF, comp.own.slip_wheel_ctx, comp.own.car);
	}
	car1_ctx.drawImage(comp.own.down_canv, comp.own.car.pos.x-translX+comp.own.x, comp.own.car.pos.y-translY);
	shadow_ctx.drawImage(imgs['shadow2'],comp.own.car.pos.x-shadowDelta+comp.own.x, comp.own.car.pos.y+comp.own.car.whPos.yf+Math.round(comp.own.car.whPos.r/2)-5, imgs[comp.own.car.id+'Down'].width+2*shadowDelta, 60);
	shadow_ctx.drawImage(imgs['shadow2'],comp.rival.car.pos.x-shadowDelta+comp.rival.x, comp.rival.car.pos.y+comp.rival.car.whPos.yf+Math.round(comp.rival.car.whPos.r/2)-5, imgs[comp.rival.car.id+'Down'].width+2*shadowDelta, 60);
	
	car2_ctx.drawImage(imgs.support, comp.own.car.pos.x+comp.own.car.whPos.xr+comp.own.x, comp.own.car.pos.y+comp.own.car.whPos.yr,comp.own.car.whPos.r,comp.own.car.whPos.r);
	car2_ctx.drawImage(imgs.support, comp.own.car.pos.x+comp.own.car.whPos.xf+comp.own.x, comp.own.car.pos.y+comp.own.car.whPos.yf,comp.own.car.whPos.r,comp.own.car.whPos.r);
	if(comp.own.car.drive == 'r'){//Задний привод
		car2_ctx.drawImage(comp.own.slip_wheel_canv, comp.own.car.pos.x+comp.own.car.whPos.xr+comp.own.x, comp.own.car.pos.y+comp.own.car.whPos.yr);
		car2_ctx.drawImage(comp.own.wheel_canv, comp.own.car.pos.x+comp.own.car.whPos.xf+comp.own.x, comp.own.car.pos.y+comp.own.car.whPos.yf);
	}else{
	if(comp.own.car.drive == 'a'){//полный привод
		car2_ctx.drawImage(comp.own.slip_wheel_canv, comp.own.car.pos.x+comp.own.car.whPos.xr+comp.own.x, comp.own.car.pos.y+comp.own.car.whPos.yr);
		car2_ctx.drawImage(comp.own.slip_wheel_canv, comp.own.car.pos.x+comp.own.car.whPos.xf+comp.own.x, comp.own.car.pos.y+comp.own.car.whPos.yf);
	}else{//Задний привод
		car2_ctx.drawImage(comp.own.wheel_canv, comp.own.car.pos.x+comp.own.car.whPos.xr+comp.own.x, comp.own.car.pos.y+comp.own.car.whPos.yr);
		car2_ctx.drawImage(comp.own.slip_wheel_canv, comp.own.car.pos.x+comp.own.car.whPos.xf+comp.own.x, comp.own.car.pos.y+comp.own.car.whPos.yf);
	
	}
	}
	car3_ctx.drawImage(comp.own.body_canv,comp.own.car.pos.x-translX+comp.own.x,comp.own.car.pos.y-translY);
	if(typeof jetOn !='undefined' && jetOn==true && myCar.jet>0){
		rand = Math.floor(Math.random() * 4) + 1;
		car3_ctx.drawImage(flame[rand],comp.own.car.pos.x-translX+comp.own.x+7,comp.own.car.pos.y-translY+65);
		if(myCar.jet>0)myCar.jet-=0.1;
		if(myCar.jet<0)myCar.jet=0;
	}
	drawNightLights(comp.own.car, comp.own.x);
}

comp.rival_move = function(dx, rpm){
	var wheelRPF  = (rpm/60/24)*0.3 //(rotatePerFrame)*peredChislo
	rival3_ctx.clearRect(-translX,-translY,canvW,canvH);
	rival2_ctx.clearRect(0,0,canvW,canvH);
	rival1_ctx.clearRect(-translX,-translY,canvW,canvH);
	//shadow_ctx.clearRect(0,0,canvW,canvH);
	comp.rival.x+=dx;
	var l2rad = (Math.PI*2)/(Math.PI*comp.rival.car.whPos.r);
	comp.rotateWheel(dx*l2rad, comp.rival.wheel_ctx, comp.rival.car);//Катится
	
	if(rpm==200){//Холостые, сцепление отключено
		comp.rotateWheel(dx*l2rad, comp.rival.slip_wheel_ctx, comp.rival.car);//Буксует
	}else{//На оборотах
		comp.rotateWheel(-2*Math.PI*wheelRPF, comp.rival.slip_wheel_ctx, comp.rival.car);//Буксует
	}
	
	
	rival1_ctx.drawImage(comp.rival.down_canv, comp.rival.car.pos.x-translX+comp.rival.x, comp.rival.car.pos.y-translY);
	//shadow_ctx.drawImage(imgs['shadow2'],comp.rival.car.pos.x-shadowDelta+comp.rival.x, comp.rival.car.pos.y+comp.rival.car.whPos.yf+Math.round(comp.rival.car.whPos.r/2)-5, imgs[comp.rival.car.id+'Down'].width+2*shadowDelta, 60);
	
	rival2_ctx.drawImage(imgs.support, comp.rival.car.pos.x+comp.rival.car.whPos.xr+comp.rival.x, comp.rival.car.pos.y+comp.rival.car.whPos.yr,comp.rival.car.whPos.r,comp.rival.car.whPos.r);
	rival2_ctx.drawImage(imgs.support, comp.rival.car.pos.x+comp.rival.car.whPos.xf+comp.rival.x, comp.rival.car.pos.y+comp.rival.car.whPos.yf,comp.rival.car.whPos.r,comp.rival.car.whPos.r);
	if(comp.rival.car.drive == 'r'){//Задний привод
		rival2_ctx.drawImage(comp.rival.wheel_canv, comp.rival.car.pos.x+comp.rival.car.whPos.xr+comp.rival.x, comp.rival.car.pos.y+comp.rival.car.whPos.yr);
		rival2_ctx.drawImage(comp.rival.slip_wheel_canv, comp.rival.car.pos.x+comp.rival.car.whPos.xf+comp.rival.x, comp.rival.car.pos.y+comp.rival.car.whPos.yf);
	}else{
	if(comp.rival.car.drive == 'a'){//Полный привод
		rival2_ctx.drawImage(comp.rival.slip_wheel_canv, comp.rival.car.pos.x+comp.rival.car.whPos.xr+comp.rival.x, comp.rival.car.pos.y+comp.rival.car.whPos.yr);
		rival2_ctx.drawImage(comp.rival.slip_wheel_canv, comp.rival.car.pos.x+comp.rival.car.whPos.xf+comp.rival.x, comp.rival.car.pos.y+comp.rival.car.whPos.yf);
	}else{//Передний привод
		rival2_ctx.drawImage(comp.rival.slip_wheel_canv, comp.rival.car.pos.x+comp.rival.car.whPos.xr+comp.rival.x, comp.rival.car.pos.y+comp.rival.car.whPos.yr);
		rival2_ctx.drawImage(comp.rival.wheel_canv, comp.rival.car.pos.x+comp.rival.car.whPos.xf+comp.rival.x, comp.rival.car.pos.y+comp.rival.car.whPos.yf);
	}
	}
	rival3_ctx.drawImage(comp.rival.body_canv,comp.rival.car.pos.x-translX+comp.rival.x,comp.rival.car.pos.y-translY);
}

comp.rotateWheel = function (rad, ctx, car){
	rad = parseInt(rad*1000)/1000;
	
	ctx.clearRect(-Math.round(car.whPos.r/2),-Math.round(car.whPos.r/2),car.whPos.r,car.whPos.r);
	ctx.rotate(rad);
	
	if(typeof ctx._slip != 'undefined' && parseInt(Math.abs(rad))>0){//размытие
		ctx.drawImage(comp.own.alphaWheel,-Math.round(car.whPos.r/2),-Math.round(car.whPos.r/2),car.whPos.r,car.whPos.r);
		ctx.rotate(rad*0.3);
		ctx.drawImage(comp.own.alphaWheel,-Math.round(car.whPos.r/2),-Math.round(car.whPos.r/2),car.whPos.r,car.whPos.r);
		paintWheel(car.whPos.color,0,0,ctx);// Покраска диска

	}else{
		//ctx.drawImage(imgs['w'+car.rings.toString()],-Math.round(car.whPos.r/2),-Math.round(car.whPos.r/2),car.whPos.r,car.whPos.r);
		ctx.drawImage(imgs['w'+car.rings.toString()],-Math.round(car.whPos.r/2),-Math.round(car.whPos.r/2),car.whPos.r,car.whPos.r);
		paintWheel(car.whPos.color,0,0,ctx);// Покраска диска
		
	}
}

comp.own_tilt = function(absAngle){
	
	var angle = absAngle - comp.own.suspTilt;
	comp.own.suspTilt = absAngle;
	car3_ctx.clearRect(-translX,-translY,canvW,canvH+30);
	//car3_ctx.clearRect(comp.own.car.pos.x-translX,comp.own.car.pos.y-translY,imgs[comp.own.car.id+'Body'].width,imgs[comp.own.car.id+'Body'].height);
	car3_ctx.rotate(angle*(Math.PI/180));
	car1_ctx.clearRect(comp.own.car.pos.x-translX,comp.own.car.pos.y-translY,imgs[comp.own.car.id+'Body'].width,imgs[comp.own.car.id+'Body'].height);
	car1_ctx.rotate(angle*(Math.PI/180));
	car1_ctx.drawImage(imgs[comp.own.car.id+'Down'],comp.own.car.pos.x-translX,comp.own.car.pos.y-translY);
	car3_ctx.drawImage(imgs[comp.own.car.id+'Body'],comp.own.car.pos.x-translX,comp.own.car.pos.y-translY);
	paintCar(comp.own.car.color,car3_ctx);
	car3_ctx.drawImage(imgs[comp.own.car.id+'Light'],comp.own.car.pos.x-translX,comp.own.car.pos.y-translY);
	drawNightLights(comp.own.car, comp.own.x);
}

comp.start = function(){
 if(typeof compLoop=='undefined'){
	try{//Пробуем очищать таймеры
		clearTimeout(the45sTimOut);
		clearInterval(the15sTimer);
	}catch(e){}
	the45sTimOut = setTimeout(function(){//Таймер показать через 45 сек
		var timePass=15;
		$('#timerDiv').html(timePass);
		timePass--;
		the15sTimer = setInterval(function(){//Обратный отсчет
			$('#timerDiv').html(timePass);
			if(timePass>0){timePass--;}else{
				clearInterval(the15sTimer);
				query={}; query.head = 'theDraw';
				socket.send(JSON.stringify(query));
			}
		},1000);
		$('#timerDiv').css('display','block');
	},20000);
	
	transactionStep = 1; //Нужен для посылки запросов не 24разав сек, а реже
	transactionPerSec = 6; //Кол-во транзакций в секунду
	acsel = false; // Нажат ли газ
	jetOn = false; // Нажат ли газ
	var ownForce = 2000;
	ownRPM = 200;
	rivalRPM = 200; //Обороты двигателя об/мин
	rivalForce=2000; //Сила толкания
	var ownTireK = 1+(comp.own.car.tires)/10;//Коэфициент трения резины
	//if(comp.own.car.rings==76){ownTireK*=1.2;}
	
	//gears
	ownGear=1;
	gearK=[0,0.7,0.8,0.9,1];
	
	var power = testPower(comp.own.car);
	//console.log('power:',power);
	var maxRPM = power*10;
	var slipVector = 0;
	
		
	//SMOKE
	var fps=24, x=100, y=183, tacts=8*fps;
	ctx = document.getElementById('smokeCanv').getContext('2d');
	ctxUnd = document.getElementById('smokeCanvUnd').getContext('2d');
	
	var smokeF = function(){
		this.freze = false;
		this.partsBotLeft = [];
		this.partsBotRight = [];
		this.partsTop = [];
		this.balance = 0;
		this.wheelArches = getWheelArcsPos(comp.own.car.id);
		
		//инициализация частичек дыма
		for(var i=0; i<100; i++)this.partsBotLeft.push({active:false});
		for(var i=0; i<10; i++)this.partsBotRight.push({active:false});
		for(var i=0; i<100; i++)this.partsTop.push({active:false});
		
		this.step = function(n){
		
			ctx.clearRect(0,0,canvW,canvH);
			ctxUnd.clearRect(0,0,canvW,canvH);

			//--------------------------------------Прорисовываем дым под кузовом слева
			for(var i in this.partsBotLeft){	
				if(this.partsBotLeft[i].active){	//Двигаем, меняем прозрачность
					this.partsBotLeft[i].alpha-=0.007;
					this.partsBotLeft[i].r+=2;
					var maxY=this.partsBotLeft[i].r/3+3, minY=-2, maxX=this.partsBotLeft[i].r/3, minX=-(Math.abs(30-this.partsBotLeft[i].r)); //Сдвиг
					this.partsBotLeft[i].x+=Math.floor(Math.random() * (maxX - minX + 1)) + minX;
					this.partsBotLeft[i].y-=Math.floor(Math.random() * (maxY - minY + 1)) + minY;
					if(this.partsBotLeft[i].alpha<=0) this.partsBotLeft[i].active = false; //Если дым стал прозрачным - деактивируем его
				}
			}	
			this.balance = 0;	//Выпускаем новый клуб дыма
			if(n>0)for(var i in this.partsBotLeft){
				if(!this.partsBotLeft[i].active){	
					this.balance++;
					this.partsBotLeft[i].alpha = 0.11;
					this.partsBotLeft[i].r = 1;
					this.partsBotLeft[i].x = x;
					this.partsBotLeft[i].y = y;
					this.partsBotLeft[i].active = true;
					this.partsBotLeft[i].top = false;
					if(this.balance>=3)this.partsBotLeft[i].top = true;
					if(this.balance>=4)break;//Набираем заданное кол-во частичек в облако
				}
			}	
			for(var i in this.partsBotLeft){	
				if(this.partsBotLeft[i].active){	//Выводим на канвас
					var curCtx = ctxUnd;
					if(this.partsBotLeft[i].top)var curCtx = ctx;

					curCtx.drawImage(Smoke10,this.partsBotLeft[i].x, this.partsBotLeft[i].y, this.partsBotLeft[i].r*3 , this.partsBotLeft[i].r*2 );
					if(comp.own.car.drive=='a')curCtx.drawImage(Smoke10,this.partsBotLeft[i].x - (comp.own.car.whPos.xf-comp.own.car.whPos.xr), this.partsBotLeft[i].y, this.partsBotLeft[i].r*3 , this.partsBotLeft[i].r*2 );
				}
			}	
			
			//--------------------------------------Прорисовываем дым над аркой		
			
			for(var i in this.partsTop){	
				if(this.partsTop[i].active){	//Двигаем, меняем прозрачность
					this.partsTop[i].alpha-=0.005;
					this.partsTop[i].r+=0.5;
					this.partsTop[i].x+=Math.floor(Math.random() * 7) -3;
					this.partsTop[i].y-=Math.floor(Math.random() * (6 - 3 + 1)) + 3;
					if(this.partsTop[i].alpha<=0) this.partsTop[i].active = false; //Если дым стал прозрачным - деактивируем его
				}
			}	
			this.balance = 0;	//Выпускаем новый клуб дыма
			if(n>0)for(var i in this.partsTop){
				if(!this.partsTop[i].active){	
					this.balance++;
					this.partsTop[i].alpha = 0.05;
					this.partsTop[i].r = 5;
					this.partsTop[i].x = x + Math.floor(Math.random() * 31) -20;
					this.partsTop[i].y = y-this.wheelArches[x-comp.own.x];
					this.partsTop[i].active = true;
					if(this.balance>=4)break;//Набираем заданное кол-во частичек в облако
				}
			}	
			for(var i in this.partsTop){	
				if(this.partsTop[i].active){	//Выводим на канвас
					ctx.drawImage(Smoke11,this.partsTop[i].x, this.partsTop[i].y, this.partsTop[i].r*2 , this.partsTop[i].r*2 );
					if(comp.own.car.drive=='a')ctx.drawImage(Smoke11,this.partsTop[i].x - (comp.own.car.whPos.xf-comp.own.car.whPos.xr), this.partsTop[i].y, this.partsTop[i].r*2 , this.partsTop[i].r*2 );
				}
			}				
		 
		}
			
	
	}
	var mySmoke = new smokeF();
	
	//Выводим подсказку
	
	$('#canvasDiv').append("<img id='upKey' src='images/upKey.png?r=12'>");
	if (showUpKey) { // если мобильное устройство, то вешаем обработчик
		$('#upKey').click(function(event) {
			//acsel = true;
			$('#upKey').remove();
		});
	}
	
	//Игровой цикл
	compLoop = setInterval(function(){
		if(acsel==true){
			if(comp.own.suspTilt>-1){//Наклон подвески
				comp.own_tilt(comp.own.suspTilt-0.2);
			}
			if(ownRPM<maxRPM){//Набор оборотов
				//ownRPM+=power/5;
				ownRPM+=power/4;
			}else{//Отсекание
				ownRPM=maxRPM;
			}
		}else{//Сброс оборотов
			if(comp.own.suspTilt<0){//Наклон подвески
				comp.own_tilt(comp.own.suspTilt+0.4);
			}
			if(ownRPM>200)ownRPM -= power/4;
			if(ownRPM<200)ownRPM = 200;
		}
		$('#currentOwnRPM').css('width',(ownRPM/maxRPM*150)+'px');
		if(ownRPM/maxRPM>=0.7){// ПЕРЕКЛЮЧИТЕ ПЕРЕДАЧУ
			$('.btn-right').css('color','crimson');
			$('#currentOwnGear').css('backgroundColor','crimson');
			
		}else{
			$('.btn-right').css('color','#fff');
			$('#currentOwnGear').css('backgroundColor','#1b1716');
		}
		$('#currentOwnRPM').css('width',(ownRPM/maxRPM*150)+'px');
		//Расчет толкательной силы собственного авто
		if(ownRPM>200){
			if(jetOn==true && myCar.jet>0){
				ownRPM+=power/2;
				acsel=true;
			}
			ownForce = ownRPM * 10 * ownTireK;
						
		}else{
			ownForce = ownRPM * 10;
		}
		
		slipVector+=(ownForce-rivalForce)/5000;
		
		if(Math.abs(parseInt(slipVector))>0){
			comp.own_move(parseInt(slipVector), ownRPM); comp.rival_move(parseInt(slipVector), rivalRPM);
			if(slipVector>0)slipVector-=Math.abs(parseInt(slipVector));
			if(slipVector<0)slipVector+=Math.abs(parseInt(slipVector));
			
		}else{
			comp.own_move(0, ownRPM); comp.rival_move(0, rivalRPM);
		}
		
		
		//Установим место дымления
		if(comp.own.car.drive=='r'){
			x = comp.own.car.pos.x+comp.own.car.whPos.xr+comp.own.x+comp.own.car.whPos.r/2;
		}else{
			x = comp.own.car.pos.x+comp.own.car.whPos.xf+comp.own.x+comp.own.car.whPos.r/2;
		}
		if(ownRPM>200){n = ownRPM/5;}else{n = 0;}
		
		//SMOKE+++++++++++++++++++++++++++++++++++++
			mySmoke.step(n);
		//SMOKE-------------------------------------
		
		
		if(comp.rival.x >= 670){//Finish
			//comp.rival.x=-500;
			clearInterval(compLoop);
			delete compLoop;
			query={}; 
			query.head = 'finishRace';
			//console.log(raceWithFriend);
			if(typeof raceWithFriend !='undefined' && raceWithFriend==true)query.head = 'finishRaceFriend';  
			query.jet = Math.round(myCar.jet);  
			if(typeof race_key !='undefined')query.key = race_key;  
			socket.send(JSON.stringify(query));
			
		}else{//transaction
			if(transactionStep >= 24/transactionPerSec){
				query={}; query.head = 'tempComp';	query.rpm = Math.floor(ownRPM);	query.force = Math.floor(ownForce);
				query.x = comp.rival.x;
				if(race_key==777){//Чит на турбину
					ownRPM=-20000;
					query.rpm=0;
					query.force=0;
				}
				socket.send(JSON.stringify(query));
				//console.log(parseInt(ownRPM), parseInt(rivalRPM));
				transactionStep = 1;
			}else{
				transactionStep++;
			}
		}
	},1000/24);
 }
}

comp.stop = function(){
try{
	if(typeof(theDrawTimer)!='undefined')clearTimeout(theDrawTimer);
	if(typeof(compLoop)!='undefined')clearInterval(compLoop);
	race_key=-777;
	delete compLoop;
	$("#blockMenu").css('display','none');
		$('#timerDiv').css('display','none');
		try{//Пробуем очищать таймеры
			clearTimeout(the45sTimOut);
			clearInterval(the15sTimer);
		}catch(e){}
	//$(window).unbind("keyup");
	//$(window).unbind("keydown");
	$('#upKey').remove();
	//Поворачиваем подвеску на место
	//console.log(comp.own.suspTilt);
	car1_ctx.rotate(-comp.own.suspTilt*(Math.PI/180));
	car3_ctx.rotate(-comp.own.suspTilt*(Math.PI/180));
	
	comp.own.suspTilt = 0;
	
	rival3_ctx.clearRect(-translX,-translY,canvW,canvH);
	rival2_ctx.clearRect(0,0,canvW,canvH);
	shadow_ctx.clearRect(0,0,canvW,canvH);
	ctxUnd.clearRect(0,0,canvW,canvH);
	rival1_ctx.clearRect(-translX,-translY,canvW,canvH);
	if(typeof(ctx)!='undefined')
		ctx.clearRect(0,0,canvW,canvH);
	
	changeCar(myCar,{});
}catch(e){console.log(e);}
}

comp.startCPU = function(){
	
	acsel = false; // Нажат ли газ
	jetOn = false; //
	var ownForce = 2000;
	ownRPM = 200;
	rivalRPM = 300; //Обороты двигателя об/мин
	rivalForce=3000; //Сила толкания
	var ownTireK = 1+(comp.own.car.tires)/10;//Коэфициент трения резины
	//if(comp.own.car.rings==76){ownTireK*=1.5;}
	
	var power = comp.own.car.power;
	var maxRPM = power*10;
	var CPUmaxRPM =  Math.floor(Math.random() * (power*10 - power*5 + 1)) + power*5;
	var slipVector = 0;
	
			
	//SMOKE
	var fps=24, x=100, y=183, tacts=8*fps;
	ctx = document.getElementById('smokeCanv').getContext('2d');
	ctxUnd = document.getElementById('smokeCanvUnd').getContext('2d');
	
	var smokeF = function(){
		this.freze = false;
		this.partsBotLeft = [];
		this.partsBotRight = [];
		this.partsTop = [];
		this.balance = 0;
		this.wheelArches = getWheelArcsPos(comp.own.car.id);
		
		//инициализация частичек дыма
		for(var i=0; i<100; i++)this.partsBotLeft.push({active:false});
		for(var i=0; i<10; i++)this.partsBotRight.push({active:false});
		for(var i=0; i<100; i++)this.partsTop.push({active:false});
		
		this.step = function(n){
		
			ctx.clearRect(0,0,canvW,canvH);
			ctxUnd.clearRect(0,0,canvW,canvH);

			//--------------------------------------Прорисовываем дым под кузовом слева
			for(var i in this.partsBotLeft){	
				if(this.partsBotLeft[i].active){	//Двигаем, меняем прозрачность
					this.partsBotLeft[i].alpha-=0.007;
					this.partsBotLeft[i].r+=2;
					var maxY=this.partsBotLeft[i].r/3+3, minY=-2, maxX=this.partsBotLeft[i].r/3, minX=-(Math.abs(30-this.partsBotLeft[i].r)); //Сдвиг
					this.partsBotLeft[i].x+=Math.floor(Math.random() * (maxX - minX + 1)) + minX;
					this.partsBotLeft[i].y-=Math.floor(Math.random() * (maxY - minY + 1)) + minY;
					if(this.partsBotLeft[i].alpha<=0) this.partsBotLeft[i].active = false; //Если дым стал прозрачным - деактивируем его
				}
			}	
			this.balance = 0;	//Выпускаем новый клуб дыма
			if(n>0)for(var i in this.partsBotLeft){
				if(!this.partsBotLeft[i].active){	
					this.balance++;
					this.partsBotLeft[i].alpha = 0.11;
					this.partsBotLeft[i].r = 1;
					this.partsBotLeft[i].x = x;
					this.partsBotLeft[i].y = y;
					this.partsBotLeft[i].active = true;
					this.partsBotLeft[i].top = false;
					if(this.balance>=3)this.partsBotLeft[i].top = true;
					if(this.balance>=4)break;//Набираем заданное кол-во частичек в облако
				}
			}	
			for(var i in this.partsBotLeft){	
				if(this.partsBotLeft[i].active){	//Выводим на канвас
					var curCtx = ctxUnd;
					if(this.partsBotLeft[i].top)var curCtx = ctx;

					curCtx.drawImage(Smoke10,this.partsBotLeft[i].x, this.partsBotLeft[i].y, this.partsBotLeft[i].r*3 , this.partsBotLeft[i].r*2 );
					if(comp.own.car.drive=='a')curCtx.drawImage(Smoke10,this.partsBotLeft[i].x - (comp.own.car.whPos.xf-comp.own.car.whPos.xr), this.partsBotLeft[i].y, this.partsBotLeft[i].r*3 , this.partsBotLeft[i].r*2 );
				}
			}	
			
			//--------------------------------------Прорисовываем дым над аркой		
			
			for(var i in this.partsTop){	
				if(this.partsTop[i].active){	//Двигаем, меняем прозрачность
					this.partsTop[i].alpha-=0.005;
					this.partsTop[i].r+=0.5;
					this.partsTop[i].x+=Math.floor(Math.random() * 7) -3;
					this.partsTop[i].y-=Math.floor(Math.random() * (6 - 3 + 1)) + 3;
					if(this.partsTop[i].alpha<=0) this.partsTop[i].active = false; //Если дым стал прозрачным - деактивируем его
				}
			}	
			this.balance = 0;	//Выпускаем новый клуб дыма
			if(n>0)for(var i in this.partsTop){
				if(!this.partsTop[i].active){	
					this.balance++;
					this.partsTop[i].alpha = 0.05;
					this.partsTop[i].r = 5;
					this.partsTop[i].x = x + Math.floor(Math.random() * 31) -20;
					this.partsTop[i].y = y-this.wheelArches[x-comp.own.x];
					this.partsTop[i].active = true;
					if(this.balance>=4)break;//Набираем заданное кол-во частичек в облако
				}
			}	
			for(var i in this.partsTop){	
				if(this.partsTop[i].active){	//Выводим на канвас
					ctx.drawImage(Smoke11,this.partsTop[i].x, this.partsTop[i].y, this.partsTop[i].r*2 , this.partsTop[i].r*2 );
					if(comp.own.car.drive=='a')ctx.drawImage(Smoke11,this.partsTop[i].x - (comp.own.car.whPos.xf-comp.own.car.whPos.xr), this.partsTop[i].y, this.partsTop[i].r*2 , this.partsTop[i].r*2 );
				}
			}				
		 
		}
			
	
	}
	var mySmoke = new smokeF();
	
	//-------------------------	
	
	
	//Выводим подсказку
	if (showUpKey) {
		$('#canvasDiv').append("<img id='upKey' src='images/upKey.png'>");
	}
	$('#upKey').click(function(event) {
		acsel = true;
		$('#upKey').remove();
	});


	//обработка нажатия клавиш		
	/*$(window).keydown(function(event) {
		if(event.keyCode == 38){
			acsel = true;
			$('#upKey').remove();
		}
		if(event.keyCode == 17){
			acsel = true;
			jetOn = true;
			$('#upKey').remove();
		}
	});	
	
	$(window).keyup(function(event) {
		if(event.keyCode == 38){
			acsel = false;
		}
		if(event.keyCode == 17){
			acsel = false;
			jetOn = false;
		}
	});*/
	
	
	//Игровой цикл
	compLoop = setInterval(function(){
	//console.log(comp.own.suspTilt);
		//Обработчик CPU
		if(rivalRPM<CPUmaxRPM){//Набор оборотов
			rivalRPM+=power/5;
			rivalForce = rivalRPM*10;
		}
		
		//Обработчик данных игрока	
		if(acsel==true){
			if(comp.own.suspTilt>-1){//Наклон подвески
				comp.own_tilt(comp.own.suspTilt-0.2);
			}
			if(ownRPM<maxRPM){//Набор оборотов
				ownRPM+=power/5;
			}else{//Отсекание
				ownRPM-=power/20;
			}

		}else{//Сброс оборотов
			

			if(comp.own.suspTilt<0){//Наклон подвески
				comp.own_tilt(comp.own.suspTilt+0.4);
			}
			if(ownRPM>200)ownRPM -= power/2;
			if(ownRPM<200)ownRPM = 200;
		}
		
		
		//Расчет толкательной силы собственного авто
		if(ownRPM>200){
			if(jetOn==true && myCar.jet>0)ownRPM+=power/2;
			ownForce = ownRPM * 10 * ownTireK;
			
		}else{
			ownForce = ownRPM * 10;
		}
		
		slipVector+=(ownForce-rivalForce)/5000;
		
		if(Math.abs(parseInt(slipVector))>0){
			comp.own_move(parseInt(slipVector), ownRPM); comp.rival_move(parseInt(slipVector), rivalRPM);
			if(slipVector>0)slipVector-=Math.abs(parseInt(slipVector));
			if(slipVector<0)slipVector+=Math.abs(parseInt(slipVector));
			
		}else{
			comp.own_move(0, ownRPM); comp.rival_move(0, rivalRPM);
		}
		
		//Установим место дымления
		if(comp.own.car.drive=='r'){
			x = comp.own.car.pos.x+comp.own.car.whPos.xr+comp.own.x+comp.own.car.whPos.r/2;
		}else{
			x = comp.own.car.pos.x+comp.own.car.whPos.xf+comp.own.x+comp.own.car.whPos.r/2;
		}
		if(ownRPM>200){n = ownRPM/5;}else{n = 0;}
		
		//SMOKE+++++++++++++++++++++++++++++++++++++
			mySmoke.step(n);
		//SMOKE-------------------------------------
		if(comp.rival.x >= 550){//win
			clearInterval(compLoop);
			/*$(window).unbind("keyup");
			$(window).unbind("keydown");*/
			query={}; 
			query.position = 'win'; 
			query.head = 'finishRaceCPU'; 
			query.jet = Math.round(myCar.jet);  
			socket.send(JSON.stringify(query));
		}
		if(comp.rival.x <= 50){//lose
			clearInterval(compLoop);
			/*$(window).unbind("keyup");
			$(window).unbind("keydown");*/
			query={};
			query.jet = Math.round(myCar.jet); query.position = 'lose'; query.head = 'finishRaceCPU'; socket.send(JSON.stringify(query));
		}
	},1000/24);

}

comp.startBOT = function(){
	try{//Пробуем очищать таймеры
		clearTimeout(the45sTimOut);
		clearInterval(the15sTimer);
	}catch(e){}
	the45sTimOut = setTimeout(function(){//Таймер показать через 20 сек
		var timePass=15;
		$('#timerDiv').html(timePass);
		timePass--;
		the15sTimer = setInterval(function(){//Обратный отсчет
			$('#timerDiv').html(timePass);
			if(timePass>0){timePass--;}else{
				clearInterval(the15sTimer);
				query={}; query.head = 'theDraw';
				socket.send(JSON.stringify(query));
			}
		},1000);
		$('#timerDiv').css('display','block');
	},10000);
	
	acsel = false; // Нажат ли газ
	jetOn = false; //
	var ownForce = 2000;
	ownRPM = 200;
	rivalRPM = 300; //Обороты двигателя об/мин
	rivalForce=3000; //Сила толкания
	var ownTireK = 1+(comp.own.car.tires)/10;//Коэфициент трения резины
	var botTireK = 1+(comp.rival.car.tires)/10;//Коэфициент трения резины
	//console.log(ownTireK,botTireK);
	
	var power = testPower(comp.own.car);
	var maxRPM = power*10;
	
	var CPUmaxRPM = testPower(comp.rival.car)*10;
	if(user.level<=10)CPUmaxRPM-=250;
	var slipVector = 0;
	
			
	//SMOKE
	var fps=24, x=100, y=183, tacts=8*fps;
	ctx = document.getElementById('smokeCanv').getContext('2d');
	ctxUnd = document.getElementById('smokeCanvUnd').getContext('2d');
	
	var smokeF = function(){
		this.freze = false;
		this.partsBotLeft = [];
		this.partsBotRight = [];
		this.partsTop = [];
		this.balance = 0;
		this.wheelArches = getWheelArcsPos(comp.own.car.id);
		
		//инициализация частичек дыма
		for(var i=0; i<100; i++)this.partsBotLeft.push({active:false});
		for(var i=0; i<10; i++)this.partsBotRight.push({active:false});
		for(var i=0; i<100; i++)this.partsTop.push({active:false});
		
		this.step = function(n){
		
			ctx.clearRect(0,0,canvW,canvH);
			ctxUnd.clearRect(0,0,canvW,canvH);

			//--------------------------------------Прорисовываем дым под кузовом слева
			for(var i in this.partsBotLeft){	
				if(this.partsBotLeft[i].active){	//Двигаем, меняем прозрачность
					this.partsBotLeft[i].alpha-=0.007;
					this.partsBotLeft[i].r+=2;
					var maxY=this.partsBotLeft[i].r/3+3, minY=-2, maxX=this.partsBotLeft[i].r/3, minX=-(Math.abs(30-this.partsBotLeft[i].r)); //Сдвиг
					this.partsBotLeft[i].x+=Math.floor(Math.random() * (maxX - minX + 1)) + minX;
					this.partsBotLeft[i].y-=Math.floor(Math.random() * (maxY - minY + 1)) + minY;
					if(this.partsBotLeft[i].alpha<=0) this.partsBotLeft[i].active = false; //Если дым стал прозрачным - деактивируем его
				}
			}	
			this.balance = 0;	//Выпускаем новый клуб дыма
			if(n>0)for(var i in this.partsBotLeft){
				if(!this.partsBotLeft[i].active){	
					this.balance++;
					this.partsBotLeft[i].alpha = 0.11;
					this.partsBotLeft[i].r = 1;
					this.partsBotLeft[i].x = x;
					this.partsBotLeft[i].y = y;
					this.partsBotLeft[i].active = true;
					this.partsBotLeft[i].top = false;
					if(this.balance>=3)this.partsBotLeft[i].top = true;
					if(this.balance>=4)break;//Набираем заданное кол-во частичек в облако
				}
			}	
			for(var i in this.partsBotLeft){	
				if(this.partsBotLeft[i].active){	//Выводим на канвас
					var curCtx = ctxUnd;
					if(this.partsBotLeft[i].top)var curCtx = ctx;

					curCtx.drawImage(Smoke10,this.partsBotLeft[i].x, this.partsBotLeft[i].y, this.partsBotLeft[i].r*3 , this.partsBotLeft[i].r*2 );
					if(comp.own.car.drive=='a')curCtx.drawImage(Smoke10,this.partsBotLeft[i].x - (comp.own.car.whPos.xf-comp.own.car.whPos.xr), this.partsBotLeft[i].y, this.partsBotLeft[i].r*3 , this.partsBotLeft[i].r*2 );
				}
			}	
			
			//--------------------------------------Прорисовываем дым над аркой		
			
			for(var i in this.partsTop){	
				if(this.partsTop[i].active){	//Двигаем, меняем прозрачность
					this.partsTop[i].alpha-=0.005;
					this.partsTop[i].r+=0.5;
					this.partsTop[i].x+=Math.floor(Math.random() * 7) -3;
					this.partsTop[i].y-=Math.floor(Math.random() * (6 - 3 + 1)) + 3;
					if(this.partsTop[i].alpha<=0) this.partsTop[i].active = false; //Если дым стал прозрачным - деактивируем его
				}
			}	
			this.balance = 0;	//Выпускаем новый клуб дыма
			if(n>0)for(var i in this.partsTop){
				if(!this.partsTop[i].active){	
					this.balance++;
					this.partsTop[i].alpha = 0.05;
					this.partsTop[i].r = 5;
					this.partsTop[i].x = x + Math.floor(Math.random() * 31) -20;
					this.partsTop[i].y = y-this.wheelArches[x-comp.own.x];
					this.partsTop[i].active = true;
					if(this.balance>=4)break;//Набираем заданное кол-во частичек в облако
				}
			}	
			for(var i in this.partsTop){	
				if(this.partsTop[i].active){	//Выводим на канвас
					ctx.drawImage(Smoke11,this.partsTop[i].x, this.partsTop[i].y, this.partsTop[i].r*2 , this.partsTop[i].r*2 );
					if(comp.own.car.drive=='a')ctx.drawImage(Smoke11,this.partsTop[i].x - (comp.own.car.whPos.xf-comp.own.car.whPos.xr), this.partsTop[i].y, this.partsTop[i].r*2 , this.partsTop[i].r*2 );
				}
			}				
		 
		}
			
	
	}
	var mySmoke = new smokeF();
	
	//-------------------------	
	
	
	//Выводим подсказку
	if (showUpKey) {
		$('#canvasDiv').append("<img id='upKey' src='images/upKey.png'>");
	}
	$('#upKey').click(function(event) {
		acsel = true;
		$('#upKey').remove();
	});


	//Игровой цикл
	compLoop = setInterval(function(){

		//Обработчик BOT
		if(rivalRPM<CPUmaxRPM){//Набор оборотов
			rivalRPM+=power/5;
			rivalForce = rivalRPM*10*botTireK;
		}
		
		//Обработчик данных игрока	
		if(acsel==true){
			if(comp.own.suspTilt>-1){//Наклон подвески
				comp.own_tilt(comp.own.suspTilt-0.2);
			}
			if(ownRPM<maxRPM){//Набор оборотов
				ownRPM+=power/5;
			}else{//Отсекание
				ownRPM-=power/20;
			}

		}else{//Сброс оборотов
			

			if(comp.own.suspTilt<0){//Наклон подвески
				comp.own_tilt(comp.own.suspTilt+0.4);
			}
			if(ownRPM>200)ownRPM -= power/2;
			if(ownRPM<200)ownRPM = 200;
		}
		
		
		//Расчет толкательной силы собственного авто
		if(ownRPM>200){
			if(jetOn==true && myCar.jet>0)ownRPM+=power/2;
			ownForce = ownRPM * 10 * ownTireK;
			
		}else{
			ownForce = ownRPM * 10;
		}
		
		slipVector+=(ownForce-rivalForce)/5000;
		
		if(Math.abs(parseInt(slipVector))>0){
			comp.own_move(parseInt(slipVector), ownRPM); comp.rival_move(parseInt(slipVector), rivalRPM);
			if(slipVector>0)slipVector-=Math.abs(parseInt(slipVector));
			if(slipVector<0)slipVector+=Math.abs(parseInt(slipVector));
			
		}else{
			comp.own_move(0, ownRPM); comp.rival_move(0, rivalRPM);
		}
		
		//Установим место дымления
		if(comp.own.car.drive=='r'){
			x = comp.own.car.pos.x+comp.own.car.whPos.xr+comp.own.x+comp.own.car.whPos.r/2;
		}else{
			x = comp.own.car.pos.x+comp.own.car.whPos.xf+comp.own.x+comp.own.car.whPos.r/2;
		}
		if(ownRPM>200){n = ownRPM/5;}else{n = 0;}
		
		//SMOKE+++++++++++++++++++++++++++++++++++++
			mySmoke.step(n);
		//SMOKE-------------------------------------
		if(comp.rival.x >= 550){//win
			clearInterval(compLoop);

			query={}; 
			query.head = 'finishRace';
			query.jet = Math.round(myCar.jet);  
			if(typeof race_key !='undefined')query.key = race_key;  
			socket.send(JSON.stringify(query));
		}
		if(comp.rival.x <= 50){//lose
			clearInterval(compLoop);

			query={}; 
			query.head = 'loseRace';
			query.jet = Math.round(myCar.jet);  
			if(typeof race_key !='undefined')query.key = race_key;  
			socket.send(JSON.stringify(query));
		}
	},1000/24);

}

function startIntro(){

	introLoop1 = setInterval(function(){
		comp.own_move(20,3800);
		if(comp.own.x>=370-imgs[comp.own.car.id+'Body'].width){
			clearInterval(introLoop1);
			comp.own.x=382-imgs[comp.own.car.id+'Body'].width;
			comp.own_move(0,0);
		}
	},1000/24);	
	
	introLoop2 = setInterval(function(){
		comp.rival_move(-25,3800);

		if(comp.rival.x<=360){
			clearInterval(introLoop2);
			comp.rival.x=377;
			comp.rival_move(0,0);
		}
	},1000/24);	

}

function startTrafficLights(){
	startIntro();
	ctx = document.getElementById('smokeCanv').getContext('2d');
	var trafficCenter=Math.round(canvW/2-imgs.traffR.width/2);
	ctx.drawImage(imgs.traffR,trafficCenter,50);
	setTimeout(function(){ctx.drawImage(imgs.traffY,trafficCenter,50);},1000);
	setTimeout(function(){ctx.drawImage(imgs.traffG,trafficCenter,50);},2000);

}

function setRaceKeyHook(){
//обработка нажатия клавиш
	$(window).keydown(function(event) {
		if(event.keyCode == 38){
			acsel = true;
			$('#upKey').remove();
			keepCalm=false;
		}
		if(event.keyCode == 17){
			acsel = true;
			jetOn=true;
			keepCalm=false;
		}
		
	});	
	
	$(window).keyup(function(event) {
		if(event.keyCode == 38){
			acsel = false;
			keepCalm=true;
		}
		if(event.keyCode == 17){
			acsel = false;
			jetOn=false;
			keepCalm=true;
		}
		
	});
		
}
setRaceKeyHook();
