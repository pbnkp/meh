function GadClient(canvas) {
  var client = this;
  this.canvas = canvas;
  this.ctx = this.context();
  this.hero = [30,240];
  this.hero_vector = [0,0];
  $(document).keypress(function (event) {
    client.processKey(event.keyCode);
    return true;
  })
}

GadClient.prototype.processKey = function (keyCode) {
  if (keyCode == 112)      // p
    this.hero_vector = [0,0];    // pause
  else if (keyCode == 104)      // h
    this.hero_vector[0] -= 1;    // left
  else if (keyCode == 107) // k
    this.hero_vector[1] -= 1;    // up
  else if (keyCode == 106) // j
    this.hero_vector[1] += 1;    // down
  else if (keyCode == 108) // l
    this.hero_vector[0] += 1;    // right
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
  setInterval(function () { client.draw() }, 50);
}

GadClient.prototype.draw = function () {
  this.canvas.width = this.canvas.width;
  this.hero[0] += this.hero_vector[0]
  this.hero[1] += this.hero_vector[1]
  this.ctx.fillRect(this.hero[0], this.hero[1], 20, 20);
}
