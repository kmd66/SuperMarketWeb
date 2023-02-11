(() => {
    angular
        .module('evaluation')
        .directive('kamaDepoCartable', kamaDepoCartable);

    kamaDepoCartable.$inject = ['globalService', 'depoService'];
    function kamaDepoCartable(globalService, depoService) {
        let directive = {
            link: {
                pre: preLink
            }
            , template: require('./depo-cartable.directive.html')
            , restrict: 'E'
            , scope: {
                main: '=main'
                , cartable: '=cartable'
                , search: '=search'
            }
        };

        return directive;

        function preLink(scope, element, attrs) {
            let depo = scope;

            depo.search.pageIndex = 1;

            depo.search.itemDropdown = {
                bindingObject: depo.search
                , displayName: ['FaName']
                , parameters: { ID: 'ItemID' }
                , select2: true
            };

            depo.cartable.grid = {
                bindingObject: depo.cartable
                , columns: [
                    { name: 'ItemID', displayName: 'کد محصول' }
                    , { name: 'FaName', displayName: 'نام محصول' }
                    , { name: 'NumberEnter', displayName: 'تعداد ورودی کل' }
                    , { name: 'NumberLeave', displayName: 'تعداد خروجی کل' }
                    , { name: 'Number', displayName: 'موجودی' }
                    , { name: 'LastPriceBuy', displayName: 'آخرین قیمت خرید' }
                    , { name: 'AveragePriceBuy', displayName: 'میانگین قیمت خرید' }
                ]
                , initload: true
                , pageSize: 100//globalService.get('userSettings').PageSize
                , options: () => { return depo.search.model; }
                , onAdd: () => { return depo.main.changeState.add(); }
                , listService: depoService.depoStorageList
                , actions: [
                    {
                        title: 'viwe',
                        "class": 'fa fa-eye grid-action-blue',
                        onclick: function onclick(selected) {
                            depo.main.changeState.viwe(selected);
                        },
                        name: 'viwe'
                    }
                    , {
                        title: 'add',
                        "class": 'fa fa-plus grid-action-blue',
                        onclick: function onclick(selected) {
                            depo.main.changeState.add(selected);
                        },
                        name: 'add'
                    }
                ]
            };

        }
    }
})();
