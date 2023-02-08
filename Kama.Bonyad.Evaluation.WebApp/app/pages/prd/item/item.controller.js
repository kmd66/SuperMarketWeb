(() => {
    angular
        .module('evaluation')
        .controller('ItemController', ItemController);

    ItemController.$inject = ['ObjectService', 'itemService', 'classificationService', 'brandService', 'informationService', '$timeout', '$routeParams', '$location', 'loadingService', 'alertService', '$q', 'attachmentService'];
    function ItemController(ObjectService, itemService, classificationService, brandService, informationService, $timeout, $routeParams, $location, loadingService, alertService, $q, attachmentService) {


        let item = this;

        item.main = new ObjectService();
        item.cartable = new ObjectService();
        item.search = new ObjectService();
        item.modify = new ObjectService();
        item.tag = new ObjectService();

        item.main.setParent = setParent
        item.main.changeState = {
            add: add
            , edit: edit
            , cartable: cartable
        };

        $timeout(init, 0);

        function init() {
            loadingService.show();
            item.main.state = $routeParams.state;
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
            item.main.state = 'add';
            $location.path(`item/add`);
            reset();
            update();
        }
        function edit(selected) {
            var id = selected.GuID;
            reset();

            loadingService.show();
            return itemService.get({ GuID: id }).then((result) => {
                item.modify.model = result;
                return informationService.listClassificationInformation({ ClassificationID: item.modify.model.ClassificationID });
            }).then((result) => {
                item.modify.Informations = result || [];
                item.modify.convetInformation();
                var b = false;
                item.modify.model.Attachments.map((x) => {
                    if (x.Type == 4)
                        item.modify.imgs.push({
                            Type: 4,
                            hideHead: true,
                            remove: item.modify.removeImg,
                            bindingObject: x
                        });
                    if (x.Type == 2 && !b) {
                        b = true;
                        item.modify.img.bindingObject = x;
                    }
                });
                //item.modify.img.bindingObject = item.modify.model.Attachments.find((x) => {x.Type ==2 });
                item.main.state = 'edit';
                $location.path(`item/edit/${item.modify.model.GuID}`);
                update();
                return item.tag.grid.getlist(false);
            }).catch(alertService.error).finally(loadingService.hide);
        }
        function cartable() {
            item.main.state = 'cartable';
            $location.path(`item/cartable`);
        }
        function setParent() {
            classificationService.list({ LastNode: true }).then((result) => {
                item.main.Classifications = result;
                item.search.classificationDropdown.setItems(item.main.Classifications);
                item.modify.classificationDropdown.setItems(item.main.Classifications);
                return brandService.list({});
            }).then((result) => {
                item.main.Brands = result;
                item.search.brandDropdown.setItems(item.main.Brands);
                item.modify.brandDropdown.setItems(item.main.Brands);
                return item.cartable.grid.getlist(false);
            }).finally(loadingService.hide);
        }

        function reset() {
            if (item.modify.img.reset)
                item.modify.img.reset();
            item.modify.tabNumber = 1;
            item.modify.model = {};
            item.tag.model = {};
            item.modify.Information = {};
            item.modify.imgs = [];
        }
        function update() {
            item.modify.update();
            item.search.update();
        }
    }
})();
