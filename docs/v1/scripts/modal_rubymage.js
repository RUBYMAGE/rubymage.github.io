/*
 *
 * @author Sergiu Ghenciu, RUBYMAGE
 * License: Dedicated to the public domain.
 *
 */

// define Factory constructor
function ModalRubymage() {
    "use strict";

    var modal = null;
    var overlay = null;
    var closeButton = null;

    // Determine proper prefix
    var transitionEnd = transitionSelect();

    // Define option defaults
    var options = {
        autoOpen: false,
        className: 'fade-and-drop-rm',
        closeButton: true,
        el: null,
        overlay: true,
        bindEvents: true
    };

    var isAnchored = false;
    //if(modal.offsetHeight > window.innerHeight) {
    //   anchor();
    //} else {
    //    unAnchor();
    //}

    // Extending option
    if (arguments[0] && typeof arguments[0] === "object") {
        options = extendDefaults(options, arguments[0]);
    }

    buildOut();
    if (options.bindEvents === true) bindEvents();
    if (options.autoOpen === true) open();

    function removeEffectClass(e) {
        e.target.removeEventListener(e.type, removeEffectClass); // Self-Removing
        e.target.classList.remove(options.className);
    }

    function close() {

        if (isOpen()) {
            modal.classList.remove("open-rm");
            overlay && overlay.classList.remove("open-rm");
            modal.addEventListener(transitionEnd, removeEffectClass);
            overlay && overlay.addEventListener(transitionEnd, removeEffectClass);
        }
    }

    function isOpen() {
        return modal.classList.contains("open-rm");
    }

    function open() {

        modal.classList.add(options.className);
        overlay && overlay.classList.add(options.className);

        resetTop();

        setTimeout(function () {
            modal.classList.add("open-rm");
            overlay && overlay.classList.add("open-rm");
        }, 0);
    }

    function resetTop() {

        var top = isAnchored ? options.marginTopAnchored : options.marginTop;
        modal.style.top = "calc(" + window.scrollY + "px + " + top + ")";
    }

    function anchor() {

        isAnchored = true;
        modal.classList.add("anchored-rm");
        resetTop();
    }

    function unAnchor() {

        isAnchored = false;
        modal.classList.remove("anchored-rm");
        resetTop();
    }

    function buildOut() {

        modal = options.el;
        modal.classList.add("modal-rm");
        if (!options.marginTop) options.marginTop = window.getComputedStyle(modal).top || "10%"; // from css
        if (!options.marginTopAnchored) options.marginTopAnchored = "0px";

        // If closeButton option is true, add a close button
        if (options.closeButton === true) {
            closeButton = document.createElement("button");
            closeButton.className = "close-rm close-button";
            modal.appendChild(closeButton);
        }

        // If overlay is true, add one
        if (options.overlay === true) {
            overlay = document.createElement("div");
            overlay.className = "overlay-rm";
            modal.parentNode.insertBefore(overlay, modal);
        }
    }

    function bindEvents() {
        closeButton && closeButton.addEventListener('click', close);
        overlay && overlay.addEventListener('click', close);
    }

    function transitionSelect() {

        var el = document.createElement("div");
        if (el.style.WebkitTransition) return "webkitTransitionEnd";
        if (el.style.OTransition) return "oTransitionEnd";
        return 'transitionend';
    }

    function extendDefaults(source, properties) {
        var property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }
        return source;
    }

    return {
        overlay: overlay,
        closeButton: closeButton,
        isOpen: isOpen,
        open: open,
        close: close,
        anchor: anchor,
        unAnchor: unAnchor,
        resetTop: resetTop
    };
}