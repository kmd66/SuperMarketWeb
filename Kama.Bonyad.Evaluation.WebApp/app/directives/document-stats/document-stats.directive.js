(function () {
    angular
        .module('evaluation')
        .directive('kamaDocumentStats', kamaDocumentStats);

    kamaDocumentStats.$inject = ['$rootScope'];
    function kamaDocumentStats($rootScope) {
        var directive = {
            link: link
            , template: require('./document-stats.directive.html')
            , restrict: 'E'
            , scope: {
                types: '=types'
                , sendType: '=?sendType'
                , sendTypeArrey: '=?sendTypeArrey'
            }
        };

        return directive;

        function link(scope, element, attrs) {
            scope.getTotal = getTotal;

            function getTotal() {
                if ($rootScope.documentStats && $rootScope.documentStats.length) {

                    if (scope.sendType) {
                        for (let i = 0; i < $rootScope.documentStats.length; i++) {
                            if ($rootScope.documentStats[i].SendType === scope.sendType) {
                                return $rootScope.documentStats[i].InActionCount;
                            }
                        }
                    }

                    else if (scope.sendTypeArrey) {
                        var total = 0;
                        for (let i = 0; i < $rootScope.documentStats.length; i++) {
                            if (scope.sendTypeArrey.includes($rootScope.documentStats[i].SendType)) {
                                total += $rootScope.documentStats[i].InActionCount;
                            }
                        }
                        if (total > 0)
                            return total;
                    }

                    else {
                        return $rootScope.documentStats[0].TotalActionCount;
                    }
                }
            }
        }
    }
})();