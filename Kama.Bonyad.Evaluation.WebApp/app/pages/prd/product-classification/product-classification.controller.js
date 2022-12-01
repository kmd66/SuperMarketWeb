(() => {
    angular
        .module('evaluation')
        .controller('ProductClassificationController', ProductClassificationController);

    ProductClassificationController.$inject = ['ObjectService', 'productClassificationService', '$timeout', '$routeParams', '$location', 'loadingService', 'alertService', '$q', 'attachmentService'];
    function ProductClassificationController(ObjectService, productClassificationService, $timeout, $routeParams, $location, loadingService, alertService, $q, attachmentService) {


        let productClassific = this;

        productClassific.main = new ObjectService();
        productClassific.cartable = new ObjectService();
        productClassific.search = new ObjectService();
        productClassific.modify = new ObjectService();

        productClassific.main.setParent = setParent
        productClassific.main.changeState = {
            add: add
            , edit: edit
            , cartable: cartable
        };

        $timeout(init, 0);

        function init() {
            loadingService.show();
            productClassific.main.state = $routeParams.state;
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
            attachmentReset();
            productClassific.modify.model = {};
            productClassific.modify.resetAttachments();
            productClassific.main.state = 'add';
            $location.path(`product-classific/add`);
        }
        function edit(selected) {
            var id = selected.GuID;
            attachmentReset();
            //productClassific.modify.resetAttachments();

            loadingService.show();
            return productClassificationService.get({ GuID: id }).then((result) => {
                productClassific.modify.model = result;
                productClassific.modify.img.bindingObject = productClassific.modify.model.Attachment;
                productClassific.main.state = 'edit';
                $location.path(`product-classific/edit/${productClassific.modify.model.GuID}`);
            }).catch(alertService.error).finally(loadingService.hide);
        }
        function cartable() {
            productClassific.main.state = 'cartable';
            $location.path(`product-classific/cartable`);
        }
        function setParent(b) {
            productClassificationService.list({}).then((result) => {
                if (b) 
                    productClassific.cartable.grid.items = productClassific.cartable.resultSetLevel(result);
                productClassific.main.Parents = result;
                productClassific.search.parentProductClassificDropdown.setItems(productClassific.main.Parents);
                productClassific.modify.parentProductClassificDropdown.setItems(productClassific.main.Parents);
            }).finally(loadingService.hide);
        }
        function attachmentReset() {
            if (productClassific.modify.img.reset)
                productClassific.modify.img.reset();
        }
    }
})();
