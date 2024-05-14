/*!
 * scrollSpy
 * Author: @RUBYMAGE
 * Licensed under the MIT license
 */

var scrollSpy6180 = function (element, opt) {

    var defaults = {
        min: 0,
        max: 0,
        mode: 'vertical',
        namespace: 'scrollspy',
        buffer: 0,
        container: window,
        onEnter: opt.onEnter ? opt.onEnter : [],
        onLeave: opt.onLeave ? opt.onLeave : [],
        onTick: opt.onTick ? opt.onTick : []
    }

    var options = Object.assign(defaults);

    if (typeof opt === "object") {
        Object.assign(options, opt);
    }


    var enters = 0;
    var leaves = 0;
    var inside = false;

    /* add listener to container */
    window.addEventListener('scroll', function () {
        var position = {top: window.scrollY, left: window.scrollX};
        var xy = (options.mode == 'vertical') ? position.top + options.buffer : position.left + options.buffer;
        var max = options.max;
        var min = options.min;

        /* fix max */
        if (typeof options.max === "function") {
            max = options.max();
        }

        /* fix min */
        if (typeof options.min === "function") {
            min = options.min();
        }

        if (max == 0) {
            max = (options.mode == 'vertical') ? window['innerHeight'] : window['innerWidth'] + element.offsetWidth;
        }

        /* if we have reached the minimum bound but are below the max ... */
        if (xy >= min && xy <= max) {
            /* trigger enter event */
            if (!inside) {
                inside = true;
                enters++;

                /* fire enter event */
                if (typeof options.onEnter === "function") {
                    options.onEnter(element, position, enters);
                }
            }

            /* trigger tick event */
            if (typeof options.onTick === "function") {
                options.onTick(element, position, inside, enters, leaves);
            }
        } else {

            if (inside) {
                inside = false;
                leaves++;
                /* trigger leave event */
                if ( typeof options.onLeave === "function" ) {
                    options.onLeave(element, position, leaves);
                }
            }
        }
    });
}