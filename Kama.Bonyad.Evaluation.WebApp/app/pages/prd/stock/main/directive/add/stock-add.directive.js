(() => {
    angular
        .module('evaluation')
        .directive('kamaStockAdd', kamaStockAdd);

    kamaStockAdd.$inject = ['stockService', 'loadingService', 'alertService', '$timeout'];
    function kamaStockAdd(stockService, loadingService, alertService, $timeout) {
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

            stock.add.searchChange = searchChange;
            stock.add.addSaveList = addSaveList;
            stock.add.save = save;


            function searchChange() {
                if (!stock.add.search || stock.add.search == '')
                    return;
                var i = 0;
                stock.add.list = [];
                for (const el of stock.add.resultList) {
                    if (el.ID.toString().match(stock.add.search) || el.Name.match(stock.add.search)) {
                        stock.add.list.push({ ID: el.ID, Name: el.Name });
                        if (stock.add.list.length > 20) {
                            break;
                        }
                    }
                }

                $timeout(function () { });
            }

            function addSaveList(item) {
                if (stock.add.paramsAddSaveList.Expired) {
                    var minExpiredDate  = new Date();
                    minExpiredDate.setDate(minExpiredDate.getDate() + 1);
                    if (minExpiredDate > stock.add.paramsAddSaveList.Expired)
                        return alertService.error('تاریخ انقضا کم است!');
                }

                if (stock.add.paramsAddSaveList.Count > 0 && stock.add.paramsAddSaveList.Expired) {
                    stock.add.saveList.push({
                        ID: stock.add.paramsAddSaveList.ID, Name: stock.add.paramsAddSaveList.Name
                        , Count: stock.add.paramsAddSaveList.Count, Expired: stock.add.paramsAddSaveList.Expired
                    });
                    stock.add.paramsAddSaveList = null;
                    stock.add.search = '';
                    stock.add.list = [];
                }
                else
                    alertService.error('تعداد و تاریخ انقضا را مشخص کنید');
            }

            function save() {
                loadingService.show();
                stockService.addList(stock.add.saveList).then((result) => {
                    stock.add.paramsAddSaveList = null;
                    stock.add.search = '';
                    stock.add.list = [];
                    stock.add.saveList = [];
                    alertService.success('جنس با موفقیت ثبت شد');
                }).catch(alertService.error).finally(loadingService.hide);
            }
        }
    }
})();
