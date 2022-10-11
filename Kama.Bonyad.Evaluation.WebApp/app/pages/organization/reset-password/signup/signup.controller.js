(() => {
    angular
        .module('evaluation')
        .controller('SignupController', SignupController);

    SignupController.$inject = ['ObjectService', '$routeParams', 'loadingService', 'signupService', 'alertService', '$location', 'userService', 'smsSecurityStampService', '$window', 'globalService', 'authenticationService', 'positionService'];
    function SignupController(ObjectService, $routeParams, loadingService, signupService, alertService, $location, userService, smsSecurityStampService, $window, globalService, authenticationService, positionService) {
        let signup = this;

        if (['real', 'legal'].indexOf($routeParams.type) === -1)
            $location.path('not-found');

        signup.main = new ObjectService();
        signup.main.state = 'evaluation'; // 1. evaluation, 2. verify, 3. signup
        signup.main.securityCodeState = 'not-sent'; // 1. not-sent, 2. sent
        signup.main.type = $routeParams.type;
        signup.main.header = `ثبت نام ${signup.main.type === 'real' ? 'اشخاص حقیقی' : 'اشخاص حقوقی'}`;
        signup.main.register = register;
        signup.main.sendSecurityCode = sendSecurityCode;
        signup.main.verify = verify;

        function register() {
            loadingService.show();
            signupService.register(signup.main.model, signup.main.type).then((result) => {
                return userService.getToken({
                    Username: signup.main.model.NationalCode
                    , Password: signup.main.model.Password
                });
            }).then((token) => {
                authenticationService.setCredentials(JSON.parse(token));
                return positionService.listByUser();
            }).then((positions) => {
                const currentPosition = positions.filter((pos) => { return pos.Default })[0] || positions[0];

                globalService.set('currentUserPositions', positions);
                globalService.set('currentUserPosition', currentPosition);

                document.body.innerHTML = '';
                $window.location.href = $window.location.origin; // logged in succesfully
            }).catch((error) => {
                loadingService.hide();
                alertService.error(error);
                $('#content > div').animate({ scrollTop: 0 }, 'slow');
            });
        }
        function sendSecurityCode() {
            loadingService.show();
            smsSecurityStampService.send({ CellPhone: signup.main.model.CellPhone }).then(() => {
                signup.main.securityCodeState = 'sent';
                loadingService.hide();
            }).catch((error = 'خطا در ارسال کد امنیتی') => {
                loadingService.hide();
                alertService.error(error);
            });
        }
        function verify() {
            loadingService.show();
            smsSecurityStampService.verify({
                CellPhone: signup.main.model.CellPhone
                , Stamp: signup.main.model.SecurityCode
            }).then((result) => {
                signup.main.state = 'signup';
            }).catch((error) => {
                alertService.error(error || 'خطا در تایید کد فعال‌سازی');
            }).finally(loadingService.hide);
        }
    }
})();