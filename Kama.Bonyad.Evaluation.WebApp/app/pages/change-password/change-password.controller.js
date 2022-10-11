(() => {
    angular
        .module('evaluation')
        .controller('ChangePasswordController', ChangePasswordController);

    ChangePasswordController.$inject = ['ObjectService', 'loadingService', 'alertService', 'userService'];
    function ChangePasswordController(ObjectService, loadingService, alertService, userService) {
        let changePassword = this;

        changePassword.main = new ObjectService();
        changePassword.main.setPassword = setPassword;

        function setPassword() {
            loadingService.show();
            userService.setPassword(changePassword.main.model).then(() => {
                return userService.logout();
            }).catch((error) => {
                loadingService.hide();
                alertService.error(error);
            })
        }
    }
})();