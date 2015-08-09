enchant();

var WIDTH = 640;
var HEIGHT = 640;
var FPS = 60;
var data = [];
var VOLUME = 0;

// メイン処理
window.onload = function(){
	core = new Core(WIDTH, HEIGHT);
	core.fps = FPS;
	core.preload(
		"img/Effectelse.png",
		"img/Enemy_Bullet.png",
		"img/enemy_fairy.png",
		"img/player.png",
		"img/ball.png",
		"img/player_shot.png",
		"img/item.png",
		"sound/shot1.wav",
		"sound/enemy_damage.wav",
		"sound/enemy_vanishA.wav",
		"sound/enemy_shot.wav",
		"sound/nc899.wav"
	);
	core.counter = 0;
	core.point = 0;
	core.life = 3;

	// jsonファイルの読み取り
	$(function(){
		$.getJSON("data/data.json", function(json){
			data = json.slice();
		});
	});

	core.onload = function(){
		core.rootScene.backgroundColor = "black";

		var player = new Player();

		var item = new Item(160, 320, 0);
		core.rootScene.addChild(item);

		core.on("enterframe", function(e){
			if(core.frame % core.fps === 0){
				var enemy = new Enemy(rand(core.width-48), -32);
				var r = rand(data.length);
				enemy.hp = 5;
				enemy.moveSpeed = data[r].movespeed;
		        enemy.shotSpeed = data[r].shotspeed;
		        enemy.moveType = data[r].movetype;
		        enemy.shotType = data[r].shottype;
		        enemy.shotNum = data[r].shotnum;
		        enemy.shotWave = data[r].shotwave;
		        enemy.shotDistance = data[r].shotdistance;
		        enemy.shotInterval = data[r].shotinterval;
		        enemy.shotDelay = data[r].shotdelay;
				enemy.isAccel = data[r].isaccel;
				enemy.accel = data[r].accel;
				enemy.shotColor = data[r].shotcolor;
				enemy.bulletType = data[r].bullettype;
				enemy.item = [0, 1];
				core.rootScene.addChild(enemy);
			}
			// if(data.length > core.counter && data[core.counter].count*core.fps == core.frame){
			// 	var enemy = new Enemy(data[core.counter].x, data[core.counter].y);
			// 	enemy.hp = data[core.counter].hp;
			// 	enemy.moveSpeed = data[core.counter].movespeed;
		    //     enemy.shotSpeed = data[core.counter].shotspeed;
		    //     enemy.moveType = data[core.counter].movetype;
		    //     enemy.shotType = data[core.counter].shottype;
		    //     enemy.shotNum = data[core.counter].shotnum;
		    //     enemy.shotWave = data[core.counter].shotwave;
		    //     enemy.shotDistance = data[core.counter].shotdistance;
		    //     enemy.shotInterval = data[core.counter].shotinterval;
		    //     enemy.shotDelay = data[core.counter].shotdelay;
			// 	enemy.isAccel = data[core.counter].isaccel;
			// 	enemy.accel = data[core.counter].accel;
			// 	core.rootScene.addChild(enemy);
			// 	core.counter++;
			// }
		});
	};

	core.start();
	// core.debug();

};

function rand(x){
	return parseInt(Math.random() * x);
}
