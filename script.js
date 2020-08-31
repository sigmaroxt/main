
var myGamePiece;
var myObstacles = [];
var myScore;
var started = false;

function startGame() {
    if(!started)
	{
		document.getElementById("startbutton").innerHTML = "RESET";
		started = true;
		myGamePiece = new component(30, 30, "red", 60, 120, "player");
		myGamePiece.gravity = 0.3;
		myScore = new component("30px", "Consolas", "black", 280, 40, "text");
		myGameArea.start();
	}
	else
	{
		myObstacles = [];
		myGamePiece = new component(30, 30, "red", 60, 120, "player");
		myGamePiece.gravity = 0.3;
		myGameArea.frameNo = 0;
	}
}

var myGameArea = {
    canvas : document.getElementById("myCanvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 16);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = myGameArea.context;
		if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else if (this.type == "player") {
            ctx.fillStyle = "rgb(200, 50, 50)";
            ctx.fillRect(this.x, this.y, this.width, this.height);
			ctx.fillStyle = "rgb(100, 25, 25)";
            ctx.fillRect(this.x, this.y, this.width, this.height - 20);
            
            ctx.fillRect(this.x, this.y + 5, this.width + 10, this.height - 25);
			ctx.fillRect(this.x + 20, this.y + 15, 5, 5);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
		if (this.y < 0) {
            this.y = 0;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) 
		{
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) 
	{
        if (myGamePiece.crashWith(myObstacles[i])) 
		{
			myGameArea.clear();
			ctx = myGameArea.context;
            ctx.font = "80px Arial";
            ctx.fillStyle = "rgb(100, 25, 25)";
            ctx.fillText("You lost", 240 - 1.75 * 80, 140 - 8);
			ctx.fillStyle = "rgb(200, 50, 50)";
            ctx.fillText("You lost", 240 - 1.75 * 80, 140);
			ctx.font = "40px Arial";
			ctx.fillStyle = "rgb(50, 50, 50)";
            ctx.fillText("SCORE: " + myGameArea.frameNo, 240 - 2.7 * 40, 220);
			ctx.fillStyle = "rgb(100, 100, 100)";
            ctx.fillText("SCORE: " + myGameArea.frameNo, 240 - 2.7 * 40, 228);
            return;
        } 
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) 
	{
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 150;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 100;
        maxGap = 100;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(40, height, "rgb(75, 150, 75)", x, 0));
        myObstacles.push(new component(10, height, "rgb(100, 200, 100)", x, 0));
        myObstacles.push(new component(60, 10, "rgb(50, 100, 50)", x - 10, height - 10));
        myObstacles.push(new component(10, 10, "rgb(75, 150, 75)", x - 10, height - 10));
        myObstacles.push(new component(40, x - height - gap, "rgb(75, 150, 75)", x, height + gap));
        myObstacles.push(new component(10, x - height - gap, "rgb(100, 200, 100)", x, height + gap));
		myObstacles.push(new component(60, 10, "rgb(50, 100, 50)", x - 10, height + gap));
		myObstacles.push(new component(10, 10, "rgb(75, 150, 75)", x - 10, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) 
	{
        myObstacles[i].x += -2 * (1.0 + myGameArea.frameNo / 1000);
        myObstacles[i].update();
    }
    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function av(n) {
    myGamePiece.gravitySpeed += n;
}

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 87) {
        av(-8);
    }
});