(() => {
    angular
        .module('evaluation')
        .factory('depoService', depoService);

    depoService.$inject = ['httpService'];
    function depoService(httpService) {
        let service = {
            enterStorage: enterStorage
            , remove: remove
            , get: get
            , list: list
            , depoIndexList: depoIndexList
            , depoStorageList: depoStorageList
        };

        return service;

        function enterStorage(model) {
            return httpService.Depo.EnterStorage(model);
        }
        function remove (model) {
            return httpService.Depo.Delete(model);
        }
        function get (model) {
            return httpService.Depo.Get(model);
        }
        function list(model) {
            return httpService.Depo.List(model);
        }
        function depoIndexList(model) {
            return httpService.Depo.DepoIndexList(model);
        }
        function depoStorageList(model) {
            model.Type = 1;
            return depoIndexList(model);
        }
    }
})();