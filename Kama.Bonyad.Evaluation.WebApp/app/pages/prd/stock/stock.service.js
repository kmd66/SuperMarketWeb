(() => {
    angular
        .module('evaluation')
        .factory('stockService', stockService);

    stockService.$inject = ['httpService'];
    function stockService(httpService) {
        let service = {
            save: save
            , addList: addList
            , get: get
            , list: list
            , remove: remove
            , changeState: changeState
        };

        return service;

        function save(model) {
            return httpService.Stock.Save(model);
        }
        function addList(model) {
            return httpService.Stock.AddList(model);
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
        function changeState(model) {
            return httpService.Stock.ChangeState(model);
        }
    }
})();