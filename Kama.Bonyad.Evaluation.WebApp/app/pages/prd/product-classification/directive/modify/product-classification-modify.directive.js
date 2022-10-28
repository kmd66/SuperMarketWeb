(() => {
    angular
        .module('evaluation')
        .directive('kamaProductClassificationModify', kamaProductClassificationModify);

    kamaProductClassificationModify.$inject = ['productClassificationService', 'loadingService', 'alertService'];
    function kamaProductClassificationModify(productClassificationService, loadingService, alertService) {
        let directive = {
            link: {
                pre: preLink
            }
            , template: require('./product-classification-modify.directive.html')
            , restrict: 'E'
            , scope: {
                main: '=main'
                , modify: '=modify'
                , cartable: '=cartable'
            }
        };

        return directive;
        function preLink(scope, element, attrs) {
            let productClassific = scope;

            productClassific.modify.save = save;
            productClassific.modify.img = {
                Type : 1
            };

            productClassific.modify.parentProductClassificDropdown = {
                bindingObject: productClassific.modify
                , parameters: { GuID: 'ParentID' }
                , select2: true
            };

            function save() {

                loadingService.show();
                productClassificationService.save(productClassific.modify.model).then((result) => {
                    productClassific.modify.model = result;
                    return productClassific.modify.img.save(productClassific.modify.model.GuID);
                }).then((result) => {
                    alertService.success('دسته بندی با موفقیت ثبت شد');
                    productClassific.main.changeState.cartable();
                    productClassific.main.setParent(true);
                }).catch((error) => {

                    alertService.error(error);
                    loadingService.hide();
                });

            }

        }
    }
})();
