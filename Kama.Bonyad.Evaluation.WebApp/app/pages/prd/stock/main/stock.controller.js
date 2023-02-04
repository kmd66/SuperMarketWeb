(() => {
    angular
        .module('evaluation')
        .controller('StockController', StockController);

    StockController.$inject = ['ObjectService', 'stockService', 'productClassificationService', '$timeout', '$routeParams', '$location', 'loadingService', 'alertService', '$q', 'productService'];
    function StockController(ObjectService, stockService, productClassificationService, $timeout, $routeParams, $location, loadingService, alertService, $q, productService) {


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
            loadingService.show();
            stock.add.list = [];
            stock.add.saveList = [];
            stock.add.paramsAddSaveList = null;
            stock.main.state = 'add';
            $location.path(`stock/add`);
            productService.list({}).then((result) => {
                stock.add.resultList = result;
                
                //var request = indexedDB.open('db', 2);
                //request.onupgradeneeded = function (event) {
                //    var db = event.target.result;
                //    if (!db.objectStoreNames.contains("product"))
                //        db.createObjectStore('product', {
                //        autoIncrement: false
                //    });
                //};

                //request.onsuccess = function (event) {
                //    var db = event.target.result;
                //    var tx = db.transaction('product', "readwrite");
                //    var store = tx.objectStore('product');

                //    store.clear();
                //    result.forEach(data => {
                //        store.add(data.Name, data.ID);
                //    })

                //    db.close();
                //};
            }).catch(alertService.error).finally(loadingService.hide);
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
            stock.modify.add = {};
            stock.modify.add.showAdd = null;
            stock.modify.add.model = {};
            stock.modify.add.listModel = [];
        }
        function update() {
            //if (stock.modify.parentstockDropdown)
            //    stock.modify.parentstockDropdown.update();
        }
    }
})();
