(() => {
    angular
        .module('evaluation')
        .directive('kamaStockModify', kamaStockModify);

    kamaStockModify.$inject = ['stockService', 'loadingService', 'alertService', '$routeParams'];
    function kamaStockModify(stockService, loadingService, alertService, $routeParams) {
        let directive = {
            link: {
                pre: preLink
            }
            , template: require('./stock-modify.directive.html')
            , restrict: 'E'
            , scope: {
                main: '=main'
                , modify: '=modify'
                , cartable: '=cartable'
                , add: '=add'
            }
        };

        return directive;
        function preLink(scope, element, attrs) {
            let stock = scope;

            stock.add.save = save;

            stock.modify.grid = {
                bindingObject: stock.modify
                , columns: [
                    { name: 'Date', displayName: 'تاریخ ایجاد', type: 'date' }
                    , { name: 'FromPositionName', displayName: 'نام ایجاد کننده' }
                    , { name: 'Count', displayName: 'تعداد' }
                ]
                , initload: false
                , hideHeader: true
                , hideFooter: true
                , pageSize: 100//globalService.get('userSettings').PageSize
                , options: () => { return {}; }
                , listService: () => { }
                , actions: []
                , onAdd: () => { }
                , onEdit: () => { }
                , deleteService: () => { }
            };

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
