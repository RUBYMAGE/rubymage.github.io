'use strict';

(function (document, window, pubsub) {

    // cache DOM
    var header = document.querySelector('.header');
    var bigH1 = header.querySelector('.header-title');
    var smallH1 = document.querySelector('nav .header-title');
    //var bigChapterTitle = bigH1.querySelector('.chapter-title');
    var nav = document.querySelector('main nav');
    var contents = document.querySelector('.table-of-contents');


    // bind events
    init();


    function init(){
        bindEvents();
        onResize();
        onScroll();
    }

    function bindEvents() {
        window.addEventListener('resize', onResize);
        window.addEventListener('scroll', onScroll);
    }

    function onResize() {
        //if (window.innerWidth < 760) bigChapterTitle.classList.add('hide');
        //else bigChapterTitle.classList.remove('hide');
    }







    function onScroll() {

        var paddingTop;
        try {
            paddingTop = window.getComputedStyle(header, null).getPropertyValue('padding-top');
        } catch(e) {
            paddingTop = header.currentStyle.paddingTop;
        }

        if( document.body.scrollTop > parseInt(paddingTop)) {
            bigH1.classList.add('hide');
            smallH1.classList.remove('hide');
        } else {
            bigH1.classList.remove('hide');
            smallH1.classList.add('hide');
        }

        // shadow
        if( document.body.scrollTop > header.offsetHeight) {
            nav.classList.remove('z-depth-0');
            pubsub.publish('navPinned', true);
            contents.classList.add('pinned')
            contents.style.top = nav.offsetHeight + 'px';
        } else {
            nav.classList.add('z-depth-0');
            pubsub.publish('navPinned', false);
            contents.classList.remove('pinned')
            //contents.style.top = '';
        }
    }

})(document, window, window.PubSub);