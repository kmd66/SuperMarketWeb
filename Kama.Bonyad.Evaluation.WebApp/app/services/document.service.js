(() => {
    angular
        .module('evaluation')
        .factory('documentService', documentService);

    documentService.$inject = ['httpService', '$rootScope', 'globalService'];
    function documentService(httpService, $rootScope, globalService) {
        var service = {
            statistics: statistics
            ,listTypeOfDocument: listTypeOfDocument
        };

        return service;

        function statistics() {
            return httpService.Document.Statistics().then(function (stats) {
                return $rootScope.documentStats = stats;
            });
        }

        function listTypeOfDocument() {
            //return httpService.Document.ListTypeOfDocument().then(function (stats) {
            //    return $rootScope.documentStats = stats;
            //});
        }
    }
})();