var E_MoveType = {
    "back" : 0,
    "side" : 1,
    "tilt" : 2,
    "accel" : 3,
    "cross" : 4,
    "backTilt" : 5,
    "backTiltAccel" : 6,
    "random" : 7
};

var E_ShotType = {
    "noShot" : 0,
    "oneShot" : 1,
    "nWay" : 2,
    "circle" : 3,
    "pyramid" : 4,
    "razr" : 5,
    "random" : 6,
    "round" : 7,
    "trace" : 8
};

var Enemy = Class.create(Sprite, {
    initialize : function(x, y){
        Sprite.call(this, 96, 64);
        this.image = createImage("img/enemy_fairy.png", [96*4, 64*3], 0, 0);
        this.moveTo(x, y);

        this.flag = false;
        this.isShot = false;
        this.angle = NaN;
        this.count = 0;
        this.moveUtil = [];
        this.shotUtil = [];
        this.direction = 0;

        this.hp = 5;
        this.moveSpeed = 0;
        this.shotSpeed = 0;
        this.moveType = 0;
        this.shotType = 0;
        this.shotNum = 0;
        this.shotWave = 0;
        this.shotDistance = 0;
        this.shotInterval = 0;
        this.shotDelay = 0;
        this.isAccel = false;
        this.accel = 0;
        this.shotColor = 0;
        this.bulletType = 0;
        this.item = [];
    },
    onenterframe : function(){
        this.movePattern(this.moveType);
        this.shotPattern(this.shotType, this.shotNum, this.shotWave, this.shotDistance, this.shotInterval, this.shotDelay);

        var shots = this.intersect(PlayerShot);
        var damage = 0;
        shots.forEach(function(shot){
            damage += shot.damage;
            shot.scene.removeChild(shot);
            playSound("sound/enemy_damage.wav", 0.05);
        });
        this.hp -= damage;

        this.remove();
        this.animation();
    },
    movePattern : function(type){
        if(!this.isShot){
            switch (type) {
                // 弾を打ったあと後ろに行く
                case E_MoveType.back:
                    if(!this.flag){
                        this.y += this.moveSpeed;
                    }else{
                        this.y -= this.moveSpeed;
                    }
                    break;
                // 弾を打ったあと横に行く
                case E_MoveType.side:
                    if(!this.flag){
                        this.y += this.moveSpeed;
                    }else{
                        if(this.x < core.width/2){
                            this.x -= this.moveSpeed;
                            this.scaleX = -1;
                        }else{
                            this.x += this.moveSpeed;
                        }
                        this.direction = 1;
                    }
                    break;
                // 弾を打ったあと斜めに行く
                case E_MoveType.tilt:
                    if(!this.flag){
                        this.y += this.moveSpeed;
                    }else{
                        if(this.x < core.width/2){
                            this.x -= this.moveSpeed;
                            this.scaleX = -1;
                        }else{
                            this.x += this.moveSpeed;
                        }
                        this.y += this.moveSpeed/2;
                        this.direction = 1;
                    }
                    break;
                // 弾を打ったあと斜めに加速度移動
                case E_MoveType.accel:
                    if(!this.moveUtil[0]) this.moveUtil[0] = 0;
                    if(!this.flag){
                        this.y += this.moveSpeed;
                    }else{
                        if(this.x < core.width/2){
                            this.x -= this.moveSpeed + 0.3*this.moveUtil[0];
                            this.scaleX = -1;
                        }else{
                            this.x += this.moveSpeed + 0.3*this.moveUtil[0];
                        }
                        this.y += this.moveSpeed + -0.1*this.moveUtil[0];
                        this.moveUtil[0] += 0.5;
                        this.direction = 1;
                    }
                    break;
                // 斜めに移動
                case E_MoveType.cross:
                    if(this.x < core.width/2){
                        this.x -= this.moveSpeed;
                        this.scaleX = -1;
                    }else{
                        this.x += this.moveSpeed;
                    }
                    this.y += this.moveSpeed;
                    this.direction = 1;
                    break;
                // 弾を打ったあと斜め後ろに移動
                case E_MoveType.backTilt:
                    if(!this.flag){
                        this.y += this.moveSpeed;
                    }else{
                        if(this.x < core.width/2){
                            this.x -= this.moveSpeed;
                            this.scaleX = -1;
                        }else{
                            this.x += this.moveSpeed;
                        }
                        this.y -= this.moveSpeed/2;
                        this.direction = 1;
                    }
                    break;
                // 弾を打ったあと斜め後ろに加速度移動
                case E_MoveType.backTiltAccel:
                    if(!this.moveUtil[0]) this.moveUtil[0] = 0;
                    if(!this.flag){
                        this.y += this.moveSpeed;
                    }else{
                        if(this.x < core.width/2){
                            this.x -= this.moveSpeed + 0.3*this.moveUtil[0];
                            this.scaleX = -1;
                        }else{
                            this.x += this.moveSpeed + 0.3*this.moveUtil[0];
                        }
                        this.y -= this.moveSpeed + 0.1*this.moveUtil[0];
                        this.moveUtil[0] += 0.5;
                        this.direction = 1;
                    }
                    break;
                // 弾を打ったあとランダムに移動
                case E_MoveType.random:
                    if(!this.flag){
                        this.y += this.moveSpeed;
                    }else{
                        if(!this.moveUtil.length){
                            this.moveUtil[0] = this.moveSpeed;
                            this.moveUtil[1] = rand(360);
                            this.moveUtil[2] = 0;
                            this.moveUtil[3] = 0;
                            this.moveUtil[4] = 0.1;
                            this.direction = 1;
                        }
                        this.moveUtil[0] -= this.moveUtil[4] * this.moveUtil[2];
                        this.x += Math.cos(this.moveUtil[1]/180 * Math.PI) * this.moveUtil[0];
                        this.y += Math.sin(this.moveUtil[1]/180 * Math.PI) * this.moveUtil[0];
                        this.moveUtil[2] += 0.05;
                        if(this.moveUtil[0] <= 0){
                            if(this.moveUtil[3] < 4){
                                this.moveUtil[0] = this.moveSpeed;
                                this.moveUtil[1] = rand(360);
                                this.moveUtil[2] = 0;
                                this.moveUtil[3]++;
                            }else{
                                var x = this.x - core.width/2;
                                var y = this.y + this.height;
                                this.moveUtil[0] = this.moveSpeed;
                                this.moveUtil[1] = Math.atan2(y, x) / Math.PI * 180 + 180;
                                this.moveUtil[2] = 0;
                                this.moveUtil[4] = 0;
                            }
                        }
                        this.scaleX = this.moveUtil[1] > 90 && this.moveUtil[1] < 270 ? -1 : 1;
                    }
                    break;
                default:

            }
        }
    },
    shotPattern : function(type, num, wave, dis, interval, delayTime){
        if(this.age % (interval*core.fps) === 0 && this.y > dis && !this.flag){
            this.isShot = true;
            var dx, dy, shot, i, offs, angle;
            dx = (this.x+this.width/2) - (Player.collection[0].x+Player.collection[0].width/2);
            dy = (this.y+this.height/2) - (Player.collection[0].y+Player.collection[0].height/2);
            switch (type) {
                case E_ShotType.noShot:

                    break;
                case E_ShotType.oneShot:
                    if(!this.angle) this.angle = Math.atan2(dy, dx) * 180 / Math.PI + 180;
                    if(!this.isAccel){
                        shot = new EnemyShot(32, 32, this.x+this.width/2, this.y+this.height/2, this.angle, this.shotSpeed, this.shotColor, this.bulletType);
                    }else{
                        shot = new EnemyShot(32, 32, this.x+this.width/2, this.y+this.height/2, this.angle, this.shotSpeed, this.shotColor, this.bulletType, this.accel);
                    }
                    this.scene.addChild(shot);
                    break;
                case E_ShotType.nWay:
                    if(!this.angle) this.angle = Math.atan2(dy, dx) * 180 / Math.PI + 180;
                    for(i = 0;i < num;i++){
                        offs = 16*(i-parseInt(num/2));
                        if(num % 2 === 0){
                            offs = 16*(i-parseInt(num/2)+1/2);
                        }
                        if(!this.isAccel){
                            shot = new EnemyShot(32, 32, this.x+this.width/2, this.y+this.height/2, this.angle + offs, this.shotSpeed, this.shotColor, this.bulletType);
                        }else{
                            shot = new EnemyShot(32, 32, this.x+this.width/2, this.y+this.height/2, this.angle + offs, this.shotSpeed, this.shotColor, this.bulletType, this.accel);
                        }
                        this.scene.addChild(shot);
                    }
                    break;
                case E_ShotType.circle:
                    for(i = 0;i < 360 / num;i++){
                        if(!this.isAccel){
                            shot = new EnemyShot(32, 32, this.x+this.width/2, this.y+this.height/2, num*i, this.shotSpeed, this.shotColor, this.bulletType);
                        }else{
                            shot = new EnemyShot(32, 32, this.x+this.width/2, this.y+this.height/2, num*i, this.shotSpeed, this.shotColor, this.bulletType, this.accel);
                        }
                        this.scene.addChild(shot);
                    }
                    break;
                case E_ShotType.pyramid:
                    if(!this.angle) this.angle = Math.atan2(dy, dx) * 180 / Math.PI + 180;
                    for(i = 0;i < num - (wave-1) + this.count;i++){
                        offs = 8*(i-parseInt((num - (wave-1) + this.count)/2));
                        if((num - (wave-1) + this.count) % 2 === 0){
                            offs = 8*(i-parseInt((num - (wave-1) + this.count)/2)+1/2);
                        }
                        if(!this.isAccel){
                            shot = new EnemyShot(32, 32, this.x+this.width/2, this.y+this.height/2, this.angle + offs, this.shotSpeed, this.shotColor, this.bulletType);
                        }else{
                            shot = new EnemyShot(32, 32, this.x+this.width/2, this.y+this.height/2, this.angle + offs, this.shotSpeed, this.shotColor, this.bulletType, this.accel);
                        }
                        this.scene.addChild(shot);
                    }
                    break;
                case E_ShotType.razr:
                    this.angle = Math.atan2(dy, dx) * 180 / Math.PI + 180;
                    if(!this.isAccel){
                        shot = new EnemyShot(32, 32, this.x+this.width/2, this.y+this.height/2, this.angle, this.shotSpeed, this.shotColor, this.bulletType);
                    }else{
                        shot = new EnemyShot(32, 32, this.x+this.width/2, this.y+this.height/2, this.angle, this.shotSpeed, this.shotColor, this.bulletType, this.accel);
                    }
                    shot.scaleY = num;
                    shot.scaleX = 0.5;
                    this.scene.addChild(shot);
                    break;
                case E_ShotType.random:
                    angle = Math.atan2(dy, dx) * 180 / Math.PI + 180;
                    this.angle = rand(90) + angle-45;
                    if(!this.isAccel){
                        shot = new EnemyShot(32, 32, this.x+this.width/2, this.y+this.height/2, this.angle, this.shotSpeed, this.shotColor, this.bulletType);
                    }else{
                        shot = new EnemyShot(32, 32, this.x+this.width/2, this.y+this.height/2, this.angle, this.shotSpeed, this.shotColor, this.bulletType, this.accel);
                    }
                    this.scene.addChild(shot);
                    break;
                case E_ShotType.round:
                    this.angle = 0;
                    if(!this.isAccel){
                        shot = new EnemyShot(32, 32, this.x+this.width/2, this.y+this.height/2, this.angle+this.shotNum*this.count, this.shotSpeed, this.shotColor, this.bulletType);
                    }else{
                        shot = new EnemyShot(32, 32, this.x+this.width/2, this.y+this.height/2, this.angle+this.shotNum*this.count, this.shotSpeed, this.shotColor, this.bulletType, this.accel);
                    }
                    this.scene.addChild(shot);
                    break;
                case E_ShotType.trace:
                    this.angle = Math.atan2(dy, dx) * 180 / Math.PI + 180;
                    if(!this.isAccel){
                        shot = new EnemyShot(32, 32, this.x+this.width/2, this.y+this.height/2, this.angle, this.shotSpeed, this.shotColor, this.bulletType);
                    }else{
                        shot = new EnemyShot(32, 32, this.x+this.width/2, this.y+this.height/2, this.angle, this.shotSpeed, this.shotColor, this.bulletType, this.accel);
                    }
                    this.scene.addChild(shot);
                    break;
                default:

            }
            this.count++;
            playSound("sound/enemy_shot.wav", 0.1);
            if(this.count >= wave){
                this.flag = true;
                this.tl.delay(delayTime*core.fps).then(function(){
                    this.isShot = false;
                });
            }
        }
    },
    animation : function(){
        if(this.age % 8 === 0){
            this.frame++;
        }
        if(this.direction > 0){
            if(this.frame <= 7){
                this.frame = this.frame % 4 + 4;
            }else{
                this.frame = this.frame % 4 + 8;
            }
        }else{
            this.frame %= 4;
        }
    },
    remove : function(f){
        var flag = f || false;
        if(this.hp <= 0){
            for(var i = 0;i < this.item.length;i++){
                var item = new Item(this.x + 48*(i-this.item.length/2), this.y, this.item[i]);
                this.scene.addChild(item);
            }
            playSound("sound/enemy_vanishA.wav", 0.05);
        }
        if(this.x < -this.width || this.x > core.width || this.y > core.height || this.y < -this.height || this.hp <= 0 || flag){
            this.scene.removeChild(this);
        }
    }
});

var EnemyShot = Class.create(Shot, {
    initialize : function(w, h, x, y, angle, speed, color, type, a){
        Shot.call(this, w, h, x, y, angle, speed, a || 0);
        this.image = createImage("img/Enemy_Bullet.png", [w, h], w*color, h*type);
    },
    onenterframe : function(){
        if(this.accel > 0){
            this.addAccel();
        }
        this.move();
        this.remove();
    }
});
