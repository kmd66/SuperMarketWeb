(() => {
    angular
        .module('evaluation')
        .directive('kamaProductInformation', kamaProductInformation);

    kamaProductInformation.$inject = [];
    function kamaProductInformation() {
        let directive = {
            link: {
                pre: preLink
            }
            , template: require('./product-information.directive.html')
            , restrict: 'E'
            , scope: {
                main: '=main'
                , modify: '=modify'
            }
        };

        return directive;

        function preLink(scope, element, attrs) {

        }
    }
})();
