(() => {
    angular
        .module('evaluation')
        .directive('kamaUser', kamaUser);

    kamaUser.$inject = ['userService', 'ObjectService', 'loadingService', 'alertService'];
    function kamaUser(userService, ObjectService, loadingService, alertService) {
        let directive = {
            link: {
                pre: preLink
            }
            , template: require('./user.directive.html')
            , scope: {
                obj: '=obj'
            }
            , restrict: 'E'
        };
        return directive;

        function preLink(scope, element, attrs) {
            scope.main = new ObjectService();
            scope.main.passGenerator = passGenerator;

            scope.obj.setUserId = setUserId;
            scope.obj.setNationalCode = setNationalCode;
            scope.obj.get = get;

            init();

            function init() {
                if (scope.obj.initId) {
                    scope.main.state = 'edit'
                    setUserId(scope.obj.initId);
                }
                else
                    scope.main.state = 'add';
            }
            function passGenerator(count, length, exception) {
                count = count || 1;
                length = length || 10;
                exception = exception || '';
                exception = '[' + exception + ']';
                let result = '';
                let chars = '0123456789abcdefghijklmnopqrstuvwxzABCDEFGHIJKLMNOPQRSTUVWXYZ'.replace(new RegExp(exception, 'g'), '').split('');
                for (var i = 0; i < count; i++) {
                    for (var j = 0; j < length; j++) {
                        result += chars[Math.floor(Math.random() * chars.length)];
                    }
                }
                scope.main.model.Password = result;
            }
            function setUserId(userId) {
                return userService.getById({ id: userId }).then((result = {}) => {
                    scope.main.model = result;
                    scope.main.update();
                }).catch((error) => {
                    alertService.error(error);
                });
            }
            function setNationalCode(nationalCode) {
                scope.main.model = { NationalCode: nationalCode };
            }
            function get() {
                return scope.main.model;
            }
        }
    }
})();