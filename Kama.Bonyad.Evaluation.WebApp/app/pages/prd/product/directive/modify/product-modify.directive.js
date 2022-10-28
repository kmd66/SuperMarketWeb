(() => {
    angular
        .module('evaluation')
        .directive('kamaProductModify', kamaProductModify);

    kamaProductModify.$inject = ['productService', 'loadingService', 'alertService', 'enumService'];
    function kamaProductModify(productService, loadingService, alertService, enumService) {
        let directive = {
            link: {
                pre: preLink
            }
            , template: require('./product-modify.directive.html')
            , restrict: 'E'
            , scope: {
                main: '=main'
                , modify: '=modify'
                , cartable: '=cartable'
                , tag: '=tag'
            }
        };

        return directive;
        function preLink(scope, element, attrs) {
            let product = scope;

            product.modify.save = save;
            product.modify.img = {
                Type: 2,
                hideHead: true
            };
            product.modify.unitOfMeasureTypeDropDown = {
                items: enumService.UnitOfMeasureType
                , bindingObject: product.modify
                , parameters: { ID: 'UnitOfMeasure', Name: 'UnitOfMeasureName' }
            };

            product.modify.parentProductDropdown = {
                bindingObject: product.modify
                , parameters: { ID: 'ParentID' }
                , select2: true
            };

            function save(getCartable) {
                loadingService.show();
                product.modify.model.Information = JSON.stringify(product.modify.Information);
                productService.save(product.modify.model).then((result) => {
                    product.modify.model = result
                    return product.modify.img.save(product.modify.model.GuID);
                }).then((result) => {
                    alertService.success('جنس با موفقیت ثبت شد');
                    if (getCartable) {
                        product.main.changeState.cartable();
                        return product.cartable.grid.getlist(false);
                    }
                }).catch(alertService.error).finally(loadingService.hide);

            }

        }
    }
})();
