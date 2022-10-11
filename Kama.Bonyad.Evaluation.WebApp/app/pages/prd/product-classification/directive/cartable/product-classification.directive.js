(() => {
    angular
        .module('evaluation')
        .directive('kamaProductClassificationCartable', kamaProductClassificationCartable);

    kamaProductClassificationCartable.$inject = ['globalService', 'productClassificationService'];
    function kamaProductClassificationCartable(globalService, productClassificationService) {
        let directive = {
            link: {
                pre: preLink
            }
            , template: require('./product-classification-cartable.directive.html')
            , restrict: 'E'
            , scope: {
                main: '=main'
                , cartable: '=cartable'
                , search: '=search'
            }
        };

        return directive;

        function preLink(scope, element, attrs) {
            let productClassific = scope;

            productClassific.cartable.resetSearch = resetSearch;
            productClassific.cartable.resultSetLevel = resultSetLevel;
            resetSearch();

            productClassific.cartable.grid = {
                bindingObject: productClassific.cartable
                , columns: [
                    { name: 'Level', displayName: '' }
                    ,{ name: 'Name', displayName: 'نام' }
                    , { name: 'ParentName', displayName: 'نام والد' }
                    , { name: 'Comment', displayName: 'توضیح' }
                ]
                , initload: false
                , pageSize: 1000//globalService.get('userSettings').PageSize
                , options: () => { return productClassific.search.model; }
                , listService: (options) => {
                    return  productClassificationService.list(options).then((result) => {
                        return resultSetLevel(result);
                    });
                }
                , hideFooter: true
                , onAdd: productClassific.main.changeState.add
                , onEdit: productClassific.main.changeState.edit
                , deleteService: productClassificationService.remove
            };

            productClassific.search.parentProductClassificDropdown = {
                bindingObject: productClassific.search
                , parameters: { GuID: 'ParentID' }
                , select2: true
                //, initLoad: true
                //, listService: productClassificationService.list
            };

            function resetSearch() {
                productClassific.search.pageIndex = 1;
                productClassific.search.model = { AllChild: true };
                productClassific.search.state = 'hide';
            }

            function resultSetLevel(result) {
                result.forEach((item, index) => {
                    let count = item.NodeString.split('/').length - 3;
                    item.Level = '';
                    for (let i = 0; i < count; i++) {
                        item.Level += "|- ";
                    }
                    if (item.Level == '')
                        item.Level = '-';
                });
                return result;
            }
        }
    }
})();
