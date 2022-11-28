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

        brand.main.setParent = setParent
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
                        return edit({ ID: $routeParams.id });
                }
            }).then(() => {
                brand.cartable.grid.getlist(true);
                setParent(true);
            });//.finally(loadingService.hide);
        }
        function add() {
            update();
            brand.modify.model = {};
            brand.modify.resetAttachments();
            brand.main.state = 'add';
            $location.path(`brand/add`);
        }
        function edit(selected) {
            var id = selected.GuID;
            if (!id)
                id = selected.ID;

            loadingService.show();
            return brandService.get({ GuID: id }).then((result) => {
                brand.modify.model = result;
                update();
                brand.main.state = 'edit';
                $location.path(`brand/edit/${brand.modify.model.GuID}`);
            }).catch(alertService.error).finally(loadingService.hide);
        }
        function cartable() {
            brand.main.state = 'cartable';
            $location.path(`brand/cartable`);
        }
        function setParent(b) {
            productClassificationService.list({ FirstNode: true }).then((result) => {
                brand.search.parentBrandDropdown.setItems(result);
                brand.modify.parentBrandDropdown.setItems(result);
            }).finally(loadingService.hide);
        }
        function update() {
        }
    }
})();
