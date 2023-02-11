(() => {
    angular
        .module('evaluation')
        .directive('kamaDepoAdd', kamaDepoAdd);

    kamaDepoAdd.$inject = ['depoService', 'loadingService', 'alertService'];
    function kamaDepoAdd(depoService, loadingService, alertService) {
        let directive = {
            link: {
                pre: preLink
            }
            , template: require('./depo-add.directive.html')
            , restrict: 'E'
            , scope: {
                main: '=main'
                , add: '=add'
                , cartable: '=cartable'
            }
        };

        return directive;
        function preLink(scope, element, attrs) {
            let depo = scope;

            depo.add.save = save;


            depo.add.itemDropdown = {
                bindingObject: depo.add
                , displayName: ['FaName']
                , parameters: { ID: 'ItemID' }
                , select2: true
            };

            function save() {
                loadingService.show();
                depoService.enterStorage(depo.add.model).then((result) => {
                    depo.add.model = result;
                    alertService.success('دسته بندی با موفقیت ثبت شد');
                    depo.main.changeState.cartable();
                    return depo.cartable.grid.getlist(true);
                }).catch(alertService.error).finally(loadingService.hide);

            }

        }
    }
})();
