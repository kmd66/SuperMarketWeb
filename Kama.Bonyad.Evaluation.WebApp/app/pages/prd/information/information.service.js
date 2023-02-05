(() => {
    angular
        .module('evaluation')
        .factory('informationService', informationService);

    informationService.$inject = ['httpService'];
    function informationService(httpService) {
        let service = {
            save: save
            , list: list
            , addClassificationInformation
            , listClassificationInformation
            , deleteClassificationInformation
        };

        return service;

        function save(model) {
            return httpService.Information.Save(model);
        }
        function list(model) {
            return httpService.Information.List(model);
        }
        function addClassificationInformation(model) {
            return httpService.Information.AddClassificationInformation(model);
        }
        function listClassificationInformation(model) {
            return httpService.Information.ListClassificationInformation(model);
        }
        function deleteClassificationInformation(model) {
            return httpService.Information.DeleteClassificationInformation(model);
        }
    }
})();