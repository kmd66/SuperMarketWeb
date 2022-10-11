(() => {
    angular
        .module('evaluation')
        .factory('commandService', commandService);

    commandService.$inject = ['httpService', '$q'];
    function commandService(httpService, $q) {
        let service = {
            list: list
            , remove: remove
            , save: save
        }

        return service;

        function list(model) {
            return httpService.Command.List(model);
        }
        function remove(model) {
            return httpService.Command.Remove(model);
        }
        function save(model) {
            model.errors = [];

            if (!model.Type)
                model.errors.push('نوع را مشخص کنید.');
            if (!model.Name)
                model.errors.push('نام (انگلیسی) را وارد کنید.');
            else // make first letter uppercase
                model.Name = model.Name[0].toUpperCase() + model.Name.slice(1, model.Name.length);
            if (!model.Title)
                model.errors.push('عنوان را وارد کنید.');

            if (model.errors.length)
                return $q.reject();
            
            if (!model.ID) 
                return httpService.Command.Add(model);
            else
                return httpService.Command.Edit(model);
        }
    }
})();