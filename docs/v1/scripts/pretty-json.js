'use strict';

(function (document) {

    var node;
    document.querySelectorAll('.pretty-json')
        .forEach(function (el) {
            node = new PrettyJSON.view.Node({
                el: el,
                expandAll: true,
                data: JSON.parse(el.innerText)
            });
            if (el.getAttribute('data-expand-all') == 'true') {
                node.expandAll();
            }
        })


})(document);