(() => {
    angular
        .module('evaluation')
        .factory('stockService', stockService);

    stockService.$inject = ['httpService'];
    function stockService(httpService) {
        let service = {
            save: save
            , get: get
            , list: list
            , remove: remove
        };

        return service;

        function save(model) {
            return httpService.Stock.Save(model);
        }
        function get (model) {
            return httpService.Stock.Get(model);
        }
        function list(model) {
            return httpService.Stock.List(model);
        }
        function remove(model) {
            return httpService.Stock.Delete(model);
        }
    }
})();