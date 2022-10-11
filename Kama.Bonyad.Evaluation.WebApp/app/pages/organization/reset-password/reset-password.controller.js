(() => {
    angular
        .module('evaluation')
        .controller('ResetPasswordController', ResetPasswordController);

    ResetPasswordController.$inject = ['ObjectService', 'loadingService', 'alertService', '$routeParams', '$location', 'userService'];
    function ResetPasswordController(ObjectService, loadingService, alertService, $routeParams, $location, userService) {
        let resetPassword = this;

        resetPassword.main = new ObjectService();
        resetPassword.main.type = $routeParams.type;
        resetPassword.main.submit = submit;

        function submit() {
            loadingService.show();
            resetPassword.main.model.ID = $routeParams.userId;
            userService.setPasswordWithSecuriyStamp(resetPassword.main.model).then(() => {
                alertService.success('کلمه عبور با موفقیت تغییر کرد');
                $location.path('login');
            }).catch((error) => {
                loadingService.hide();
                alertService.error(error);
            });
        }
    }
})();