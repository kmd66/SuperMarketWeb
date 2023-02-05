(() => {
    angular
        .module('evaluation')
        .directive('kamaClassificationModify', kamaClassificationModify);

    kamaClassificationModify.$inject = ['classificationService', 'loadingService', 'alertService'];
    function kamaClassificationModify(classificationService, loadingService, alertService) {
        let directive = {
            link: {
                pre: preLink
            }
            , template: require('./classification-modify.directive.html')
            , restrict: 'E'
            , scope: {
                main: '=main'
                , modify: '=modify'
                , cartable: '=cartable'
                , children: '=children'
            }
        };

        return directive;
        function preLink(scope, element, attrs) {
            let classification = scope;


            classification.modify.save = save;

            classification.children.grid = {
                bindingObject: classification.children
                , columns: [
                    { name: 'Name', displayName: 'نام' }
                    , { name: 'ParentName', displayName: 'نام والد' }
                ]
                , initload: false
                , pageSize: 1000//globalService.get('userSettings').PageSize
                , options: () => {
                    return { ParentID: classification.modify.model.GuID, AllChild: true }
                }
                , listService: (options) => {
                    return classificationService.list(options).then((result) => {
                       return resultSetLevel(result);
                    });
                }
                , hideFooter: true
                , onAdd: classification.main.changeState.childrenModifyAdd
                , onEdit: classification.main.changeState.childrenModifyEdit
                , deleteService: classificationService.remove
            };

            function save() {
                loadingService.show();
                classificationService.save(classification.modify.model).then((result) => {
                    classification.modify.model = result;
                    return classification.cartable.grid.getlist(false);
                }).then(() => {
                    return classification.children.grid.getlist(false);
                }).then(() => {
                    alertService.success('دسته بندی با موفقیت ثبت شد');
                }).catch((error) => {
                    alertService.error(error);
                }).finally(loadingService.hide);
            }

            function resultSetLevel(result) {
                classification.modify.children = {};
                result.forEach((item, index) => {
                    let count = item.NodeString.split('/').length - 3;
                    item.Level = '';
                    for (let i = 0; i < count; i++) {
                        item.Level += "|- ";
                    }
                    if (item.Level == '')
                        item.Level = '-';
                });
                classification.modify.children.model = result;
                classification.modify.children.model.forEach((item, index) => {
                    item.Name = item.Level + item.Name;
                });
                classification.children.parentclassificationDropdown.setItems(classification.modify.children.model);

                return result;
            }

        }
    }
})();
