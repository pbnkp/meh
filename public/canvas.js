function GadClient(canvas, chat_area) {
  this.canvas      = canvas;
  this.ctx         = this.context();
  this.hero        = [30, 240];
  this.hero_vector = [ 0, 0];
  var client       = this;
  $(document).keypress(function (event) {
    client.processKey(event.keyCode);
  })
}

GadClient.prototype.processKey = function (keyCode) {
  switch (keyCode) {
    case 112: // p
      this.hero_vector = [0,0]; // pause
      break;
    case 104: // h
      this.hero_vector[0] -= 1; // left
      break;
    case 107: // k
      this.hero_vector[1] -= 1; // up
      break;
    case 106: // j
      this.hero_vector[1] += 1; // down
      break;
    case 108: // l
      this.hero_vector[0] += 1; // right
      break;
  }
}

GadClient.prototype.context = function () {
  var elem = this.canvas;
  if (elem && elem.getContext) {
    return elem.getContext('2d');
  } else {
    throw 'no context';
  }
}

GadClient.prototype.start = function () {
  var client = this;
  //setInterval(function () { client.draw() }, 50); // 20 FPS
  setInterval(function () { client.draw() }, 25); // 40 FPS
}

GadClient.prototype.draw = function () {
	this.ctx.fillStyle = "#fff";
  this.ctx.fillRect(this.hero[0], this.hero[1], 20, 20);
  this.hero[0]     += this.hero_vector[0];
  this.hero[1]     += this.hero_vector[1];
	this.ctx.fillStyle = "#000";
  this.ctx.fillRect(this.hero[0], this.hero[1], 20, 20);
}
