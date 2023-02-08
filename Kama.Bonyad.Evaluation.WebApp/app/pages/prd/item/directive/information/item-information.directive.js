(() => {
    angular
        .module('evaluation')
        .directive('kamaItemInformation', kamaItemInformation);

    kamaItemInformation.$inject = [];
    function kamaItemInformation() {
        let directive = {
            link: {
                pre: preLink
            }
            , template: require('./item-information.directive.html')
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
