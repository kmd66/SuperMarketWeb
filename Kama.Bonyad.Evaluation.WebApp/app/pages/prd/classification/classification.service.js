(() => {
    angular
        .module('evaluation')
        .factory('classificationService', classificationService);

    classificationService.$inject = ['httpService'];
    function classificationService(httpService) {
        let service = {
            save: save
            , remove: remove
            , get: get
            , list: list
        };

        return service;

        function save(model) {
            return httpService.Classification.Save(model);
        }
        function remove (model) {
            return httpService.Classification.Delete(model);
        }
        function get (model) {
            return httpService.Classification.Get(model);
        }
        function list (model) {
            return httpService.Classification.List(model);
        }
    }
})();