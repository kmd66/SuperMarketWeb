(() => {
    angular
        .module('evaluation')
        .directive('kamaRoleCartable', kamaRoleCartable);

    kamaRoleCartable.$inject = ['ObjectService', 'roleService', '$location', 'enumService'];
    function kamaRoleCartable(ObjectService, roleService, $location, enumService) {
        const directive = {
            restrict: 'E'
            , link: {
                pre: preLink
            }
            , template: require('./role-cartable.directive.html')
            , scope: {
                main: '=main'
                , cartable: '=cartable'
                , search: '=search'
            }
        };

        return directive;

        function preLink(scope, element, attrs) {
            let role = scope;

            role.search.reset = reset;
            role.cartable.grid = {
                bindingObject: role.cartable
                , initLoad: true
                , columns: [
                    { name: 'Name', displayName: 'عنوان' }
                ]
                , displayNameFormat: ['Name']
                , preventDefaultAdd: true
                , preventDefaultEdit: true
                , onAdd: role.main.changeState.add
                , onEdit: role.main.changeState.edit
                , options: () => { return role.search.model }
                , listService: roleService.list
                , deleteService: roleService.remove
            }
            
            function reset() {
                role.search.model = {};
                role.search.update();
                role.cartable.grid.pageIndex = 1;
                role.cartable.grid.getlist();
            }
        }
    }
})();