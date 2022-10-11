(() => {
    angular
        .module('evaluation')
        .factory('tagService', tagService);

    tagService.$inject = ['httpService', '$rootScope', 'globalService'];
    function tagService(httpService, $rootScope, globalService) {
        var service = {
            save: save
            , remove: remove
            , list: list
        };

        return service;

        function save(model) {
            return httpService.Tag.Save(model);
        }
        function remove(model) {
            return httpService.Tag.Delete(model);
        }
        function list(model) {
            return httpService.Tag.List(model);
        }
    }
})();