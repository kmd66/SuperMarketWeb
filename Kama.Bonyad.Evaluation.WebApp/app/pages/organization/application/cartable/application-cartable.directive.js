(() => {
    angular
        .module('evaluation')
        .directive('kamaApplicationCartable', kamaApplicationCartable);

    kamaApplicationCartable.$inject = ['applicationService', '$location'];
    function kamaApplicationCartable(applicationService, $location) {
        const directive = {
            restrict: 'E'
            , link: {
                pre: preLink
            }
            , template: require('./application-cartable.directive.html')
            , scope: {
                main: '=main'
                , cartable: '=cartable'
                , search: '=search'
                , modify: '=modify'
            }
        };

        return directive;

        function preLink(scope, element, attrs) {
            let application = scope;

            application.cartable.grid = {
                bindingObject: application.cartable
                , columns: [
                    { name: 'Enabled', displayName: 'فعال' }
                    ,{ name: 'Name', displayName: 'برنامه' }
                    
                    , {
                        name: 'Comment', displayName: 'توضیحات', callback: (value) => {
                            return value ? value.length <= 40 ? value : `${value.substring(0, 40)}...` : '';
                        }
                    }
                ]
                , onAdd: application.main.changeState.add
               
                , actions: [{
                    title: 'Edit',
                    class: 'fa fa-pencil grid-action-blue',
                    onclick: (selected) => {
                        application.main.changeState.edit(selected);
                    },
                    name: 'edit'
                }]
                //, hideHeader: true
                , options: () => { return application.search.model; }
                , listService: applicationService.list
            };

            application.search.reset = reset;
         

            function reset() {
                application.search.model = {};
                application.search.update();
                application.cartable.grid.getlist();
            }
        }
    }
})();