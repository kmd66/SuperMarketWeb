(() => {
    angular
        .module('evaluation')
        .controller('ProductController', ProductController);

    ProductController.$inject = ['ObjectService', 'productService', 'classificationService', 'brandService', 'informationService', '$timeout', '$routeParams', '$location', 'loadingService', 'alertService', '$q', 'attachmentService'];
    function ProductController(ObjectService, productService, classificationService, brandService, informationService, $timeout, $routeParams, $location, loadingService, alertService, $q, attachmentService) {


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
                setParent();
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
                return informationService.listClassificationInformation({ ClassificationID: product.modify.model.ClassificationID });
            }).then((result) => {
                product.modify.Informations = result || [];
                product.modify.convetInformation();
                var b = false;
                product.modify.model.Attachments.map((x) => {
                    if (x.Type == 4)
                        product.modify.imgs.push({
                            Type: 4,
                            hideHead: true,
                            remove: product.modify.removeImg,
                            bindingObject: x
                        });
                    if (x.Type == 2 && !b) {
                        b = true;
                        product.modify.img.bindingObject = x;
                    }
                });
                //product.modify.img.bindingObject = product.modify.model.Attachments.find((x) => {x.Type ==2 });
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
        function setParent() {
            classificationService.list({ LastNode: true }).then((result) => {
                product.main.Classifications = result;
                product.search.classificationDropdown.setItems(product.main.Classifications);
                product.modify.classificationDropdown.setItems(product.main.Classifications);
                return brandService.list({});
            }).then((result) => {
                product.main.Brands = result;
                product.search.brandDropdown.setItems(product.main.Brands);
                product.modify.brandDropdown.setItems(product.main.Brands);
                return product.cartable.grid.getlist(false);
            }).finally(loadingService.hide);
        }

        function reset() {
            if (product.modify.img.reset)
                product.modify.img.reset();
            product.modify.tabNumber = 1;
            product.modify.model = {};
            product.tag.model = {};
            product.modify.Information = {};
            product.modify.imgs = [];
        }
        function update() {
            product.modify.update();
            product.search.update();
        }
    }
})();
