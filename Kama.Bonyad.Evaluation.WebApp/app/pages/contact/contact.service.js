(() => {
    angular
        .module('evaluation')
        .factory('contactService', contactService);

    contactService.$inject = ['httpService', '$q', 'toolsService'];
    function contactService(httpService, $q, toolsService) {
        let service = {
            add: add
            , list: list
        };

        return service;

        function add(model) {
            model.errors = [];

            if (!model.Title)
                model.errors.push('موضوع را وارد کنید.');
            if (!model.Content)
                model.errors.push('متن پیام را وارد کنید.');
            if (model.Email && !toolsService.validate.email(model.Email))
                model.errors.push('ایمیل وارد شده اشتباه است.');
            if (model.Tel && !toolsService.validate.phoneNumber(model.Tel))
                model.errors.push('شماره تماس وارد شده اشتباه است');
            if ((!model.Email || !toolsService.validate.email(model.Email)) && (!model.Tel || !toolsService.validate.phoneNumber(model.Tel)))
                model.errors.push('به منظور پاسخ به پیام شما ورود یکی از مقادیر ایمیل یا شماره تماس الزامی است.');

            if (model.errors.length)
                return $q.reject();

            return httpService.Contact.Add(model);
        }
        function list(model) {
            return httpService.Contact.List(model);
        }
    }
})();