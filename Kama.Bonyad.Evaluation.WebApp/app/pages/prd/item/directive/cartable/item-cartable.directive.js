(() => {
    angular
        .module('evaluation')
        .directive('kamaItemCartable', kamaItemCartable);

    kamaItemCartable.$inject = ['globalService', 'itemService'];
    function kamaItemCartable(globalService, itemService) {
        let directive = {
            link: {
                pre: preLink
            }
            , template: require('./item-cartable.directive.html')
            , restrict: 'E'
            , scope: {
                main: '=main'
                , cartable: '=cartable'
                , search: '=search'
            }
        };

        return directive;

        function preLink(scope, element, attrs) {
            let item = scope;

            item.cartable.resetSearch = resetSearch;
            resetSearch();

            item.cartable.grid = {
                bindingObject: item.cartable
                , columns: [
                    { name: 'FaName', displayName: 'نام' }
                    , { name: 'EnName', displayName: 'نام انگلیسی' }
                    , { name: 'ClassificationName', displayName: 'نام دسته' }
                    , { name: 'BrandFaName', displayName: 'نام برند' }
                ]
                , initload: false
                , pageSize: 100//globalService.get('userSettings').PageSize
                , options: () => { return item.search.model; }
                , listService: itemService.list
                , onAdd: item.main.changeState.add
                , onEdit: item.main.changeState.edit
                , deleteService: itemService.remove
            };

            item.search.classificationDropdown = {
                bindingObject: item.search
                , parameters: { ID: 'ClassificationID' }
                , select2: true
            };

            item.search.brandDropdown = {
                bindingObject: item.search
                , displayName: ['FaName']
                , parameters: { ID: 'BrandID' }
                , select2: true
            };

            function resetSearch() {
                item.search.model = {};
                item.search.update();
                item.search.pageIndex = 1;
                item.search.state = 'hide';
            }

        }
    }
})();
