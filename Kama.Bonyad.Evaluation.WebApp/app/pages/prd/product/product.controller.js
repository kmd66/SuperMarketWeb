(() => {
    angular
        .module('evaluation')
        .controller('ProductController', ProductController);

    ProductController.$inject = ['ObjectService', 'productService', 'productClassificationService', '$timeout', '$routeParams', '$location', 'loadingService', 'alertService', '$q', 'attachmentService'];
    function ProductController(ObjectService, productService, productClassificationService, $timeout, $routeParams, $location, loadingService, alertService, $q, attachmentService) {


        let product = this;

        product.main = new ObjectService();
        product.cartable = new ObjectService();
        product.search = new ObjectService();
        product.modify = new ObjectService();
        product.tag = new ObjectService();

        product.main.setParent = setParent
        product.main.changeState = {
            add: add
            , edit: edit
            , cartable: cartable
        };

        $timeout(init, 0);

        function init() {
            loadingService.show();
            product.main.state = $routeParams.state;
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
            product.main.state = 'add';
            $location.path(`product/add`);
            reset();
            update();
        }
        function edit(selected) {
            var id = selected.GuID;
            reset();

            loadingService.show();
            return productService.get({ GuID: id }).then((result) => {
                product.modify.model = result;
                product.modify.Information = JSON.parse(product.modify.model.Information);
                product.modify.img.bindingObject = product.modify.model.Attachment;
                product.main.state = 'edit';
                $location.path(`product/edit/${product.modify.model.GuID}`);
                update();
                return product.tag.gridTag.getlist(false);
            }).catch(alertService.error).finally(loadingService.hide);
        }
        function cartable() {
            product.main.state = 'cartable';
            $location.path(`product/cartable`);
        }
        function setParent(b) {
            productClassificationService.list({ LastNode: true }).then((result) => {
                product.main.Parents = result;
                product.search.parentProductDropdown.setItems(product.main.Parents);
                product.modify.parentProductDropdown.setItems(product.main.Parents);
                return productClassificationService.list({ FirstNode: true });
            }).then((result) => {
                    product.modify.filterParentProductDropdown.setItems(result);
                if (b)
                    return product.cartable.grid.getlist(false);
            }).finally(loadingService.hide);
        }
        function reset() {
            //product.modify.resetAttachments();
            if (product.modify.img.reset)
                product.modify.img.reset();
            product.modify.tabNumber = 1;
            product.modify.model = {};
            product.tag.model = {};
            product.modify.Information = {};
        }
        function update() {
            if (product.modify.filterParentProductDropdown && product.modify.filterParentProductDropdown.update)
                product.modify.filterParentProductDropdown.update();
            if (product.modify.parentProductDropdown && product.modify.parentProductDropdown.update)
                product.modify.parentProductDropdown.update();

            if (product.modify.unitOfMeasureTypeDropDown && product.modify.unitOfMeasureTypeDropDown.update)
                product.modify.unitOfMeasureTypeDropDown.update();
        }
    }
})();
