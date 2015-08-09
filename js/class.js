enchant();

var Shot = Class.create(Sprite, {
    initialize : function(w, h, x, y, angle, speed, a){
        Sprite.call(this, w, h);
        this.moveTo(x, y);
        this.angle = angle;
        this.speed = speed;
        this.accel = a;
        this.maxSpeed = speed * 2;
        this.minSpeed = speed * 0.5;
        this.target = null;
    },
    move : function(){
        var vx = this.speed * Math.cos(this.angle/180*Math.PI);
        var vy = this.speed * Math.sin(this.angle/180*Math.PI);
        this.moveBy(vx, vy);
        this.rotation = this.angle + 90;
    },
    addAccel : function(){
        this.speed += this.accel * this.age/core.fps;
        this.speed = Math.min(this.maxSpeed, this.speed);
        this.speed = Math.max(this.minSpeed, this.speed);
    },
    remove : function(f){
        var flag = f || false;
        if(((this.x > core.width || this.x < -16 || this.y > core.height || this.y < -16) && this.scene) || flag){
            this.scene.removeChild(this);
        }
    },
    homing : function(){
        if(this.target && this.target.hp > 0){
            var x = this.target.x - this.x;
            var y = this.target.y - this.y;
            this.angle = Math.atan2(y, x) / Math.PI * 180;
        }
    }
});

var Item = Class.create(Sprite, {
    initialize : function(x, y, type){
        Sprite.call(this, 32, 32);

        this.moveTo(x, y);
        this.image = core.assets["img/item.png"];
        this.frame = type;
        this.angle = 90;
        this.speed = -3;
        this.flag = false;

        this.tl.rotateTo(720, FPS, enchant.Easing.CUBIC_EASEOUT);
    },
    onenterframe : function(){
        var player = Player.collection[0];
        var dx = (this.x+this.width/2) - (player.x+player.width/2);
        var dy = (this.y+this.height/2) - (player.y+player.height/2);
        var d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        if(d < 32){
            this.speed = 10;
            this.flag = true;
        }

        if(!this.flag){
            this.speed += 0.1;
            this.speed = Math.min(this.speed, 3);

            if(player.y < WIDTH/4){
                this.speed = 16;
                this.flag = true;
            }
        }else{
            this.angle = Math.atan2(dy, dx) * 180 / Math.PI + 180;
        }

        this.x += Math.cos(this.angle * Math.PI / 180) * this.speed;
        this.y += Math.sin(this.angle * Math.PI / 180) * this.speed;

        this.hitCheck(player);
        this.remove();
    },
    hitCheck : function(p){
        if(this.within(p, 16)){
            switch(this.frame) {
                case 0:
                    core.point += 10;
                    break;
                case 1:
                    p.power += 1;
                    p.power = Math.min(p.power, 5);
                    break;
                case 2:
                    core.life++;
                    break;
                case 3:
                    p.bomb++;
                    break;
                default:

            }
            this.remove(true);
        }
    },
    remove : function(f){
        var flag = f || false;
        if((this.y > core.height && this.scene) || flag){
            this.scene.removeChild(this);
        }
    }
});

function createSurface(size, col){
        var s = new Surface(size, size);
        s.context.fillStyle = col;
        s.context.fillRect(0, 0, size, size);

    return s;
}

function createImage(src, size, x, y){
    var img = new Surface(size[0], size[1]);
    img.draw(core.assets[src], x, y, size[0], size[1], 0, 0, size[0], size[1]);

    return img;
}

function playSound(src, vol){
    var sound = core.assets[src].clone();
    sound.volume = vol * VOLUME;
    sound.play();
}
