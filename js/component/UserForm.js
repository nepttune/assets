$(document).ready(function(){
    $('select[name="role"]').change(function(event){
        $('input[type="checkbox"][name^="access"]').iCheck('uncheck');

        const val = $(this).val();
        const role = roles[val];

        if (!val || !role)
        {
            return;
        }

        role.forEach(function(element){
            $('input[type="checkbox"][name="access[' + element + ']"]').iCheck('check');
        });
    });
});
