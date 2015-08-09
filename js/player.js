var Player = Class.create(Sprite, {
    initialize : function(){
        Sprite.call(this, 64, 96);
        this.image = core.assets["img/player.png"];
        this.moveTo(280, 500);
        this.isActive = true;
        this.isMove = true;
        this.power = 1;
        this.bomb = 3;
        core.currentScene.addChild(this);

        this.target = null;
        this.ballArray = [];
        for(var i = 0;i < 2;i++){
            this.ballArray[i] = new Ball(this.x - 30 + i * (this.width+30), this.y + 60);
            core.currentScene.addChild(this.ballArray[i]);
        }


    },
    onenterframe : function(){
        if(this.isActive){
            if(this.age % 4 === 0){
                for(var i = 0;i < 2;i++){
                    var shot = new PlayerShot((this.x+8) + (this.width-32)*i, this.y - 16, 0, this.power);
                    this.scene.addChild(shot);
                    playSound("sound/shot1.wav", 0.01);
                }
            }
            this.searchEnemy();
            this.hitCheck();
        }
        this.animation();
        this.updataBall();
    },
    ontouchmove : function(e){
        if(this.isMove) this.moveTo(e.x-32, e.y-32);
    },
    animation : function(){
        if(this.age % 8 === 0){
            this.frame++;
            if(!this.isActive){
                this.opacity = this.opacity == 1 ? 0.5 : 1;
            }else{
                this.opacity = 1;
            }
        }
        this.frame = this.frame % 8;
    },
    searchEnemy : function(){
        var d = 0;
        for(var i = 0;i < Enemy.collection.length;i++){
            if(!this.target || this.target.hp <= 0){
                this.target = Enemy.collection[i];
                d = Math.pow(this.x - Enemy.collection[i].x, 2)+Math.pow(this.y - Enemy.collection[i].y, 2);
            }else{
                d = Math.pow(this.x - this.target.x, 2)+Math.pow(this.y - this.target.y, 2);
                if(d > Math.pow(this.x-Enemy.collection[i].x, 2)+Math.pow(this.y-Enemy.collection[i].y, 2)){
                    this.target = Enemy.collection[i];
                }
            }
        }
    },
    updataBall : function(){
        for(var i = 0;i < this.ballArray.length;i++){
            this.ballArray[i].x = this.x - 30 + i * (this.width+30);
            this.ballArray[i].y = this.y + 60;
            this.ballArray[i].target = this.target;
            this.ballArray[i].isActive = this.isActive;
        }
    },
    hitCheck : function(){
        var shots = this.intersect(EnemyShot);
        for(var i in shots){
            if(this.within(shots[i], shots[i].width/5)){
                this.hit();
            }
        }
    },
    hit : function(){
        playSound("sound/nc899.wav", 0.5);
        this.isActive = false;
        this.isMove = false;
        this.moveTo((core.width-this.width)/2, core.height);
        for(var i = 0;i < Enemy.collection.length;i++){
            Enemy.collection[i].remove(true);
        }
        for(var j = 0;j < EnemyShot.collection.length;j++){
            EnemyShot.collection[j].remove(true);
        }
        this.tl.moveTo(280, 500, core.fps).then(function(){
            this.isMove = true;
        }).delay(core.fps).then(function(){
            this.isActive = true;
        });
    }
});

var Ball = Class.create(Sprite, {
    initialize : function(x, y){
        Sprite.call(this, 30, 30);
        this.image = core.assets["img/ball.png"];
        this.moveTo(x, y);
        this.isActive = true;

        this.target = null;
    },
    onenterframe : function(){
        this.rotation += 5;
        if(this.age % 8 === 0 && this.isActive){
            var shot = new PlayerShot(this.x + (this.width-16)/2, this.y - 16, 1, 0.5*this.power);
            shot.target = this.target;
            this.scene.addChild(shot);
            // playSound("sound/shot1.wav", 0.01);
        }
    }
});

var PlayerShot = Class.create(Shot, {
    initialize : function(x, y, type, d){
        Shot.call(this, 32, 32, x, y, 270, 16, 0);
        this.image = core.assets["img/player_shot.png"];
        this.frame = type;
        this.damage = d;
    },
    onenterframe : function(){
        switch(this.frame){
            case 1:
                this.homing();
                break;
        }
        this.move();
        this.remove();
    }
});
