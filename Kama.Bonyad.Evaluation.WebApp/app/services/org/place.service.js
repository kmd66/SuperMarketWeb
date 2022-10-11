(() => {
    angular
        .module('evaluation')
        .factory('placeService', placeService);

    placeService.$inject = ['httpService'];
    function placeService(httpService) {
        let service = {
            list: list
            , get: get
        };

        return service;

        function list(model) {
            return httpService.Place.List(model);
        }

        function get(model) {
            return httpService.Place.Get(model);
        }
    }
})();