(() => {
    angular
        .module('evaluation')
        .factory('itemService', itemService);

    itemService.$inject = ['httpService'];
    function itemService(httpService) {
        let service = {
            save: save
            , remove: remove
            , get: get
            , list: list
        };

        return service;

        function save(model) {
            return httpService.Item.Save(model);
        }
        function remove (model) {
            return httpService.Item.Delete(model);
        }
        function get (model) {
            return httpService.Item.Get(model);
        }
        function list (model) {
            return httpService.Item.List(model);
        }
    }
})();