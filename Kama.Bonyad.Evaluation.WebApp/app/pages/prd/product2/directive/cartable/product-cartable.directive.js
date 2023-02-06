//(() => {
//    angular
//        .module('evaluation')
//        .directive('kamaProductCartable', kamaProductCartable);

//    kamaProductCartable.$inject = ['globalService', 'productClassificationService', 'productService'];
//    function kamaProductCartable(globalService, productClassificationService, productService) {
//        let directive = {
//            link: {
//                pre: preLink
//            }
//            , template: require('./product-cartable.directive.html')
//            , restrict: 'E'
//            , scope: {
//                main: '=main'
//                , cartable: '=cartable'
//                , search: '=search'
//            }
//        };

//        return directive;

//        function preLink(scope, element, attrs) {
//            let product = scope;

//            product.cartable.resetSearch = resetSearch;
//            resetSearch();

//            product.cartable.grid = {
//                bindingObject: product.cartable
//                , columns: [
//                    { name: 'Name', displayName: 'نام' }
//                    , { name: 'ClassificationName', displayName: 'نام دسته' }
//                    , { name: 'Comment', displayName: 'توضیح' }
//                ]
//                , initload: false
//                , pageSize: 100//globalService.get('userSettings').PageSize
//                , options: () => { return product.search.model; }
//                , listService: productService.list
//                , onAdd: product.main.changeState.add
//                , onEdit: product.main.changeState.edit
//                , deleteService: productService.remove
//            };

//            product.search.parentProductDropdown = {
//                bindingObject: product.search
//                , parameters: { ID: 'ParentID' }
//                , select2: true
//                //, initLoad: true
//                //, listService: productService.list
//            };

//            function resetSearch() {
//                product.search.model.StartPrice = 0;
//                product.search.model.EndPrice = 0;
//                product.search.pageIndex = 1;
//                product.search.state = 'hide';
//            }

//        }
//    }
//})();
