/*! version 0.1.0 https://github.com/codekipple/encarousel. */

/*
    Supports CommonJS, AMD or browser globals.
    see: https://github.com/umdjs/umd/blob/master/jqueryPluginCommonjs.js
*/
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    $.fn.encarousel = function (options) {
        var settings = {
                scrollAmount: 100,
                scrollSpeed: 500
            },
            elements = $(this);

        if (options) {
            $.extend(settings, options);
        }

        var scrollIt = function(carousel, amount) {
            carousel.pane.stop().animate({
                scrollTop: amount + 'px'
            }, settings.scrollSpeed, function(){
                checkScrollBounds(carousel);
            });

        }

        var checkScrollBounds = function(carousel) {
            var scrollTop = carousel.pane.scrollTop(),
                paneHeight = carousel.pane.outerHeight(),
                fullPaneHeight;

            carousel.pane.css({
                overflow: 'visible',
                height: 'auto'
            });

            fullPaneHeight = carousel.pane.outerHeight();

            carousel.pane.css({
                overflow: 'hidden',
                height: '200px'
            });

            if (scrollTop === 0) {
                carousel.prevBtn.addClass('is-disabled');
            } else {
                carousel.prevBtn.removeClass('is-disabled');
            }

            if (scrollTop + paneHeight === fullPaneHeight) {
                carousel.nextBtn.addClass('is-disabled');
            } else {
                carousel.nextBtn.removeClass('is-disabled');
            }
        }

        return elements.each(function() {
            var carousel = {
                el: $(this),
                pane: $('<div class="encarousel__pane" />'),
                nextBtn: $('<button type="button" class="encarousel--next">Next</button>'),
                prevBtn: $('<button type="button" class="encarousel--prev">Prev</button>')
            };

            // setup extra html elements
            carousel.el.wrapInner(carousel.pane);
            carousel.el.append(carousel.prevBtn);
            carousel.el.append(carousel.nextBtn);

            // now html has been added save over the variables with the embedded html
            carousel.pane = carousel.el.find('.encarousel__pane');
            carousel.prevBtn = carousel.el.find('.encarousel--prev');
            carousel.nextBtn = carousel.el.find('.encarousel--next');

            // activate scrolling using enscroll plugin
            carousel.pane.enscroll({
                horizontalScrolling: true
            });

            // bind scroll action to next btn
            carousel.nextBtn.on('click', function(e){
                var amount = carousel.pane.scrollTop() + settings.scrollAmount;
                scrollIt(carousel, amount);
                e.preventDefault();
            });

            // bind scroll action to prev btn
            carousel.prevBtn.on('click', function(e){
                var amount = carousel.pane.scrollTop() - settings.scrollAmount;
                scrollIt(carousel, amount);
                e.preventDefault();
            });

            // call this to setup next and prev btns states
            checkScrollBounds(carousel);

        });

    };

}));