
PrettyJSON.view.Node = function(opt) {
    if(!opt.el) {
        this.$el = $("<span></span>");
        this.el = this.$el[0];
    } else {
        this.$el = opt.el instanceof $ ? opt.el : $(opt.el);
        this.el = this.$el[0]
    }


    this.tagName = "span";
    this.options = opt;
    this.data = this.options.data || null;
    this.level = this.options.level || 1;
    this.path = this.options.path || "";
    this.isLast = _.isUndefined(this.options.isLast) ? true : this.options.isLast;
    this.rendered = false;
    this.dateFormat = this.options.dateFormat;
    var m = this.getMeta();
    this.type = m.type;
    this.size = m.size;
    this.childs = [];
    this.render();
    this.show()
};

PrettyJSON.view.Node.prototype.getMeta = function () {
    var val = {size: _.size(this.data), type: _.isArray(this.data) ? "array" : "object"};
    return val
};

PrettyJSON.view.Node.prototype.elements = function () {
    this.els = {
        container: $(this.el).find(".node-container"),
        contentWrapper: $(this.el).find(".node-content-wrapper"),
        top: $(this.el).find(".node-top"),
        ul: $(this.el).find(".node-body"),
        down: $(this.el).find(".node-down")
    }
};
PrettyJSON.view.Node.prototype.render = function () {
    this.tpl = _.template(PrettyJSON.tpl.Node);
    $(this.el).html(this.tpl);
    this.elements();
    var b = this.getBrackets();
    this.els.top.html(b.top);
    this.els.down.html(b.bottom);
    return this
};
PrettyJSON.view.Node.prototype.renderChilds = function () {
    var count = 1;
    _.forEach(this.data, function (val, key) {
        var isLast = count == this.size;
        count = count + 1;
        var path = this.type == "array" ? this.path + "[" + key + "]" : this.path + "." + key;
        var opt = {
            key: key,
            data: val,
            parent: this,
            path: path,
            level: this.level + 1,
            dateFormat: this.dateFormat,
            isLast: isLast
        };
        var child = PrettyJSON.util.isObject(val) || _.isArray(val) ? new PrettyJSON.view.Node(opt) : new PrettyJSON.view.Leaf(opt);
        var li = $("<li/>");
        var quotation = '"';
        var colom = "&nbsp;:&nbsp;";
        var left = $("<span />");
        var right = $("<span />").append(child.el);
        this.type == "array" ? left.html("") : left.html(quotation + key + quotation + colom);
        left.append(right);
        li.append(left);

        this.els.ul.append(li);
        child.parent = this;
        this.childs.push(child)
    }.bind(this));
};

PrettyJSON.view.Node.prototype.show = function () {
    if (!this.rendered) {
        this.renderChilds();
        this.rendered = true
    }
    this.els.top.html(this.getBrackets().top);
    this.els.contentWrapper.show();
    this.els.down.show()
};
PrettyJSON.view.Node.prototype.getBrackets = function () {
    var v = {top: "{", bottom: "}"};
    if (this.type == "array") {
        v = {top: "[", bottom: "]"}
    }
    v.bottom = this.isLast ? v.bottom : v.bottom + ",";
    return v
};
PrettyJSON.view.Node.prototype.expandAll = function () {
    _.forEach(this.childs, function (child) {
        if (child instanceof PrettyJSON.view.Node) {
            child.show();
            child.expandAll()
        }
    }.bind(this));
    this.show()
};
