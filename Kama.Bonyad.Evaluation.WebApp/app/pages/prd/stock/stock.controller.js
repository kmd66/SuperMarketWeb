(() => {
    angular
        .module('evaluation')
        .controller('StockController', StockController);

    StockController.$inject = ['ObjectService', 'stockService', 'productClassificationService', '$timeout', '$routeParams', '$location', 'loadingService', 'alertService', '$q', 'attachmentService'];
    function StockController(ObjectService, stockService, productClassificationService, $timeout, $routeParams, $location, loadingService, alertService, $q, attachmentService) {


        let stock = this;

        stock.main = new ObjectService();
        stock.cartable = new ObjectService();
        stock.search = new ObjectService();
        stock.modify = new ObjectService();
        stock.add = new ObjectService();

        stock.main.changeState = {
            modify: modify
            , add: add
            , cartable: cartable
        };

        $timeout(init, 0);

        function init() {
            loadingService.show();
            stock.main.state = $routeParams.state;
            return $q.resolve().then(() => {
                switch ($routeParams.state) {
                    case 'cartable':
                        return cartable();
                    case 'modify':
                        return modify({ ID: $routeParams.id });
                    case 'add':
                        return add();
                }
            }).then(() => {
                setParent(true);
            });
        }
        function modify(selected) {
            reset();
            loadingService.show();
            stock.modify.grid.getlist(false);
            return stockService.get({ ID: selected.ID }).then((result) => {
                stock.modify.model = result;
                stock.modify.grid.items = stock.modify.model;
                stock.main.state = 'modify';
                $location.path(`stock/modify/${selected.ID}`);
                update();
            }).catch(alertService.error).finally(loadingService.hide);


        }
        function add() {
            stock.main.state = 'add';
            $location.path(`stock/add`);
        }
        function cartable() {
            stock.main.state = 'cartable';
            $location.path(`stock/cartable`);
        }
        function setParent(b) {
            productClassificationService.list({}).then((result) => {
                stock.main.Parents = result;
                stock.search.parentProductDropdown.setItems(stock.main.Parents);
                if (b)
                    return stock.cartable.grid.getlist(false);
            }).finally(loadingService.hide);
        }
        function reset() {
            stock.modify.model = {};
            stock.add.showAdd = null;
            stock.add.model = {};
            stock.add.listModel = [];
        }
        function update() {
            //if (stock.modify.parentstockDropdown)
            //    stock.modify.parentstockDropdown.update();
        }
    }
})();
