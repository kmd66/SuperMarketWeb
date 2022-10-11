(() => {
    angular
        .module('evaluation')
        .directive('kamaRoleModify', kamaRoleModify);

    kamaRoleModify.$inject = ['enumService', 'loadingService', 'roleService', '$location', 'alertService', 'commandService', 'toolsService'];
    function kamaRoleModify(enumService, loadingService, roleService, $location, alertService, commandService, toolsService) {
        let directive = {
            restrict: 'E'
            , link: {
                pre: preLink
            }
            , template: require('./role-modify.directive.html')
            , scope: {
                main: '=main'
                , modify: '=modify'
                , cartable: '=cartable'
            }
        }

        return directive;

        function preLink(scope, element, attrs) {
            let role = scope;

            role.modify.save = save;

            init();

            function init() {
                commandService.list().then((result) => {
                    role.modify.permissions = toolsService.getTreeObject(result, 'Node', 'ParentNode', '/');
                }).catch(() => {
                    alertService.error('خطا در دریافت لیست دسترسی‌ها');
                });
            }
            function save() {
                loadingService.show();
                roleService.save(role.modify.model).then((result) => {
                    role.modify.model = result;
                    role.main.changeState.cartable();
                    alertService.success('تغییرات با موفقیت ذخیره شد');
                }).then(role.cartable.grid.getlist).catch(alertService.error).finally(loadingService.hide);
            }
        }
    }
})();