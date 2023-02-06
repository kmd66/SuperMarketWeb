(() => {
    angular
        .module('evaluation')
        .directive('kamaProductCartable', kamaProductCartable);

    kamaProductCartable.$inject = ['globalService', 'productService'];
    function kamaProductCartable(globalService, productService) {
        let directive = {
            link: {
                pre: preLink
            }
            , template: require('./product-cartable.directive.html')
            , restrict: 'E'
            , scope: {
                main: '=main'
                , cartable: '=cartable'
                , search: '=search'
            }
        };

        return directive;

        function preLink(scope, element, attrs) {
            let product = scope;

            product.cartable.resetSearch = resetSearch;
            resetSearch();

            product.cartable.grid = {
                bindingObject: product.cartable
                , columns: [
                    { name: 'FaName', displayName: 'نام' }
                    , { name: 'EnName', displayName: 'نام انگلیسی' }
                    , { name: 'ClassificationName', displayName: 'نام دسته' }
                    , { name: 'BrandFaName', displayName: 'نام برند' }
                ]
                , initload: false
                , pageSize: 100//globalService.get('userSettings').PageSize
                , options: () => { return product.search.model; }
                , listService: productService.list
                , onAdd: product.main.changeState.add
                , onEdit: product.main.changeState.edit
                , deleteService: productService.remove
            };

            product.search.classificationDropdown = {
                bindingObject: product.search
                , parameters: { ID: 'ClassificationID' }
                , select2: true
            };

            product.search.brandDropdown = {
                bindingObject: product.search
                , displayName: ['FaName']
                , parameters: { ID: 'BrandID' }
                , select2: true
            };

            function resetSearch() {
                product.search.model = {};
                product.search.update();
                product.search.pageIndex = 1;
                product.search.state = 'hide';
            }

        }
    }
})();
