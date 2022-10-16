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
            , template: require('./stock-modify.directive.html')
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

            stock.add.addList = addList;
            stock.add.save = save;

            function addList() {
                stock.add.model.ID = $routeParams.id;
                loadingService.show();
                stockService.save(stock.add.model).then((result) => {
                    return stockService.get({ ID: stock.add.model.ID });
                }).then((result) => {
                    stock.modify.model = result;
                    stock.modify.grid.items = stock.modify.model;
                    stock.add.showAdd = false;
                    stock.add.model = {}
                    alertService.success('جنس با موفقیت ثبت شد');
                }).catch(alertService.error).finally(loadingService.hide);

            }

            function save() {
                stock.add.model.ID = $routeParams.id;
                loadingService.show();
                stockService.save(stock.add.model).then((result) => {
                    return stockService.get({ ID: stock.add.model.ID });
                }).then((result) => {
                    stock.modify.model = result;
                    stock.modify.grid.items = stock.modify.model;
                    stock.add.showAdd = false;
                    stock.add.model = {}
                    alertService.success('جنس با موفقیت ثبت شد');
                }).catch(alertService.error).finally(loadingService.hide);

            }

        }
    }
})();
