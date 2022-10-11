(() => {
    angular
        .module('evaluation')
        .factory('departmentService', departmentService);

    departmentService.$inject = ['httpService', '$q'];
    function departmentService(httpService, $q) {
        let service = {
            save: save
            , remove: remove
            , list: list
            , get: get
        };

        return service;

        function save(model) {
            if (!model.ID)
                return httpService.Department.Add(model);
            else
                return httpService.Department.Edit(model);
        }
        function list(model) {
            return httpService.Department.List(model);
        }
        function remove(model) {
            return httpService.Department.Delete(model);
        }
        function get(model) {
            return httpService.Department.Get(model);
        }
    }
})();