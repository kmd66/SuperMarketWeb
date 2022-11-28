(() => {
    angular
        .module('evaluation')
        .factory('brandService', brandService);

    brandService.$inject = ['httpService'];
    function brandService(httpService) {
        let service = {
            save: save
            , remove: remove
            , get: get
            , list: list
        };

        return service;

        function save(model) {
            return httpService.Brand.Save(model);
        }
        function remove (model) {
            return httpService.Brand.Delete(model);
        }
        function get (model) {
            return httpService.Brand.Get(model);
        }
        function list (model) {
            return httpService.Brand.List(model);
        }
    }
})();