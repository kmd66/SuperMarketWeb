(() => {
    angular
        .module('evaluation')
        .directive('kamaApplicationModify', kamaApplicationModify);

    kamaApplicationModify.$inject = ['loadingService', 'alertService', '$routeParams', 'attachmentService', 'clientService', 'enumService', 'toolsService' , 'applicationService' , '$location'];
    function kamaApplicationModify(loadingService, alertService, $routeParams, attachmentService, clientService, enumService, toolsService, applicationService, $location) {
        const directive = {
            restrict: 'E'
            , link: {
                pre: preLink
            }
            , template: require('./application-modify.directive.html')
            , scope: {
                main: '=main'
                , modify: '=modify'
                , client: '=client'
                , cartable: '=cartable'
            }
        };

        return directive;

        function preLink(scope, element, attrs) {
            let application = scope;
            
            application.client.save = saveclient;
            application.client.setOrders = setclientOrders;
            application.client.grid = {
                bindingObject: application.client
                , columns: [
                    { name: 'Name', displayName: 'Title' }
                    , { name: 'Type', displayName: 'Type', type: 'enum', source: enumService.clientType }
                ]
                , displayNameFormat: ['Name']
                , modal: 'client-modal'
                , hideTable: true
                , hideFooter: true
                , pageSize: 9999 // pageIndex 0 is not working
                , onAdd: () => {
                    application.client.resetAttachments();
                }
                , onEdit: (selected) => {
                    
                }
                , options: () => {
                    return { ApplicationID: application.modify.model.ID };
                }
                , deleteService: clientService.remove
                , listService: clientService.list
            };
            application.client.typeDropDown = {
                items: enumService.ClientType
                , bindingObject: application.client
                , parameters: { ID: 'Type', Name: 'TypeName' }
                , select2: true
            };
            application.modify.save = saveapplication;
            application.modify.remove = removeapplication; 

            function removeapplication() {

                loadingService.show();
                applicationService.remove({ id: application.modify.model.ID}).then(() => {
                    return application.cartable.grid.getlist(false);
                }).then(() => {
                    alertService.success('برنامه با موفقیت حذف شد');
                    application.main.changeState.cartable();
                }).catch((error) => {
                    alertService.error(error);
                }).finally(loadingService.hide);
                
            }
            function saveapplication() {

                loadingService.show();
                applicationService.save(application.modify.model).then((result) => {
                    application.modify.model = result;
                    $location.path(`/application/edit/${result.ID}`);
                    alertService.success('اطلاعات با موفقیت ذخیره شد');
                    //return application.cartable.grid.getlist(false);
                }).catch((error) => {
                    alertService.error(error);
                }).finally(loadingService.hide);

            }
            function saveclient() {
                loadingService.show();
                application.client.model.ApplicationID = application.modify.model.ID;
                clientService.save(application.client.model).then((result) => {
                    application.client.model = result;
                    application.client.update();

                }).then(() => {
                    return application.client.grid.getlist(false);
                }).then(() => {
                    $('#client-modal').modal('hide');
                }).catch((error) => {
                    alertService.error(error);
                    $('#client-modal .modal-body').animate({ scrollTop: 0 }, 'slow');
                }).finally(loadingService.hide);
            }
            function setclientOrders() {
                loadingService.show();
                let clients = application.client.grid.items;
                clients.map((item, index) => { item.Order = index + 1; });
                clientService.setOrders(clients).then(() => {
                    alertService.success('Successful');
                }).catch((error) => {
                    alertService.error(error);
                }).finally(loadingService.hide);
            }
        }
    }
})();