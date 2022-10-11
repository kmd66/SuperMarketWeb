(() => {
    angular
        .module('evaluation')
        .directive('kamaOutsideMenu', kamaOutsideMenu);

    kamaOutsideMenu.$inject = ['positionService', '$rootScope'];
    function kamaOutsideMenu(positionService, $rootScope) {
        var directive = {
            restrict: 'E'
            , link: link
            , template: require('./outside-menu.html')
            , scope: {
                activeTab: '@?activeTab'
            }
        };

        return directive;

        function link(scope, element, attrs) {
            scope.appInfo = $rootScope.appInfo;
            positionService.getOnlineCount().then((result) => {
                scope.onlineUsersCount = result.UsersCount;
            });
        }
    }
})();