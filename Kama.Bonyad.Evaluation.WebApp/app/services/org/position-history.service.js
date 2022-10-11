(() => {
    angular
        .module('evaluation')
        .factory('positionHistoryService', positionHistoryService);

    positionHistoryService.$inject = ['httpService', '$q', 'toolsService'];
    function positionHistoryService(httpService, $q, toolsService) {
        let service = {
            list: list
            , save: save
            , remove: remove
            , get: get
        };

        return service;

        function list(model) {
            return httpService.PositionHistory.List(model);
        }
        function remove(model) {
            return httpService.PositionHistory.Remove(model);
        }
        function save(model) {
            model.errors = [];

            if (model.errors.length)
                return $q.reject();

            if (!model.ID)
                return httpService.PositionHistory.Add(model);
            else
                return httpService.PositionHistory.Edit(model);

        }
        function get(model) {
            return httpService.PositionHistory.Get(model);
        }
    }
})();