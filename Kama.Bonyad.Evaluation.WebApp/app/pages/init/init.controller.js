(() => {
    angular
        .module('evaluation')
        .controller('InitController', InitController);

    InitController.$inject = ['ObjectService', '$rootScope', '$location', 'authenticationService', 'positionService', 'alertService', '$timeout', 'globalService', 'userService'];
    function InitController(ObjectService, $rootScope, $location, authenticationService, positionService, alertService, $timeout, globalService, userService) {
        let init = this
            , path = ($rootScope.pathBuffer && $rootScope.pathBuffer !== 'init' ? $rootScope.pathBuffer : '/');

        init.main = new ObjectService();

        $timeout(() => { init.main.displayError = true }, 30000);

        if (authenticationService.isAuthenticated() && !$rootScope.permissions) {
            positionService.getPermissions({ positionId: $rootScope.currentUserPosition.ID }).then((permissions) => {
                $rootScope.permissions = permissions;
                return userService.getSettings();
            }).then((result) => {
                let settings = result ? JSON.parse(result.Setting) : {};
                settings.PageSize = settings.PageSize ? parseInt(settings.PageSize) : 5;
                return globalService.set('userSettings', settings);
            }).then(() => {
                $location.path(path);
            }).catch(alertService.error);
        }
        else
            $location.path(path);
    }
})();