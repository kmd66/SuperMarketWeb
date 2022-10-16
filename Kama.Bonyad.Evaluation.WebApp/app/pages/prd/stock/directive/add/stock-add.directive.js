(() => {
    angular
        .module('evaluation')
        .directive('kamaStockAdd', kamaStockAdd);

    kamaStockAdd.$inject = ['stockService', 'loadingService', 'alertService', '$routeParams'];
    function kamaStockAdd(stockService, loadingService, alertService, $routeParams) {
        let directive = {
            link: {
                pre: preLink
            }
            , template: require('./stock-add.directive.html')
            , restrict: 'E'
            , scope: {
                main: '=main'
                , cartable: '=cartable'
                , add: '=add'
            }
        };

        return directive;
        function preLink(scope, element, attrs) {
            let stock = scope;


        }
    }
})();
