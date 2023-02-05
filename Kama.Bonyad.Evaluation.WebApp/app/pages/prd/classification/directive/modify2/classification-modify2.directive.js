(() => {
    angular
        .module('evaluation')
        .directive('kamaClassificationModify2', kamaClassificationModify2);

    kamaClassificationModify2.$inject = ['classificationService', 'informationService', 'loadingService', 'alertService', '$q', '$timeout'];
    function kamaClassificationModify2(classificationService, informationService, loadingService, alertService, $q, $timeout) {
        let directive = {
            link: {
                pre: preLink
            }
            , template: require('./classification-modify2.directive.html')
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

            classification.children.save = save;
            classification.children.getInformations = getInformations;
            classification.children.selectInformation = selectInformation;

            classification.children.parentclassificationDropdown = {
                bindingObject: classification.children
                , parameters: { GuID: 'ParentID' }
                , select2: true
            };

            function save(childrenModifyHide) {
                if (classification.modify.childrenModify === 'add' && !classification.children.model.ParentID) 
                    return alertService.error('والد انتخاب نشده است');

                loadingService.show();
                classificationService.save(classification.children.model).then((result) => {
                    classification.children.model = result;
                    classification.modify.childrenModify = 'edit';
                    return classification.children.grid.getlist(false);
                }).then((result) => {
                    if (childrenModifyHide)
                        classification.main.changeState.childrenModifyHide();
                    alertService.success('دسته بندی با موفقیت ثبت شد');
                }).catch((error) => {
                    alertService.error(error);
                }).finally(loadingService.hide);

            }

            function getInformations() {
                loadingService.show();
                informationService.list({}).then((result) => {
                    classification.children.informations = result;
                    return informationService.listClassificationInformation({ ClassificationID: classification.children.model.ID });
                }).then((result) => {
                    result.forEach((item, index) => {
                        item.Name = item.Level + item.Name;
                        var indexOf = classification.children.informations.findIndex(i => i.ID == item.InformationID);
                        if (indexOf > -1)
                            classification.children.informations[indexOf].selected = true;
                    });
                    classification.children.isInformation = true;

                }).catch((error) => {
                    alertService.error(error);
                }).finally(loadingService.hide);

            }

            function selectInformation(item) {
                loadingService.show();
                $q.resolve().then(() => {
                    if (item.selected) {
                        return informationService.deleteClassificationInformation({ ClassificationID: classification.children.model.ID, InformationID: item.ID });
                    }
                    else {
                        return informationService.addClassificationInformation({ ClassificationID: classification.children.model.ID, InformationID: item.ID });
                    }
                }).then(() => {
                    $timeout(function () {
                        if (item.selected)
                            item.selected = false;
                        else
                            item.selected = true;
                    }, 1);
                }).catch((error) => {
                    alertService.error(error);
                }).finally(loadingService.hide);

            }

        }
    }
})();
