(() => {
    angular
        .module('evaluation')
        .factory('positionService', positionService);

    positionService.$inject = ['httpService', '$q'];
    function positionService(httpService, $q) {
        let service = {
            getPermissions: getPermissions
            , list: list
            , save: save
            , listByUser: listByUser
            , setDefault: setDefault
            , get: get
            , remove: remove
            , removeUser: removeUser
            , listExcel: listExcel
            , getOnlineCount: getOnlineCount
        };

        return service;

        function removeUser(model) {
            return httpService.Position.RemoveUser(model);
        }

        function remove(model) {
            return httpService.Position.Remove(model);
        }

        function getPermissions(model) {
            return httpService.Position.GetPermissions(model);
        }
        function list(model) {
            return httpService.Position.List(model);
        }
        function save(model) {
            model.errors = [];

            if (!model.DepartmentID)
                model.errors.push('محل کار را مشخص کنید.');
            if (!model.Type)
                model.errors.push('سمت را مشخص کنید.');

            if (model.errors.length)
                return $q.reject();

            return httpService.Position.Save(model);
        }
        function listByUser(model) {
            return httpService.Position.ListByUser(model);
        }
        function setDefault(model) {
            return httpService.Position.SetDefault(model);
        }

        function get(model) {

            return httpService.Position.Get(model);

        }

        function listExcel(model) {
            return httpService.Position.ListExcel(model);
        }

        function getOnlineCount(model) {
            return httpService.Position.GetOnlineCount(model);
        }

    }
})();