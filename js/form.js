const selectOptions =
{
    width: '100%'
};
const iCheckOptions =
{
    checkboxClass: 'icheckbox_square-red',
    radioClass: 'iradio_square-red'
};

Nette.showFormErrors = function (form, errors)
{
    $(form).find('.has-error').removeClass('has-error');
    $(form).find('span.help-block').remove();

    for (var i = 0; i < errors.length; i++)
    {
        $(errors[i].element).parent().addClass('has-error');
        $(errors[i].element).parent().append('<span class="help-block">' + errors[i].message + '</span>');
    }

    if (errors.length > 0)
    {
        var elem = errors[0].element;

        if (elem.nodeName === 'SELECT')
        {
            $(elem).parent().find('input[type="text"]').trigger('click');
            return;
        }
        $(elem).focus();
    }
};

showFormErrorsBS4 = function (form, errors)
{
    $(form).find('.is-invalid').removeClass('is-invalid');
    $(form).find('.invalid-feedback').remove();

    for (var i = 0; i < errors.length; i++)
    {
        $(errors[i].element).addClass('is-invalid');
        $(errors[i].element).closest('.form-group').children().last().append('<div class="invalid-feedback d-block">' + errors[i].message + '</div>');
    }
};

form_refereshPlugins = refreshPlugins;

refreshPlugins = function (el)
{
    form_refereshPlugins(el);

    var checkInputs = $(el).find('input[type="radio"], input[type="checkbox"]');
    checkInputs.iCheck(iCheckOptions);
    checkInputs.on('ifChanged', function (event)
    {
        event = document.createEvent('HTMLEvents');
        event.initEvent('change', true, true);
        event.eventName = 'change';

        this.dispatchEvent(event);
    });

    $(el).find('select').not('[data-ajax]').select2(selectOptions);
    $(el).find('select[data-ajax]').each(function() {
        $(this).select2(Object.assign(selectOptions, {
            tokenSeparators: [',', ' '],
            ajax: {
                url: $(this).data('ajax'),
                delay: 250,
                dataType: 'json',
                data: function (params) {
                    return {
                        q: params.term
                    };
                },
                processResults: function (data, params) {
                    var result = [];
                    $.each(data, function (key,  value) {
                        result.push({
                            id: key,
                            text: value
                        });
                    });
                    return {
                        results: result
                    };
                }
            }
        }));
    });
    $(el).find('select[data-dependentselectbox]').dependentSelectBox();
    $(el).find('select').on('select2:select', function (event) {
        event = document.createEvent('HTMLEvents');
        event.initEvent('change', true, true);
        event.eventName = 'change';

        this.dispatchEvent(event);
    });
    
    $(el).find('input[type="date"]').each(function(index, element) {
        $(element).pickadate({
            min: $(element).attr('min'),
            max: $(element).attr('max'),
            format: 'd. m. yyyy',
            formatSubmit: 'yyyy-mm-dd',
            hiddenName: true
        });
        if ($(element).val()) {
            $(element).pickadate('set').set('select', $(element).val(), { format: 'yyyy-mm-dd' });
        }
    });

    if ($(el).find('.g-recaptcha').length)
    {
        g_ReCaptchaOnLoad();
    }
};
