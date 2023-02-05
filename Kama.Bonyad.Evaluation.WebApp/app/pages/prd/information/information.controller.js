(() => {
    angular
        .module('evaluation')
        .controller('InformationController', InformationController);

    InformationController.$inject = ['ObjectService', 'informationService', 'productClassificationService', '$timeout', '$routeParams', '$location', 'loadingService', 'alertService', '$q', 'productService'];
    function InformationController(ObjectService, informationService, productClassificationService, $timeout, $routeParams, $location, loadingService, alertService, $q, productService) {

        let information = this;

        information.main = new ObjectService();
        information.cartable = new ObjectService();
        information.search = new ObjectService();
        information.add = new ObjectService();

        information.main.changeState = {
            add: add
            , cartable: cartable
        };

        $timeout(init, 0);

        function init() {
            loadingService.show();
            information.main.state = $routeParams.state;
            return $q.resolve().then(() => {
                switch ($routeParams.state) {
                    case 'cartable':
                        return cartable();
                    case 'add':
                        return add();
                }
            }).then(() => {
                return information.cartable.grid.getlist(false);
            }).finally(loadingService.hide);
        }
        function add(selected) {
            information.add.model = {};
            information.main.state = 'add';
            $location.path(`information/add`);
        }
        function cartable() {
            information.main.state = 'cartable';
            $location.path(`information/cartable`);
        }
        function reset() {
        }
        function update() {
        }
    }
})();
