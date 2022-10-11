(() => {
    angular
        .module('evaluation')
        .factory('signupService', signupService);

    signupService.$inject = ['httpService', 'realUserService', 'legalUserService', '$q'];
    function signupService(httpService, realUserService, legalUserService, $q) {
        let service = {
            register: register
        };

        return service;

        function register(model, type) {
            if (type === 'real')
                return realUserService.register(model);
            else if (type === 'legal')
                return legalUserService.register(model);
            else
                return $q.reject('type is incorrect!');
        }
    }
})();