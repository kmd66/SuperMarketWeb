(() => {
    angular
        .module('evaluation')
        .directive('kamaOutsideTemplate', kamaOutsideTemplate);

    kamaOutsideTemplate.$inject = ['$rootScope'];
    function kamaOutsideTemplate($rootScope) {
        var directive = {
            restrict: 'E'
            , transclude: true
            , link: link
            , template: require('./outside-template.html')
            , scope: {
                header: '@?header'
                , hideFooter: '=?hideFooter'
                , cols: '@?cols'
            }
        };

        return directive;

        function link(scope, element, attrs) {
            scope.appInfo = $rootScope.appInfo;
            scope.cols = scope.cols || 'col-xs-12 col-md-10 col-md-offset-1';
        }
    }
})();