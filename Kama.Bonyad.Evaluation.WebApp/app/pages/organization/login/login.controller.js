(() => {
    angular
        .module('evaluation')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['ObjectService', 'userService', 'loadingService', 'alertService', 'authenticationService', 'positionService', 'globalService', '$window', '$routeParams', 'toolsService', '$location', '$q'];
    function LoginController(ObjectService, userService, loadingService, alertService, authenticationService, positionService, globalService, $window, $routeParams, toolsService, $location, $q) {
        let login = this;

        login.main = new ObjectService();

        login.main.state = 'login';
        login.main.forgotPassword = forgotPassword;
        login.main.getToken = getToken;
        login.main.refreshCaptcha = refreshCaptcha;

        init();

        function init() {
            loadingService.show();
            if ($routeParams.state === 'forgot-password')
                login.main.state = 'forgot-password-type';

            userService.refreshCaptcha('tokenCaptcha', login.main).then(() => {
                return userService.refreshCaptcha('forgotPasswordCaptcha', login.main);
            }).then(loadingService.hide).catch(loadingService.hide);
        }
        function forgotPassword() {
            if (login.main.forgotPasswordType === 'sms' && !toolsService.validate.phoneNumber(login.main.model.CellPhone))
                return alertService.error('شماره تلفن همراه وارد شده اشتباه است');
            else if (login.main.forgotPasswordType === 'email' && !toolsService.validate.email(login.main.model.Email))
                return alertService.error('ایمیل وارد شده اشتباه است');

            delete login.main.model.UserName;
            loadingService.show();
            userService.forgotPassword({
                model: login.main.model
                , captcha: login.main.model.forgotPasswordCaptcha
                , type: login.main.forgotPasswordType
            }).then((result) => {
                loadingService.hide();
                $location.path(`reset-password/${login.main.forgotPasswordType}/${result.UserID}`);
            }).catch((error) => {
                userService.refreshCaptcha('forgotPasswordCaptcha', login.main).then((result) => {
                    loadingService.hide();
                    alertService.error(error);
                }).catch(loadingService.hide);
            });
        }
        function getToken() {
            loadingService.show();
            userService.getToken(login.main.model).then((token) => {
                authenticationService.setCredentials(JSON.parse(token));
                return positionService.listByUser();
            }).then((positions) => {
                if (positions.length > 0) {
                    if (!positions[0].CellPhoneVerified) {
                        authenticationService.clearCredentials();
                        return userService.sendSecurityCode({ Username: login.main.model.Username, type: 'sms' }).then(() => {
                            loadingService.hide();
                            alertService.warning('شماره تلفن همراه شما تایید نشده است');
                            $location.path(`verify-cellphone/${positions[0].UserID}`);
                        });
                    }
                    else if (positions[0].PasswordExpired) {
                        authenticationService.clearCredentials();
                        return userService.sendSecurityCode({ Username: login.main.model.Username, type: 'sms' }).then(() => {
                            loadingService.hide();
                            alertService.warning('کلمه عبور شما منقضی شده است');
                            $location.path(`reset-password/expired/${positions[0].UserID}`);
                        });
                    }
                    else {
                        const currentPosition = positions.filter((pos) => { return pos.Default })[0] || positions[0];

                        globalService.set('currentUserPositions', positions);
                        globalService.set('currentUserPosition', currentPosition);

                        document.body.innerHTML = '';
                        $window.location.href = $window.location.origin; // logged in succesfully
                    }
                }
                else
                    return $q.reject('مجوز دسترسی به این سامانه را ندارید');
            }).catch((error) => {
                authenticationService.clearCredentials();
                userService.refreshCaptcha('tokenCaptcha', login.main).then(() => {
                    loadingService.hide();
                    alertService.error(error);
                }).catch(loadingService.hide);
            });
        }
        function refreshCaptcha(name) {
            loadingService.show();
            userService.refreshCaptcha(name, login.main).then(loadingService.hide).catch(loadingService.hide);
        }
    }
})();