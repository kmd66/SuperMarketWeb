(() => {
    angular
        .module('evaluation')
        .directive('kamaStockCartable', kamaStockCartable);

    kamaStockCartable.$inject = ['globalService', 'stockService', 'alertService', 'loadingService', '$q'];
    function kamaStockCartable(globalService, stockService, alertService, loadingService, $q) {
        let directive = {
            link: {
                pre: preLink
            }
            , template: require('./stock-cartable.directive.html')
            , restrict: 'E'
            , scope: {
                main: '=main'
                , cartable: '=cartable'
                , search: '=search'
            }
        };

        return directive;

        function preLink(scope, element, attrs) {
            let stock = scope;

            stock.cartable.resetSearch = resetSearch;
            stock.cartable.setActionState = setActionState;
            stock.cartable.stockChangeState = stockChangeState;
            resetSearch();
            stock.search.model.ActionState = 1;

            stock.cartable.grid = {
                bindingObject: stock.cartable
                , columns: [
                    { name: 'ID', displayName: 'شناسه' }
                    , { name: 'Name', displayName: 'نام' }
                    , { name: 'ClassificationName', displayName: 'نام دسته' }
                    , { name: 'Count', displayName: 'تعداد' }
                ]
                , initload: false
                , pageSize: 100//globalService.get('userSettings').PageSize
                , options: () => { return stock.search.model; }
                , listService: stockService.list
                , onAdd: stock.main.changeState.add
                , actions:[
                    {
                        title: "ویرایش",
                        class: "fa fa-pencil grid-action-blue",
                        onclick: (e) => {
                            stock.main.changeState.modify(e);
                        },
                        name: "edit"
                    },
                    {
                        title: "حذف",
                        class: "fa fa-close grid-action-red",
                        onclick: (e) => {
                            stock.cartable.delete = e;
                            $('#stock-change-state').modal('show');
                        },
                        name: "remove"
                    }
                ]
                , checkActionVisibility: (action, item) => {
                    if (action === 'edit') {
                        if (stock.search.model.ActionState != 3) return true;
                        else return false;
                    }
                    else if (action === 'remove') {
                        if (stock.search.model.ActionState != 3) return false;
                        else return true;
                    }
                    else
                        return true;
                }
                , hideFooter: true
            };

            stock.search.parentProductDropdown = {
                bindingObject: stock.search
                , parameters: { ID: 'ClassificationID' }
                , select2: true
                //, initLoad: true
                //, listService: productService.list
            };

            function resetSearch() {
                stock.search.model = {};
                stock.search.pageIndex = 1;
                stock.search.state = 'hide';
            }

            function setActionState(actionState) {
                resetSearch();
                stock.search.model.ActionState = actionState;
                stock.cartable.grid.getlist();
            }

            function stockChangeState(state) {
                $('#stock-change-state').modal('hide');
                loadingService.show();
                stockService.changeState({ ID: stock.cartable.delete.ID, State: state }).then((result) => {
                    return stock.cartable.grid.getlist();
                }).then((result) => {
                    alertService.success('جنس با موفقیت ثبت شد');
                }).catch(alertService.error).finally(loadingService.hide);
            }

        }
    }
})();
