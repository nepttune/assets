function redrawControl(control)
{
    $.nette.ajax({
        method: 'GET',
        traditional: true,
        url: redrawControlUrl + '&control=' + control
    });
}

function redrawRow(control, rowId)
{
    $.nette.ajax({
        method: 'GET',
        traditional: true,
        url: redrawRowUrl + '&control=' + control + '&rowId=' + rowId
    });
}

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

function refreshPlugins(context)
{
    $(context).find('.iframePopup').magnificPopup({type: 'iframe'});
    $(context).find('.ajaxPopup').magnificPopup({type: 'ajax'});
    
    $(context).find('a[target="__export"]').click(function(event){
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
});