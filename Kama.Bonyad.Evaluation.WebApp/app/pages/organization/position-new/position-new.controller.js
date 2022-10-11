(() => {
    angular
        .module('evaluation')
        .controller('PositionNewController', PositionNewController);

    PositionNewController.$inject = ['ObjectService', 'toolsService', '$timeout', '$routeParams', '$location', 'positionService', 'loadingService', 'userService', 'alertService', 'globalService', 'organizationAttachmentService', '$q'];
    function PositionNewController(ObjectService, toolsService, $timeout, $routeParams, $location, positionService, loadingService, userService, alertService, globalService, organizationAttachmentService, $q) {
        toolsService.checkPermission(['pgePosition'], { notFound: true });
        let position = this;
        if (['cartable', 'edit', 'add'].indexOf($routeParams.state) === -1)
            $location.path('not-found');

        position.main = new ObjectService();
        position.cartable = new ObjectService();
        position.search = new ObjectService();
        position.modify = new ObjectService();
        position.user = new ObjectService();
        position.userInfo = new ObjectService();
        position.history = new ObjectService();
        position.historyModel = new ObjectService();

        position.main.changeState = {
            add: add
            , edit: edit
            , cartable: cartable
        };

        $timeout(init, 0);

        function init() {
            position.main.state = $routeParams.state;
            return $q.resolve().then(() => {
                switch ($routeParams.state) {
                    case 'cartable':
                        return cartable();
                    case 'add':
                        return add();
                    case 'edit':
                        return edit({ ID: $routeParams.id });
                }
            }).finally(() => {
                return position.cartable.grid.getlist(position.main.state === 'cartable');
            });
        }
        function add() {
            if (globalService.get('currentUserPosition').Type !== 100)
                return alertService.error('شما دسترسی لازم به این صفحه را ندارید.');
            position.history.model = {};
            position.history.grid.items = [];
            position.history.resetAttachments();
            position.history.update();
            position.main.state = 'add';
            position.modify.model = {};
            position.modify.update();
            position.modify.resetAttachments();
            position.userInfo.model = {};
            position.userInfo.nationalCode = '';
            $timeout(() => { document.querySelector('input[name=position-national-code]').focus(); }, 0);
            $location.path(`position-new/add`);
        }
        function edit(selected) {
            position.history.model = {};
            position.history.grid.items = [];
            position.history.resetAttachments();
            position.history.update();
            loadingService.show();
            position.main.state = 'edit';
            position.modify.resetAttachments();
            $location.path(`position-new/edit/${selected.ID}`);

            return positionService.get({ id: selected.ID }).then((result) => {
                position.modify.model = result || {};
                position.modify.update();
                if (position.modify.model.UserID && position.modify.model.UserID !== '00000000-0000-0000-0000-000000000000') {
                    position.userInfo.nationalCode = position.modify.model.NationalCode;
                    return userService.getByNationalCode({ NationalCode: position.userInfo.nationalCode }).then((result) => {
                        position.userInfo.model = result;
                        if (position.main.state === 'edit' && [20, 21].indexOf(position.modify.model.Type) === -1) {
                            return organizationAttachmentService.list({ parentId: position.userInfo.model.ID, Type: 50 }).then((result) => {
                                if (result && result.length)
                                    position.modify.attachment50.bindingObject = result[0];
                            });
                        }
                    });
                }
                else {
                    position.userInfo.nationalCode = '';
                    position.userInfo.model = {};
                }
            }).then(() => {
                $timeout(() => { document.querySelector('input[name=position-national-code]').focus(); }, 0);
                loadingService.hide();
            }).catch((error) => {
                loadingService.hide();
                alertService.error(error);
            });
        }
        function cartable() {
            position.main.state = 'cartable';
            $location.path(`position-new/cartable`);
        }
    }
})();
