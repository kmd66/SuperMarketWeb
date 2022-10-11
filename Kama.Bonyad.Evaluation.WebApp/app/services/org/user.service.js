(() => {
    angular
        .module('evaluation')
        .factory('userService', userService);

    userService.$inject = ['httpService', '$q', 'authenticationService', '$location', '$window', 'loadingService', 'toolsService', '$timeout'];
    function userService(httpService, $q, authenticationService, $location, $window, loadingService, toolsService, $timeout) {
        let service = {
            forgotPassword: forgotPassword
            , getCaptcha: getCaptcha
            , getToken: getToken
            , getRefreshToken: getRefreshToken
            , getByNationalCode: getByNationalCode
            , logout: logout
            , refreshCaptcha: refreshCaptcha
            , sendRawSecurityCode: sendRawSecurityCode
            , sendSecurityCode: sendSecurityCode
            , setPassword: setPassword
            , setPasswordWithSecuriyStamp: setPasswordWithSecuriyStamp
            , setPosition: setPosition
            , validateSecurityCode: validateSecurityCode
            , verifyCellPhone: verifyCellPhone
            , saveSettings: saveSettings
            , getSettings: getSettings
            , list: list
            , save: save
            , resetPassword: resetPassword
        };

        return service;

        function saveSettings(model) {
            return httpService.User.SaveSettings(model);
        }
        function save(model) {
            model.errors = [];

            if (!model.NationalCode)
                model.errors.push('کد ملی را وارد کنید.');
            else if (!toolsService.validate.nationalCode(model.NationalCode))
                model.errors.push('کد ملی وارد شده اشتباه است.');
            if (!model.FirstName)
                model.errors.push('نام را وارد کنید.');
            if (!model.LastName)
                model.errors.push('نام خانوادگی را وارد کنید.');
            if (!model.CellPhone)
                model.errors.push('شماره همراه را وارد کنید.');
            else if (!toolsService.validate.phoneNumber(model.CellPhone))
                model.errors.push('شماره همراه وارد شده اشتباه است.');
            if (model.Email && !toolsService.validate.email(model.Email))
                model.errors.push('پست الکترونیکی وارد شده اشتباه است.');
            //if (!model.Password)
            //    model.errors.push('رمز عبور را وارد کنید.');

            if (model.errors.length)
                return $q.reject();

            if (!model.ID)
                return httpService.User.Add(model);
            else
                return httpService.User.Edit(model);
        }
        function getSettings() {
            return httpService.User.GetSettings();
        }
        function forgotPassword(model) {
            return httpService.User.ForgotPassword(model);

        }
        function getByNationalCode(model) {
            return httpService.User.GetByNationalCode(model);
        }
        function getCaptcha(model) {
            return httpService.User.GetCaptcha(model);
        }
        function getToken(model) {
            if (!model.LoginType || model.LoginType === 1) {
                if (!model.Username || !model.Password)
                    return $q.reject('لطفا نام کاربری و کلمه عبور را وارد کنید');
            }

            return httpService.User.GetToken(model);
        }
        function getRefreshToken(model) {
            return httpService.User.GetRefreshToken(model);
        }
        function logout() {
            loadingService.show();
            return $q.resolve().then(() => {
                authenticationService.clearCredentials();
                $location.path('/');
                $timeout(() => {
                    document.body.innerHTML = '';
                    $window.location.reload();
                }, 0);
            });
        }
        function refreshCaptcha(name, obj) {
            return getCaptcha({ name: name }).then((result) => {
                if (result.Captcha)
                    obj[name] = `data:image/png;base64,${result.Captcha}`;
            });
        }
        function sendRawSecurityCode(model) {
            if (!model.CellPhone)
                return $q.reject('تلفن همراه را وارد کنید');
            else if (!toolsService.validate.phoneNumber(model.CellPhone))
                return $q.reject('تلفن همراه وارد شده اشتباه است');

            return httpService.User.SendRawSecurityCode(model);
        }
        function sendSecurityCode(model) {
            return httpService.User.SendSecurityCode(model);
        }
        function setPassword(model) {
            model.errors = [];

            if (!model.OldPassword)
                model.errors.push('کلمه عبور فعلی را وارد کنید.');
            if (!model.NewPassword)
                model.errors.push('کلمه عبور جدید را وارد کنید.');
            else if (model.NewPassword.length < 10)
                model.errors.push('کلمه عبور باید حداقل 10 کاراکتر باشد.');
            else if (!model.ConfirmPassword)
                model.errors.push('تکرار کلمه عبور را وارد کنید.');
            else if (model.NewPassword !== model.ConfirmPassword)
                model.errors.push('کلمه عبور جدید با تکرار کلمه عبور هم‌خوانی ندارد.');

            if (model.errors.length)
                return $q.reject();

            return httpService.User.SetPassword(model);
        }
        function setPasswordWithSecuriyStamp(model) {
            model.errors = [];

            if (!model.SecurityStamp)
                model.errors.push('کد امنیتی را وارد کنید.');
            if (!model.Password)
                model.errors.push('کلمه عبور جدید را وارد کنید');
            else if (model.Password.length < 10)
                model.errors.push('کلمه عبور باید حداقل 10 کاراکتر باشد.');
            else if (!model.ConfirmPassword)
                model.errors.push('تکرار کلمه عبور جدید را وارد کنید.');
            else if (model.Password !== model.ConfirmPassword)
                model.errors.push('کلمه عبور جدید با تکرار کلمه عبور هم‌خوانی ندارد.');

            if (model.errors.length)
                return $q.reject();

            return httpService.User.SetPasswordWithSecuriyStamp(model);
        }
        function setPosition(model) {
            return httpService.User.SetPosition(model);
        }
        function validateSecurityCode(model) {
            if (!model.securityCode)
                return $q.reject('کد فعال‌سازی را وارد کنید');

            return httpService.User.ValidateSecurityCode(model);
        }
        function verifyCellPhone(model) {
            model.errors = [];

            if (!model.SecurityStamp)
                model.errors.push('کد تایید را وارد کنید.');

            if (model.errors.length)
                return $q.reject();

            return httpService.User.VerifyCellPhone(model);
        }
        function list() {
            return httpService.User.List();
        }
        function resetPassword(model) {
            return httpService.User.ResetPassword(model);
        }
    }
})();