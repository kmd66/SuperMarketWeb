﻿(() => {
    angular
        .module('evaluation')
        .directive('kamaBrandModify', kamaBrandModify);

    kamaBrandModify.$inject = ['brandService', 'loadingService', 'alertService'];
    function kamaBrandModify(brandService, loadingService, alertService) {
        let directive = {
            link: {
                pre: preLink
            }
            , template: require('./brand-modify.directive.html')
            , restrict: 'E'
            , scope: {
                main: '=main'
                , modify: '=modify'
                , cartable: '=cartable'
            }
        };

        return directive;
        function preLink(scope, element, attrs) {
            let brand = scope;

            brand.modify.save = save;

            brand.modify.parentBrandDropdown = {
                bindingObject: brand.modify
                , parameters: { ID: 'ParentID' }
                , select2: true
            };

            function save() {

                loadingService.show();
                brandService.save(brand.modify.model).then((result) => {
                    brand.modify.model = result;
                    alertService.success('دسته بندی با موفقیت ثبت شد');
                    brand.main.changeState.cartable();
                    brand.cartable.grid.getlist(true);
                }).catch((error) => {
                    alertService.error(error);
                    loadingService.hide();
                });

            }

        }
    }
})();
