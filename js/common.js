function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function initPopover(elm)
{
    const popoverOptions = {
        html: true,
        container: 'body',
        placement: 'top',
        trigger: 'hover focus',
        boundary: 'window'
    };

    if (elm.data('content')) {
        elm.popover(Object.assign({
            content: elm.data('content')
        }, popoverOptions)).popover('show');
    } else if (elm.data('element')) {
        elm.popover(Object.assign({
            content:  $(elm.data('element')[0]).html()
        }, popoverOptions)).popover('show');
    } else if (elm.data('ajax')) {
        $.nette.ajax({
            url: elm.data('ajax'),
            method: 'GET',
            success: function (payload){
                elm.popover(Object.assign({
                    content:  payload.html
                }, popoverOptions));
                
                if (elm.is(':hover')) {
                    elm.popover('show');
                }
            }
        });
    }
}

function initPhotoswipe(photoswipe) {
    var items = [];
    photoswipe.find('a.galleryItem').each(function() {
        var size = $(this).data('size').split('x');
        var item = {src: $(this).attr('href'), title: $(this).data('caption'), w: size[0], h: size[1]};
        items.push(item);
    });
    photoswipe.on('click', 'a.galleryItem', function(event) {
        event.preventDefault();
        var options = {
            index: photoswipe.find('a.galleryItem').index(this),
            bgOpacity: 0.85,
            showHideOpacity: true,
            pinchToClose: false,
            closeOnScroll: false,
            clickToCloseNonZoomable: false,
            shareButtons: [
                {id:'download', label:'Download image', url:'{{raw_image_url}}', download:true}
            ]
        };
        var lightBox = new PhotoSwipe($('.pswp')[0], PhotoSwipeUI_Default, items, options);
        lightBox.init();
    });
}

function initGoogleMaps() {
    $(document).ready(function(){
        $(document.body).find('.googleMap').each(function() {
            var center = new google.maps.LatLng($(this).data('lat'), $(this).data('lng'));
            var mapProp = { center: center, zoom: $(this).data('zoom')};
            var map = new google.maps.Map($(this)[0], mapProp);
            var marker = new google.maps.Marker({ position: center, map: map, title: 'Zde' });
        });
    });
}

var refreshPlugins = [];

refreshPlugins.push(function(el) {
    var ajaxFn = function(e) { e.preventDefault(); $(this).netteAjax(e);}
    $(el).find('a.ajax').on('click', ajaxFn);
    $(el).find('form.ajax').on('submit', ajaxFn);
    $(el).find('input.ajax[type="submit"], input.ajax[type="image"], button.ajax[type="submit"]').on('submit', ajaxFn);
    $(el).find('.iframePopup').magnificPopup({type: 'iframe'});
    $(el).find('.ajaxPopup').magnificPopup({type: 'ajax'});
    $(el).find('.imagePopup').magnificPopup({type: 'image'});
    $(el).find('.galleryPopup').magnificPopup({type: 'image', delegate: 'a.galleryItem', gallery:{enabled:true}});
    $(el).find('.closePopup').on('click', function (e) { setTimeout(function () { window.top.$.magnificPopup.close();});});
    $(el).find('.photoswipe').each(function() { initPhotoswipe($(this));});
    $(el).find('[data-toggle="tooltip"]').tooltip();
    $(el).find('[data-toggle="popover"]').one('mouseenter', function(e) { initPopover($(this));});
    $(el).find('[target="_export"], a.exportLnk').click(function(e) { e.preventDefault();
        window.open($(this).attr('href'), '_blank', 'status=no,toolbar=no,scrollbars=yes,titlebar=no,menubar=no,resizable=yes,width=640,height=480,directories=no,location=no')
    });
});

function callRefreshPlugins(el) {
    for (var j = 0; j < refreshPlugins.length; j++) {
        refreshPlugins[j](el);
    }
}

$(document).ready(function () {
    $.nette.ext('snippets').after(function (el) {
        callRefreshPlugins(el);
    });
    $.nette.ext('init', null);
    $.nette.init();

    $(document).ajaxComplete(function() {
        if ($('.mfp-content').is(':visible')) {
            callRefreshPlugins($('.mfp-content'));
        }
    });
    callRefreshPlugins(document.body);

    const cookiePopup = $('#cookie-popup');
    if (cookiePopup.length && !Cookies.get('cookiePopup'))
    {
        cookiePopup.find('button').click(function(event){
            Cookies.set('cookiePopup', true);
            cookiePopup.addClass('d-none');
            cookiePopup.removeClass('d-flex');
        });

        cookiePopup.addClass('d-flex');
        cookiePopup.removeClass('d-none');
    }
});
