(() => {
    angular
        .module('evaluation')
        .controller('NotFoundController', NotFoundController);

    NotFoundController.$inject = ['ObjectService', 'authenticationService'];
    function NotFoundController(ObjectService, authenticationService) {
        let notFound = this;

        notFound.main = new ObjectService();
        notFound.main.authenticated = authenticationService.isAuthenticated();
    }
})();