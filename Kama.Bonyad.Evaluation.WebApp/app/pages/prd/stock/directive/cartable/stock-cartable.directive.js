(() => {
    angular
        .module('evaluation')
        .directive('kamaStockCartable', kamaStockCartable);

    kamaStockCartable.$inject = ['globalService', 'stockService'];
    function kamaStockCartable(globalService, stockService) {
        let directive = {
            link: {
                pre: preLink
            }
            , template: require('./stock-cartable.directive.html')
            , restrict: 'E'
            , scope: {
                main: '=main'
                , cartable: '=cartable'
                , search: '=search'
            }
        };

        return directive;

        function preLink(scope, element, attrs) {
            let stock = scope;

            stock.cartable.resetSearch = resetSearch;
            resetSearch();

            stock.cartable.grid = {
                bindingObject: stock.cartable
                , columns: [
                    { name: 'ID', displayName: 'شناسه' }
                    , { name: 'Name', displayName: 'نام' }
                    , { name: 'ClassificationName', displayName: 'نام دسته' }
                    , { name: 'Count', displayName: 'تعداد' }
                ]
                , initload: false
                , pageSize: 100//globalService.get('userSettings').PageSize
                , options: () => { return stock.search.model; }
                , listService: stockService.list
                , onAdd: stock.main.changeState.add
                , onEdit: stock.main.changeState.modify
                , deleteService: stockService.remove
            };

            stock.search.parentProductDropdown = {
                bindingObject: stock.search
                , parameters: { ID: 'ClassificationID' }
                , select2: true
                //, initLoad: true
                //, listService: productService.list
            };

            function resetSearch() {
                stock.search.pageIndex = 1;
                stock.search.state = 'hide';
            }

        }
    }
})();
