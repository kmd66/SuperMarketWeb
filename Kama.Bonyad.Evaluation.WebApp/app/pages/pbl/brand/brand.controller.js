(() => {
    angular
        .module('evaluation')
        .controller('BrandController', BrandController);

    BrandController.$inject = ['ObjectService', 'brandService', 'productClassificationService', '$timeout', '$routeParams', '$location', 'loadingService', 'alertService', '$q'];
    function BrandController(ObjectService, brandService, productClassificationService, $timeout, $routeParams, $location, loadingService, alertService, $q) {


        let brand = this;

        brand.main = new ObjectService();
        brand.cartable = new ObjectService();
        brand.search = new ObjectService();
        brand.modify = new ObjectService();

        brand.main.changeState = {
            add: add
            , edit: edit
            , cartable: cartable
        };

        $timeout(init, 0);

        function init() {
            loadingService.show();
            brand.main.state = $routeParams.state;
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
                brand.cartable.grid.getlist(true);
            });//.finally(loadingService.hide);
        }
        function add() {
            attachmentReset();
            update();
            brand.modify.model = {};
            brand.modify.resetAttachments();
            brand.main.state = 'add';
            $location.path(`brand/add`);
        }
        function edit(selected) {
            attachmentReset();

            loadingService.show();
            return brandService.get({ GuID: selected.GuID }).then((result) => {
                brand.modify.model = result;
                brand.modify.img.bindingObject = brand.modify.model.Attachment;
                update();
                brand.main.state = 'edit';
                $location.path(`brand/edit/${brand.modify.model.GuID}`);
            }).catch(alertService.error).finally(loadingService.hide);
        }
        function cartable() {
            brand.main.state = 'cartable';
            $location.path(`brand/cartable`);
        }
        function update() {
            if (brand.modify.parentBrandDropdown && brand.modify.parentBrandDropdown.update)
                brand.modify.parentBrandDropdown.update();
            if (brand.search.parentBrandDropdown && brand.search.parentBrandDropdown.update)
                brand.search.parentBrandDropdown.update();
        }
        function attachmentReset() {
            if (brand.modify.img.reset)
                brand.modify.img.reset();
        }
    }
})();
