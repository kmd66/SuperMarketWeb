(() => {
    angular
        .module('evaluation')
        .factory('informationService', informationService);

    informationService.$inject = ['httpService'];
    function informationService(httpService) {
        let service = {
            save: save
            , list: list
        };

        return service;

        function save(model) {
            return httpService.Information.Save(model);
        }
        function list(model) {
            return httpService.Information.List(model);
        }
    }
})();