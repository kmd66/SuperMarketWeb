(() => {
    angular
        .module('evaluation')
        .factory('productService', productService);

    productService.$inject = ['httpService'];
    function productService(httpService) {
        let service = {
            save: save
            , remove: remove
            , get: get
            , list: list
        };

        return service;

        function save(model) {
            return httpService.Product.Save(model);
        }
        function remove (model) {
            return httpService.Product.Delete(model);
        }
        function get (model) {
            return httpService.Product.Get(model);
        }
        function list (model) {
            return httpService.Product.List(model);
        }
    }
})();