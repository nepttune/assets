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

var popoverCache = {};

function getPopover(popover)
{
    if (popover.data('element'))
    {
        return $(popover.data('element')[0]).html();
    }

    var divId = 'popover' + $.now();

    if (popover.data('ajax'))
    {
        if (popoverCache[popover.data('ajax')])
        {
            return popoverCache[popover.data('ajax')];
        }

        $.nette.ajax({
            url: popover.data('ajax'),
            method: 'GET',
            success: function (payload){
                popoverCache[popover.data('ajax')] = payload.html;
                $('#' + divId).html(payload.html);
            }
        });
    }

    return '<div id="'+ divId +'">Loading...</div>';
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
            var mapProp = {
                center: new google.maps.LatLng($(this).data('lat'), $(this).data('lng')),
                zoom: $(this).data('zoom')};
            var map = new google.maps.Map($(this)[0], mapProp);
        });
    });
}

function refreshPlugins(context)
{
    $(context).find('.iframePopup').magnificPopup({type: 'iframe'});
    $(context).find('.ajaxPopup').magnificPopup({type: 'ajax'});
    $(context).find('.imagePopup').magnificPopup({type: 'image'});
    $(context).find('.galleryPopup').magnificPopup({type: 'image', delegate: 'a.galleryItem', gallery:{enabled:true}});
    $(context).find('.photoswipe').each(function() {initPhotoswipe($(this));});
    $(context).find('[data-toggle="tooltip"]').tooltip();
    $(context).find('[data-toggle="popover"]').popover({
        html: true,
        container: 'body',
        content: function() {return getPopover($(this));},
        trigger: 'hover focus'
    });
    $(context).find('[target="_export"], a.exportLnk').click(function(event){
        event.preventDefault();
        window.open($(this).attr('href'), '_blank', 'status=no,toolbar=no,scrollbars=yes,titlebar=no,menubar=no,resizable=yes,width=640,height=480,directories=no,location=no')
    });
}

$(document).ready(function ()
{
    $.nette.ext('snippets').after(function (el)
    {
        refreshPlugins(el);
    });
    $.nette.init();

    refreshPlugins(document.body);
    
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
