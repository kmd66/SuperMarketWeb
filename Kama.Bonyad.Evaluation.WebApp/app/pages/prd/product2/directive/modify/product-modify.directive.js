//(() => {
//    angular
//        .module('evaluation')
//        .directive('kamaProductModify', kamaProductModify);

//    kamaProductModify.$inject = ['productService', 'loadingService', 'alertService', 'enumService', 'productClassificationService', 'brandService', '$q'];
//    function kamaProductModify(productService, loadingService, alertService, enumService, productClassificationService, brandService, $q) {
//        let directive = {
//            link: {
//                pre: preLink
//            }
//            , template: require('./product-modify.directive.html')
//            , restrict: 'E'
//            , scope: {
//                main: '=main'
//                , modify: '=modify'
//                , cartable: '=cartable'
//                , tag: '=tag'
//            }
//        };

//        return directive;
//        function preLink(scope, element, attrs) {
//            let product = scope;

//            product.modify.save = save;
//            product.modify.img = {
//                Type: 2,
//                hideHead: true
//            };
//            product.modify.unitOfMeasureTypeDropDown = {
//                items: enumService.UnitOfMeasureType
//                , bindingObject: product.modify
//                , parameters: { ID: 'UnitOfMeasure', Name: 'UnitOfMeasureName' }
//            };

//            product.modify.filterParentProductDropdown = {
//                bindingObject: product.modify
//                , parameters: { GuID: 'FilterParentID', ID: 'FilterParentIntID' }
//                , select2: true
//                , onChange: (selected, props) => {
//                    if (!props.isEmpty) {
//                        loadingService.show();
//                        return $q.resolve().then(() => {
//                            return product.modify.parentProductDropdown.getlist();
//                        }).then(() => {
//                            return product.modify.berandDropdown.getlist();
//                        }).finally(loadingService.hide);
//                    }
//                }
//            };

//            product.modify.parentProductDropdown = {
//                bindingObject: product.modify
//                , parameters: { ID: 'ParentID' }
//                , select2: true
//                , options: () => {
//                    if (product.modify.model.FilterParentID)
//                        return { ParentID: product.modify.model.FilterParentID }
//                    else
//                        return { LastNode: true }
//                }
//                , listService: productClassificationService.list
//            };

//            product.modify.berandDropdown = {
//                bindingObject: product.modify
//                , parameters: { ID: 'BrandID' }
//                , select2: true
//                , listService: () => {
//                    return brandService.list({ ParentID: product.modify.model.FilterParentIntID1 });
//                }
//            };

//            function save(getCartable) {
//                loadingService.show();
//                product.modify.model.Information = JSON.stringify(product.modify.Information);
//                productService.save(product.modify.model).then((result) => {
//                    product.modify.model = result
//                    return product.modify.img.save(product.modify.model.GuID);
//                }).then((result) => {
//                    alertService.success('جنس با موفقیت ثبت شد');
//                    if (getCartable) {
//                        product.main.changeState.cartable();
//                        return product.cartable.grid.getlist(false);
//                    }
//                }).catch(alertService.error).finally(loadingService.hide);

//            }

//        }
//    }
//})();
