
(function(window, document, scrollSpy, pubsub, $){

    var chapterTitle = document.querySelector('nav .chapter-title');

    function animateScrollTop(pos){
        $('html, body').animate({
            scrollTop: pos
        }, 500);
    }

    document.querySelectorAll('.table-of-contents a[href], .side-nav .collapsible-body li a').forEach(function(el){
        el.addEventListener('click', function(evt){
            evt.preventDefault();

            var id =  el.getAttribute('href').replace(/^.*?#+/, '');
            var section = document.getElementById( id );

            window.history.replaceState({path:'#'+id}, section.querySelector('h1').innerText, '#'+id);

            if(section) animateScrollTop(section.offsetTop - 60);
        });

    });

    var isFirst = true;
    var min = 0;
    document.querySelectorAll('.scrollspy').forEach(function(el){

        min = el.offsetTop;
        if(isFirst) { isFirst = false; if(min > 0) min = 0}
        scrollSpy(el, {
            buffer: 100,
            min: min,
            max: el.offsetTop + el.offsetHeight,
            onEnter: function(el, position) {
                var ct = el.querySelector('h1').innerText;

                //$(chapterTitle).html('<span class="title-separator">–</span> ' + ct);
                chapterTitle.innerHTML = '<span class="title-separator">–</span> ' + ct;

                document.querySelectorAll('a[href$="#'+el.id+'"]').forEach(function(el){
                    el.classList.add('active');
                })
            },
            onLeave: function(el, position){

                document.querySelectorAll('a[href$="#'+el.id+'"]').forEach(function(el){
                    el.classList.remove('active');
                })
            }
        })
    });

    // Dispatch the event on enter page
    var event = new Event('scroll');
    window.dispatchEvent(event);

})(window, document, scrollSpy6180, window.PubSub, jQuery)

