(() => {
    angular
        .module('evaluation')
        .factory('productClassificationService', productClassificationService);

    productClassificationService.$inject = ['httpService'];
    function productClassificationService(httpService) {
        let service = {
            save: save
            , remove: remove
            , get: get
            , list: list
        };

        return service;

        function save(model) {
            return httpService.ProductClassification.Save(model);
        }
        function remove (model) {
            return httpService.ProductClassification.Delete(model);
        }
        function get (model) {
            return httpService.ProductClassification.Get(model);
        }
        function list (model) {
            return httpService.ProductClassification.List(model);
        }
    }
})();