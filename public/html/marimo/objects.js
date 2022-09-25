
var paint={
	init:function(w,h){
		this.canvas=document.createElement("canvas");
		this.ctx=this.canvas.getContext("2d");
		this.canvas.width=w;
		this.canvas.height=h;
		document.body.appendChild(this.canvas);
	},
	renderBG:function(o){
		var len=Math.floor(this.canvas.width/o.width);
		for(var i=0;i<len;i++){
			this.ctx.drawImage(o.img,o.picX,o.picY,o.picW,o.picH,
				i*o.width,this.canvas.height-o.height,
				o.width,o.height);
		}
	},
	renderCH:function(o){
		var sp=o.sprites[o.state];
		if(o.direction===1){
			this.ctx.drawImage(sp.img,sp.picX,sp.picY,sp.picW,sp.picH,o.x,o.y,o.width,o.height);
		} else {
			this.ctx.save();
			this.ctx.scale(-1,1);
			this.ctx.drawImage(sp.img,sp.picX,sp.picY,sp.picW,sp.picH,-o.x-o.width,o.y,o.width,o.height);
			this.ctx.restore();
		}
	},
	renderCoin:function(o){

		var sp=o.sprites;
		var d=(this.scale<0) ? -1 : 1;
		this.ctx.save();
		this.ctx.translate(o.x+o.width/2,o.y+o.height/2);
		this.ctx.scale(d,1);
		this.ctx.drawImage(
				sp.img,sp.picX,sp.picY,sp.picW,sp.picH,
				d*o.scale*-o.width/2,-o.height/2,d*o.scale*o.width,o.height
		);
		this.ctx.restore();
	},
	renderStompScore:function(o){
		this.ctx.fillText(o.score,o.x ,o.y-20);
	},
	renderTotalScore:function(txt,x,y){
		this.ctx.fillText("SCORE:"+txt,x,y);
	},
	clear:function(x,y,w,h){
		this.ctx.clearRect(x,y,w,h);
	}
};

var Sprite=function(px,py,pw,ph){
	this.picX=px;
	this.picY=py;
	this.picW=pw;
	this.picH=ph;
};
Sprite.prototype={
	constructor:Sprite,
	setImage:function(img){
		this.img=img;
	}
};


var GameObj=function(x,y,w,h,sp){
	this.x=x;
	this.y=y;
	this.width=w;
	this.height=h;
	this.sprites=sp;
};
GameObj.prototype={
	constructor:GameObj,
};

var Character=function(x,y,w,h,sp,st,dir,boo){
	GameObj.call(this,x,y,w,h,sp);
	this.state=st;
	this.direction=dir;
	this.isOnLand=boo;
};
Character.prototype=Object.create(GameObj.prototype);
Character.prototype.constructor=Character;
Character.prototype.updateX=function(x){this.x+=x;};
Character.prototype.updateY=function(y){this.y+=y;};
Character.prototype.verticalAction=function(st,t,b,max,inertia){
	this.state=st;
	this.isOnLand=false;
	this.jump=new Moment(t,b,max);
	if(inertia){this.jump.inertia=true;}
};
Character.prototype.landingAction=function(st){
	this.isOnLand=true;
	this.jump=null;
	if(st!==undefined){this.state=st;}
};
//Character.prototype.setBlink=function(v){this.blink= new Blink(v);}


var Moment=function(t,b,max){
	this.topEnd=t;
	this.bottomEnd=b;
	this.count=0;
	this.vector=-1;
	this.max=max;
};
Moment.prototype={
	constructor:Moment,
	update:function(){
		if(this.vector===-1){
			if(this.count<this.topEnd){
				this.count++;
			} else {
				this.vector=1;
				this.count--;
			}
		} else {
			if(this.count>=this.bottomEnd){
				this.count--;
			}
		}
		
	},
	add:function(val){
		this.topEnd+=val;
	},
	extend:function(t){
		this.vector=-1;
		this.topEnd=t;
		this.max+=2;
		if(this.vector===1){
			this.vector=-1;
		}
	}
};

var Coin=function(x,y,w,h,sp,t){
	GameObj.call(this,x,y,w,h,sp);
	this.timer=t;
	this.isOnLand=false;
};
Coin.prototype={
	constructor:Coin,
	scale:1,
	frame:0.1,
	scaleFlag:false,
	update:function(){
		if(this.scale<-1&&!this.scaleFlag){
			this.scaleFlag=true;
		} else if(this.scale>1&&this.scaleFlag){
			this.scaleFlag=false;
		}
	
		if(this.scaleFlag){
			this.scale+=this.frame;
		} else {
			this.scale-=this.frame;
		}
		
		
	},
	updateY:function(y){
		Character.prototype.updateY.call(this,y);
	}
};

var Flash=function(x,y,w,h,sp){
	GameObj.call(this,x,y,w,h,sp);
	this.scale=1;
	this.frame=0.2;
	this.timer=15;
	scaleFlag:false;
};
Flash.prototype={
	constructor:Flash,
	update:function(y){
		if(this.scale<-1&&!this.scaleFlag){
			this.scaleFlag=true;
		} else if(this.scale>1&&this.scaleFlag){
			this.scaleFlag=false;
		}
	
		if(this.scaleFlag){
			this.scale+=this.frame;
		} else {
			this.scale-=this.frame;
		}
		this.y-=y;
		this.timer--;
		
	}
};


var Score=function(x,y,w,h,s,t){
	this.x=x;
	this.y=y;
	this.width=w;
	this.height=h;
	this.score=s;
	this.timer=t;
};
Score.prototype={
	constructor:Score,
	update:function(y){
		this.y-=y;
		this.timer--;
	}
};