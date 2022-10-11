(() => {
    angular
        .module('evaluation')
        .controller('ApplicationController', ApplicationController);

    ApplicationController.$inject = ['ObjectService', 'loadingService', 'alertService', '$routeParams', 'applicationService', '$window', '$location', '$q', '$scope', 'toolsService'];
    function ApplicationController(ObjectService, loadingService, alertService, $routeParams, applicationService, $window, $location, $q, $scope, toolsService) {
        if (!toolsService.checkPermission('pgeApplication')) {
            return $location.path('not-found');
        }
        let application = this;
       
        if (['cartable', 'add', 'edit'].indexOf($routeParams.state) === -1)
            $location.path('not-found');

        application.main = new ObjectService();
        application.modify = new ObjectService();
        application.client = new ObjectService();
        application.cartable = new ObjectService();
        application.search = new ObjectService();

        application.main.changeState = {
            cartable: cartable
            , edit: edit
            , add: add
        };

        init();

        function init() {
            loadingService.show();
            application.main.state = $routeParams.state;
            $q.resolve().then(() => {
                return application.cartable.grid.getlist(false);
            }).then(() => {
                switch ($routeParams.state) {
                    case 'cartable':
                        cartable();
                        loadingService.hide();
                        break;
                    case 'add':
                        add();
                        break;
                    case 'edit':
                        edit({ ID: $routeParams.id });
                        break;
                }
            });

            // handle browser back/forward buttons
            $window.onhashchange = (e) => {
                let [oldHash, oldPage, oldState, oldId] = new URL(e.oldURL).hash.split('/');
                let [newHash, newPage, newState, newId] = new URL(e.newURL).hash.split('/');

                if (oldPage === newPage
                    && (oldState !== newState || oldId !== newId)
                    && newState !== application.main.state) {
                    application.main.changeState[newState]({ ID: newId });
                    $scope.$apply();
                }
            };
        }
        function cartable() {
            application.main.state = 'cartable';
            $location.path('application/cartable');
        }
        function add() {
            application.main.state = 'add';
            application.modify.model = {};
            application.modify.update();
            $location.path(`application/add`);  
        }
        function edit(selected) {
            loadingService.show();
            application.main.state = 'edit';
            $location.path(`application/edit/${selected.ID}`);
            return applicationService.get(selected).then((result) => {
                application.modify.model = result;

                return application.client.grid.getlist(false);
            }).catch((error) => {
                alertService.error(error || 'Can not Recive any Data');
            }).finally(loadingService.hide);
        }
    }
})();