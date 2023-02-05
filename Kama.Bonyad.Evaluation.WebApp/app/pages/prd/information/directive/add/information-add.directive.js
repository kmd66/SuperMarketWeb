(() => {
    angular
        .module('evaluation')
        .directive('kamaInformationAdd', kamaInformationAdd);

    kamaInformationAdd.$inject = ['informationService', 'loadingService', 'alertService', '$timeout'];
    function kamaInformationAdd(informationService, loadingService, alertService, $timeout) {
        let directive = {
            link: {
                pre: preLink
            }
            , template: require('./information-add.directive.html')
            , restrict: 'E'
            , scope: {
                main: '=main'
                , cartable: '=cartable'
                , add: '=add'
            }
        };

        return directive;
        function preLink(scope, element, attrs) {
            let information = scope;

            information.add.save = save;

            function save() {
                loadingService.show();
                informationService.save(information.add.model).then((result) => {
                    alertService.success('جنس با موفقیت ثبت شد');
                    information.main.changeState.cartable();
                    return information.cartable.grid.getlist(false);
                }).catch(alertService.error).finally(loadingService.hide);
            }
        }
    }
})();
