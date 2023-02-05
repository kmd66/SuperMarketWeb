(() => {
    angular
        .module('evaluation')
        .directive('kamaClassificationCartable', kamaClassificationCartable);

    kamaClassificationCartable.$inject = ['globalService', 'classificationService'];
    function kamaClassificationCartable(globalService, classificationService) {
        let directive = {
            link: {
                pre: preLink
            }
            , template: require('./classification-cartable.directive.html')
            , restrict: 'E'
            , scope: {
                main: '=main'
                , cartable: '=cartable'
                , search: '=search'
            }
        };

        return directive;

        function preLink(scope, element, attrs) {
            let classification = scope;

            classification.cartable.resetSearch = resetSearch;
            resetSearch();

            classification.cartable.grid = {
                bindingObject: classification.cartable
                , columns: [
                    { name: 'Name', displayName: 'نام' }
                ]
                , initload: false
                , pageSize: 1000//globalService.get('userSettings').PageSize
                , options: () => { return classification.search.model; }
                , listService: classificationService.list
                , hideFooter: true
                , onAdd: classification.main.changeState.add
                , onEdit: classification.main.changeState.edit
                , deleteService: classificationService.remove
            };

            function resetSearch() {
                classification.search = {
                    pageIndex: 1,
                    state: 'hide',
                    model: {
                        false: true,
                        FirstNode: true,
                        LastNode: false,
                        AllChild: false,
                    }
                }
            }
        }
    }
})();
