(() => {
    angular
        .module('evaluation')
        .controller('DepoController', DepoController);

    DepoController.$inject = ['ObjectService', 'depoService', 'itemService', '$timeout', '$routeParams', '$location', 'loadingService', 'alertService', '$q'];
    function DepoController(ObjectService, depoService, itemService, $timeout, $routeParams, $location, loadingService, alertService, $q) {


        let depo = this;

        depo.main = new ObjectService();
        depo.cartable = new ObjectService();
        depo.search = new ObjectService();
        depo.add = new ObjectService();
        depo.viwe = new ObjectService();

        depo.main.changeState = {
            add: add
            , viwe: viwe
            , cartable: cartable
        };

        $timeout(init, 0);

        function init() {
            loadingService.show();
            depo.main.state = $routeParams.state;
            return $q.resolve().then(() => {
                switch ($routeParams.state) {
                    case 'cartable':
                        return cartable();
                    case 'add':
                        return add({ ItemID: $routeParams.id });
                    case 'viwe':
                        return viwe({ ItemID: $routeParams.id });
                }
            }).then(() => {
                setParent();
            });//.finally(loadingService.hide);
        }
        function add(selected) {
            update();
            depo.add.model = {};
            if (selected && selected.ItemID) {
                loadingService.show();
                depoService.depoStorageList({ ItemID: selected.ItemID }).then((result) => {
                    depo.add.model.ItemID = result[0].ItemID 
                    depo.add.model.FaName2 = result[0].FaName 
                }).catch(alertService.error).finally(loadingService.hide);
            }
            depo.add.resetAttachments();
            depo.main.state = 'add';
            $location.path(`depo/add`);
        }
        function viwe(selected) {
            loadingService.show();
            return depoService.depoStorageList({ ItemID: selected.ItemID }).then((result) => {
                depo.viwe.model = result[0];
                depo.main.state = 'viwe';
                $location.path(`depo/viwe/${depo.add.model.ItemID}`);
            }).catch(alertService.error).finally(loadingService.hide);
         
        }
        function cartable() {
            depo.main.state = 'cartable';
            $location.path(`depo/cartable`);
        }

        function setParent() {
            return itemService.list({}).then((result) => {
                depo.main.Items = result;
                depo.search.itemDropdown.setItems(depo.main.Items);
                depo.add.itemDropdown.setItems(depo.main.Items);
                return depo.cartable.grid.getlist(true);
            }).finally(loadingService.hide);
        }

        function update() {
            if (depo.add.itemDropdown && depo.add.itemDropdown.update)
                depo.add.itemDropdown.update();
            if (depo.search.itemDropdown && depo.search.itemDropdown.update)
                depo.search.itemDropdown.update();
        }
    }
})();
