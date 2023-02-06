(() => {
    angular
        .module('evaluation')
        .controller('ClassificationController', ClassificationController);

    ClassificationController.$inject = ['ObjectService', 'classificationService', '$timeout', '$routeParams', '$location', 'loadingService', 'alertService', '$q'];
    function ClassificationController(ObjectService, classificationService, $timeout, $routeParams, $location, loadingService, alertService, $q) {


        let classification = this;

        classification.main = new ObjectService();
        classification.cartable = new ObjectService();
        classification.search = new ObjectService();
        classification.modify = new ObjectService();
        classification.children = new ObjectService();

        classification.main.changeState = {
            add: add
            , edit: edit
            , cartable: cartable
            , childrenModifyAdd: childrenModifyAdd
            , childrenModifyEdit: childrenModifyEdit
            , childrenModifyHide: childrenModifyHide
        };

        $timeout(init, 0);

        function init() {
            loadingService.show();
            classification.main.state = $routeParams.state;
            return $q.resolve().then(() => {
                switch ($routeParams.state) {
                    case 'cartable':
                        return cartable();
                    case 'add':
                        return add();
                    case 'edit':
                        return edit({ GuID: $routeParams.id });
                }
            }).then(() => {
                return classification.cartable.grid.getlist(false);
            }).finally(loadingService.hide);
        }
        function add() {
            childrenModifyHide();
            classification.modify.model = {};
            classification.main.state = 'add';
            $location.path(`classific/add`);
        }
        function edit(selected) {
            childrenModifyHide();
            var id = selected.GuID;
            loadingService.show();
            return classificationService.get({ GuID: id }).then((result) => {
                classification.modify.model = result;
                return classification.children.grid.getlist(false);
            }).then((result) => {
                classification.children.model = result;
                $location.path(`classific/edit/${classification.modify.model.GuID}`);
                classification.main.state = 'edit';
            }).catch(alertService.error).finally(loadingService.hide);
        }
        function cartable() {
            childrenModifyHide();
            classification.main.state = 'cartable';
            $location.path(`classific/cartable`);
        }

        function childrenModifyAdd() {
            classification.children.model = {};
            classification.modify.childrenModify = 'add';
        }
        function childrenModifyEdit(selected) {
            loadingService.show();
            return classificationService.get({ GuID: selected.GuID }).then((result) => {
                classification.children.model = result;
                classification.modify.childrenModify = 'edit';
            }).catch(alertService.error).finally(loadingService.hide);
        }
        function childrenModifyHide() {
            classification.children.isInformation = false;
            classification.children.informations = [];
            classification.modify.childrenModify = 'hide';
        }
    }
})();
