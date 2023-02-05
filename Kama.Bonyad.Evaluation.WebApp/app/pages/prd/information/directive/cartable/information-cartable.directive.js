(() => {
    angular
        .module('evaluation')
        .directive('kamaInformationCartable', kamaInformationCartable);

    kamaInformationCartable.$inject = ['globalService', 'informationService', 'alertService', 'loadingService', '$q'];
    function kamaInformationCartable(globalService, informationService, alertService, loadingService, $q) {
        let directive = {
            link: {
                pre: preLink
            }
            , template: require('./information-cartable.directive.html')
            , restrict: 'E'
            , scope: {
                main: '=main'
                , cartable: '=cartable'
                , search: '=search'
            }
        };

        return directive;

        function preLink(scope, element, attrs) {
            let information = scope;

            information.cartable.resetSearch = resetSearch;
            resetSearch();

            information.cartable.grid = {
                bindingObject: information.cartable
                , columns: [
                    //{ name: 'ID', displayName: 'شناسه' },
                    { name: 'Text', displayName: 'نام' }
                    , { name: 't', displayName: '-' }
                ]
                , initload: false
                , pageSize: 100//globalService.get('userSettings').PageSize
                , options: () => { return information.search.model; }
                , listService: informationService.list
                , onAdd: information.main.changeState.add
                , actions:[]
            };


            function resetSearch() {
                information.search.model = {};
                information.search.pageIndex = 1;
                information.search.state = 'hide';
            }

        }
    }
})();
