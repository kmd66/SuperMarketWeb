(() => {
    angular
        .module('evaluation')
        .factory('homeService', homeService);

    homeService.$inject = ['httpService'];
    function homeService(httpService) {
        let service = {
            getOnlineUsersCount: getOnlineUsersCount
        };

        return service;

        function getOnlineUsersCount(model) {
            return httpService.Home.GetOnlineUsersCount(model);
        }
    }
})();