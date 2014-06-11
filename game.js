/**
 * This class represents an instance of a Game of Life (see
 * https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) on the given
 * HTML canvas with w x h cells, each consisting of d x d pixels.
 *
 * The world is a torus, meaning that if you go over the edge, you
 * come out the other end.
 *
 * Currently 20% of the cells starts as being alive, but this can
 * changed by altering the alive_propability variable.
 *
 * Use the code as you please. Comments and corrections should be sent
 * to mail@jonaslindstrom.dk. Enjoy!
 */
function GameOfLife(canvas, w, h, d) {
    this.d = d;
    this.w = w;
    this.h = h;

    this.canvas = document.getElementById(canvas);
    this.ctx = this.canvas.getContext("2d");
    this.aliveColor = "#000000";
    this.deadColor = "#FFFFFF";
};

/**
 * Setup the game.
 */
GameOfLife.prototype.setup = function() {
    this.cells = new Array(this.w);
    this.neighbours = new Array(this.w);
    for (var i = 0; i < this.w; i++) {
	this.cells[i] = new Array(this.h);
	this.neighbours[i] = new Array(this.h);
    }
    var alive_propability = 0.2;
    this.randomize(alive_propability);

    /*
     * When onClick is called, this is the canvas, so we add a
     * reference to the game.
     */
    this.canvas.game = this;
    var onClick = function(mouseEvent) {
	var p = this.game.getPosition(mouseEvent);
	var i = Math.floor(p.x / this.game.d) - 1;
	var j = Math.floor(p.y / this.game.d) - 1;
	this.game.toggleCell(i,j);
	this.game.draw(i,j);
    };
    this.canvas.addEventListener("mousedown", onClick, false);
};

/**
 * Get the position, (x,y) coordinage of the given event as an object
 * with two properties, .x and .y.
 */
GameOfLife.prototype.getPosition = function(event)
{
    var canvas = document.getElementById("canvas");    
    var p = {};
    if (event.x != undefined && event.y != undefined)
    {
        p.x = event.x;
        p.y = event.y;
    }
    else // Firefox method to get the position
    {
        p.x = event.clientX + document.body.scrollLeft +
            document.documentElement.scrollLeft;
        p.y = event.clientY + document.body.scrollTop +
            document.documentElement.scrollTop;
    }
    p.x -= canvas.offsetLeft;
    p.y -= canvas.offsetTop;
    return p;
};

/**
 * If the given cell is alive, make it dead and vice versa.
 */
GameOfLife.prototype.toggleCell = function(i,j) {
    this.cells[i][j] = (this.cells[i][j] + 1) % 2
};

/**
 * Toggle the game running/not running.
 */
GameOfLife.prototype.pause = function() {
    this.running = !this.running;
    if (this.running)
	this.run();
};

/**
 * Start the game already!
 */
GameOfLife.prototype.start = function() {
    this.setup();
    this.running = true;
    this.run();
};

/**
 * Run one more step in the loop, draw stuff and wait. Then run again.
 */
GameOfLife.prototype.run = function() {
    this.step();
    this.draw();

    var self = this;
    var wait = function() {
	if (self.running)
	    self.run();
    };
    window.setTimeout(wait, 1000/20);
};

/**
 * Determine whether each cell should be dead or alive in next step,
 * and perform the changes.
 */
GameOfLife.prototype.step = function() {
    for (i = 0; i < this.w; i++)
	for (j = 0; j < this.h; j++)
	    this.neighbours[i][j] = this.countNeighbours(i,j);

    for (i = 0; i < this.w; i++) {
	for (j = 0; j < this.h; j++) {
	    if (this.cells[i][j]) {
		if (this.neighbours[i][j] < 2 || this.neighbours[i][j] > 3)
		    this.cells[i][j] = 0;
	    } else {
		if (this.neighbours[i][j] == 3)
		    this.cells[i][j] = 1;
	    }
	}
    }
};

/**
 * Count the number of alive neighbours cell (i,j) currently has.
 */
GameOfLife.prototype.countNeighbours = function(i,j) {
    var c = 0;
    
    var im1 = (i+this.w-1) % this.w;
    var ip1 = (i+1) % this.w;
    var jm1 = (j+this.h-1) % this.h;
    var jp1 = (j+1) % this.h;
    
    c += this.cells[im1][jm1] + this.cells[im1][j] + this.cells[im1][jp1];
    c += this.cells[i][jm1] + this.cells[i][jp1];
    c += this.cells[ip1][jm1] + this.cells[ip1][j] + this.cells[ip1][jp1];

    return c;
};

/**
 * Randomize whether cell (i,j) is dead or alive. The propability that
 * the cell ends up being alive is p.
 */
GameOfLife.prototype.randomizeCell = function(i,j,p) {
    this.cells[i][j] = Math.random() < p ? 1 : 0; 
};

/**
 * Randomize whether all cells are dead or alive. The propability each
 * end up alive is p.
 */
GameOfLife.prototype.randomize = function(p) {
    for (i = 0; i < this.w; i++)
	for (j = 0; j < this.h; j++)
	    this.randomizeCell(i,j,p);
};

/**
 * Draw cell (i,j).
 */
GameOfLife.prototype.drawCell = function(i,j) {
    this.ctx.fillStyle = this.cells[i][j] ? this.aliveColor : this.deadColor;
    this.ctx.fillRect(i*this.d, j*this.d, (i+1)*this.d, (j+1)*this.d);
};

/**
 * Draw all cells.
 */
GameOfLife.prototype.draw = function () {
    for (i = 0; i < this.w; i++)
	for (j = 0; j < this.h; j++)
	    this.drawCell(i,j);
};
