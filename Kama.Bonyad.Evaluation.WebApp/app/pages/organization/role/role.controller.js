(() => {
    angular
        .module('evaluation')
        .controller('RoleController', RoleController);

    RoleController.$inject = ['ObjectService', '$routeParams', '$location', 'loadingService', 'roleService', 'alertService', 'toolsService'];
    function RoleController(ObjectService, $routeParams, $location, loadingService, roleService, alertService, toolsService) {
        toolsService.checkPermission(['pgeRole'], { notFound: true });
        let role = this;

        if (['cartable', 'add', 'edit'].indexOf($routeParams.state) === -1)
            $location.path('not-found');

        role.main = new ObjectService();
        role.cartable = new ObjectService();
        role.search = new ObjectService();
        role.modify = new ObjectService();

        role.main.changeState = {
            add: add
            , edit: edit
            , cartable: cartable
        };

        init();

        function init() {
            role.main.state = $routeParams.state;

            if ($routeParams.state === 'edit')
                edit({ ID: $routeParams.id });
        }
        function add() {
            $location.path('role/add');
            role.main.state = 'add';
            role.modify.model = {};
            role.modify.update();
        }
        function edit(model) {
            loadingService.show();
            return roleService.get(model).then((result) => {
                $location.path(`role/edit/${result.ID}`);
                role.main.state = 'edit';
                role.modify.model = angular.copy(result);
                role.modify.update();
            }).catch((error) => {
                alertService.error(error || 'خطا در دریافت اطلاعات');
            }).finally(loadingService.hide);
        }
        function cartable() {
            $location.path('role/cartable');
            role.main.state = 'cartable';
        }
    }
})();