function Client(url, ws) {
  var self = this;
  this.ws = ws = $.ws.conn({
    url    : url,
    hbStr  : null,
    onopen : function () {
      console.log('connected');
      self.trigger('connect');
    },
    onmessage : function (data) {
      self.trigger('message', [JSON.parse(data)]);
    },
    onclose : function (event) {
      console.log('disconnected');
      self.trigger('connect');
    }
  });
  this._listeners = {};
}

Client.prototype.bind = function (event, callback) {
  this._listeners[event] = callback;
  return this
}
Client.prototype.trigger = function (event, cb_args) {
  if (this._listeners[event]) {
    this._listeners[event].apply(this, cb_args);
  }
}
