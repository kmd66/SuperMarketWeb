(() => {
    angular
        .module('evaluation')
        .directive('kamaAutoSave', kamaAutoSave);
    
    kamaAutoSave.$inject = [];
    function kamaAutoSave() {
        var directive = {
            restrict: 'A'
            , link: link
            , scope: {
                onSave: '=onSave'
                , timeout: '@?timeout'
            }
        };

        return directive;
        
        function link(scope, element, attrs) {
            let timer;
            
            scope.timeout = scope.timeout || 30;
            element[0].addEventListener('blur', removeAutoSave);
            element[0].addEventListener('beforeunload', removeAutoSave);
            element[0].addEventListener('focus', addAutoSave);

            function removeAutoSave() {
                clearTimeout(timer);
            }
            function addAutoSave() {
                timer = setTimeout(() => {
                    scope.onSave().finally(addAutoSave);
                }, scope.timeout * 1000);
            }
        }
    }
})();