(() => {
    angular
        .module('evaluation')
        .controller('VerifyCellphoneController', VerifyCellphoneController);

    VerifyCellphoneController.$inject = ['ObjectService', 'loadingService', 'alertService', '$routeParams', '$location', 'toolsService', 'userService'];
    function VerifyCellphoneController(ObjectService, loadingService, alertService, $routeParams, $location, toolsService, userService) {
        let verify = this;

        if (!toolsService.validate.guid($routeParams.userId))
            $location.path('not-found');
        
        verify.main = new ObjectService();
        verify.main.submit = submit;

        function submit() {
            loadingService.show();
            verify.main.model.ID = $routeParams.userId;
            userService.verifyCellPhone(verify.main.model).then(() => {
                loadingService.hide();
                alertService.success('شماره تلفن همراه با موفقیت تایید شد');
                $location.path('login');
            }).catch((error) => {
                loadingService.hide();
                alertService.error(error);
            });
        }
    }
})();