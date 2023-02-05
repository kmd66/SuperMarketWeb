(() => {
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
            brand.modify.img = {
                Type: 3
            };

            function save() {
                loadingService.show();
                brandService.save(brand.modify.model).then((result) => {
                    brand.modify.model = result;
                    return brand.modify.img.save(brand.modify.model.GuID);
                }).then((result) => {
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
