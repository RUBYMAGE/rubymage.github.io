PrettyJSON.view.Leaf = function(opt){
  this.el = $("<span></span>");
  this.tagName = "span";
  this.options = opt;
  this.data = _.isUndefined(this.options.data) ? null : this.options.data;
  this.level =  _.isUndefined(this.options.level) ? 0 : this.options.level;
  this.path = this.options.path || "";
  this.type = this.getType() || "string";
  this.dateFormat = this.options.dateFormat;
  this.isLast = _.isUndefined(this.options.isLast) ? true : this.options.isLast;
  this.render();
};
PrettyJSON.view.Leaf.prototype.getType = function () {
  var m = "string";
  var d = this.data;
  if (_.isNumber(d))m = "number";
  else if (_.isBoolean(d))m = "boolean";
  else if (_.isDate(d))m = "date";
  else if (_.isNull(d))m = "null";
  return m;
};

PrettyJSON.view.Leaf.prototype.getState = function () {
  var coma = this.isLast ? "" : ",";
  var state = {data: this.data, level: this.level, path: this.path, type: this.type, coma: coma};
  return state;
};
PrettyJSON.view.Leaf.prototype.render = function () {
  var state = this.getState(), quotation = '"';
  if (state.type == "date" && this.dateFormat) {
    state.data = quotation + PrettyJSON.util.dateFormat(this.data, this.dateFormat) + quotation
  } else if (state.type == "string") {
    state.data = quotation + state.data + quotation
  } else if (state.type == "null") {
    state.data = "null"
  }
  this.tpl = _.template(PrettyJSON.tpl.Leaf);
  $(this.el).html(this.tpl(state));
  return this;
};

