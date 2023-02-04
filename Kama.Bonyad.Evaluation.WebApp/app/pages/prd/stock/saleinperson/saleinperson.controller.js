(() => {
    angular
        .module('evaluation')
        .controller('SaleinpersonController', SaleinpersonController);

    SaleinpersonController.$inject = ['ObjectService', 'productService', 'productClassificationService', '$timeout', '$routeParams', '$location', 'loadingService', 'alertService', '$q', 'attachmentService'];
    function SaleinpersonController(ObjectService, productService, productClassificationService, $timeout, $routeParams, $location, loadingService, alertService, $q, attachmentService) {


        let saleinperson = this;

        saleinperson.main = new ObjectService();
        saleinperson.cartable = new ObjectService();
        saleinperson.search = new ObjectService();
        saleinperson.modify = new ObjectService();
        saleinperson.tag = new ObjectService();

        saleinperson.main.setParent = setParent
        saleinperson.main.changeState = {
            add: add
            , edit: edit
            , cartable: cartable
        };

        $timeout(init, 0);

        function init() {
            loadingService.show();
            saleinperson.main.state = $routeParams.state;
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
                setParent(true);
            });//.finally(loadingService.hide);
        }
        function add() {
            saleinperson.main.state = 'add';
            $location.path(`product/add`);
            reset();
            update();
        }
        function edit(selected) {
            var id = selected.GuID;
            reset();

            loadingService.show();
            return productService.get({ GuID: id }).then((result) => {
                saleinperson.modify.model = result;
                saleinperson.modify.Information = JSON.parse(saleinperson.modify.model.Information);
                saleinperson.modify.img.bindingObject = saleinperson.modify.model.Attachment;
                saleinperson.main.state = 'edit';
                $location.path(`product/edit/${saleinperson.modify.model.GuID}`);
                update();
                return saleinperson.tag.gridTag.getlist(false);
            }).catch(alertService.error).finally(loadingService.hide);
        }
        function cartable() {
            saleinperson.main.state = 'cartable';
            $location.path(`product/cartable`);
        }
        function setParent(b) {
            productClassificationService.list({ LastNode: true }).then((result) => {
                saleinperson.main.Parents = result;
                saleinperson.search.parentProductDropdown.setItems(saleinperson.main.Parents);
                saleinperson.modify.parentProductDropdown.setItems(saleinperson.main.Parents);
                return productClassificationService.list({ FirstNode: true });
            }).then((result) => {
                    saleinperson.modify.filterParentProductDropdown.setItems(result);
                if (b)
                    return saleinperson.cartable.grid.getlist(false);
            }).finally(loadingService.hide);
        }
        function reset() {
            //saleinperson.modify.resetAttachments();
            if (saleinperson.modify.img.reset)
                saleinperson.modify.img.reset();
            saleinperson.modify.tabNumber = 1;
            saleinperson.modify.model = {};
            saleinperson.tag.model = {};
            saleinperson.modify.Information = {};
        }
        function update() {
            if (saleinperson.modify.filterParentProductDropdown && saleinperson.modify.filterParentProductDropdown.update)
                saleinperson.modify.filterParentProductDropdown.update();
            if (saleinperson.modify.parentProductDropdown && saleinperson.modify.parentProductDropdown.update)
                saleinperson.modify.parentProductDropdown.update();

            if (saleinperson.modify.unitOfMeasureTypeDropDown && saleinperson.modify.unitOfMeasureTypeDropDown.update)
                saleinperson.modify.unitOfMeasureTypeDropDown.update();
        }
    }
})();
