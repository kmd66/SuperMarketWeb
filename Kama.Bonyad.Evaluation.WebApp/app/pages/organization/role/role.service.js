(() => {
    angular
        .module('evaluation')
        .factory('roleService', roleService);

    roleService.$inject = ['httpService', '$q'];
    function roleService(httpService, $q) {
        let service = {
            get: get
            , list: list
            , remove: remove
            , save: save
        }

        return service;

        function get(model) {
            return httpService.Role.Get(model);
        }
        function list(model) {
            return httpService.Role.List(model);
        }
        function remove(model) {
            return httpService.Role.Remove(model);
        }
        function save(model) {
            model.errors = [];

            if (!model.Name)
                model.errors.push('عنوان نقش را وارد کنید.');

            if (model.errors.length)
                return $q.reject();
            
            if (!model.ID) 
                return httpService.Role.Add(model);
            else
                return httpService.Role.Edit(model);
        }
    }
})();