(() => {
    angular
        .module('evaluation')
        .directive('kamaBrandCartable', kamaBrandCartable);

    kamaBrandCartable.$inject = ['globalService', 'brandService'];
    function kamaBrandCartable(globalService, brandService) {
        let directive = {
            link: {
                pre: preLink
            }
            , template: require('./brand-cartable.directive.html')
            , restrict: 'E'
            , scope: {
                main: '=main'
                , cartable: '=cartable'
                , search: '=search'
            }
        };

        return directive;

        function preLink(scope, element, attrs) {
            let brand = scope;

            brand.search.pageIndex = 1;

            brand.cartable.grid = {
                bindingObject: brand.cartable
                , columns: [
                    { name: 'FaName', displayName: 'نام' }
                    , { name: 'EnName', displayName: 'نام انگلیسی' }
                ]
                , initload: true
                , pageSize: 100//globalService.get('userSettings').PageSize
                , options: () => { return brand.search.model; }
                , listService: brandService.list
                , onAdd: brand.main.changeState.add
                , onEdit: brand.main.changeState.edit
                , deleteService: brandService.remove
            };

        }
    }
})();
