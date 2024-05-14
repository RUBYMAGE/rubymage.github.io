'use strict';
/*

// Declare app level module which depends on views, and components
angular.module('me', [
  //'ngRoute',
  //'myApp.view1',
  //'myApp.view2'
])
    //.config(['$routeProvider', function($routeProvider) {
//  $routeProvider.otherwise({redirectTo: '/view1'});
//}])

.controller('MainCtrl', ['$scope', '$location', function ($scope, $location) {
  $scope.getCurrentState = function () {
    return $location.path().replace(/^\/+/, '');
  }
}]);
*/




/*-----------------------------------------------------------------*/
/*-----------------------------------------------------------------*/
(function(document, $) {

document.addEventListener("DOMContentLoaded", function() {


    document.getElementById('hi').style.height = window.innerHeight + "px";

    var skills = document.getElementById('skills');

    var offset = function (objElement) {
        var x = 0, y = 0;

        if (objElement.offsetParent) {
            do {
                x += objElement.offsetLeft;
                y += objElement.offsetTop;
            } while (objElement = objElement.offsetParent);
        }
        return {top: y, left: x};
    };

    var animateSkills = function(){

        if( $("#skills").hasClass("ready") )
            return;

        var scrollY = window.scrollY,
            innerHeight = window.innerHeight;
        var pos = offset( skills );

        //console.log( pos.top - scrollY < innerHeight );

        if(  pos.top - scrollY < innerHeight ) {
            $('#skills').addClass("ready");

            $('#skills li').each(function () {
                var i = $(this).index();
                $(this).delay(100 * i).animate({
                    right: "0%"
                }, 1000, function () {
                    $(this).children('span').fadeIn(600)
                })
            });

        }
    };
    animateSkills();

    document.onscroll = function() {
        //console.log("scrolling");
        animateSkills();
    };


    $('.openRM').click(function(event){
        event.preventDefault();
        $('#rubymage').addClass('open');
    });

    $('.closeRM').click(function(event){
        event.preventDefault();
        $('#rubymage').removeClass('open');
    });

    $('#contact-me').click(function(event){
        event.preventDefault();
        console.log('not implemented')
    })
});

})(document, jQuery);
