(() => {
    angular
        .module('evaluation')
        .controller('CommandController', CommandController);

    CommandController.$inject = ['commandService', 'ObjectService', 'alertService', 'loadingService', 'toolsService', '$location', '$timeout', 'enumService'];
    function CommandController(commandService, ObjectService, alertService, loadingService, toolsService, $location, $timeout, enumService) {
        toolsService.checkPermission(['pgeCommand'], { notFound: true });
        let command = this;

        command.main = new ObjectService();

        command.main.add = addCommand;
        command.main.confirmRemove = confirmRemove;
        command.main.save = save;
        command.main.tree = {
            data: []
            , colDefs: [
                { field: 'Name', displayName: 'عنوان انگلیسی' }
                , { field: 'PermissionName', displayName: 'نام مجوز' }
                , {
                    field: ''
                    , displayName: ''
                    , cellTemplate: (
                        `<div style='float: left'>
                            <i class='fa fa-plus tgrid-action' ng-click='cellTemplateScope.add(row.branch)' title='افزودن'></i>
                            <i class='fa fa-pencil tgrid-action' ng-click='cellTemplateScope.edit(row.branch)' title='ویرایش'></i>
                            <i class='fa fa-trash tgrid-action' ng-click='cellTemplateScope.remove(row.branch)' title='حذف'></i>
                        </div>`
                    )
                    , cellTemplateScope: {
                        add: addCommand
                        , edit: editCommand
                        , remove: removeCommand
                    }
                }
            ]
            , expandingProperty: {
                field: "Title"
                , displayName: "عنوان"
            }
        }
        command.main.parentDropDown = {
            bindingObject: command.main
            , parameters: { Node: 'ParentNode', ID: 'ParentID', Title: 'ParentName' }
            , uniqueId: 'Node'
            , displayName: ['Title']
        }
        command.main.typeDropDown = {
            items: enumService.CommandType
            , bindingObject: command.main
            , parameters: { ID: 'Type', Name: 'TypeName' }
        };

        init();

        function init() {
            loadingService.show();
            commandService.list().then((result) => {
                command.main.parentDropDown.setItems(result);
                setTreeObject(result);
            }).catch((error) => {
                alertService.error(error || 'خطا در دریافت لیست دسترسی‌ها');
            }).finally(loadingService.hide);
        }
        function addCommand(parent) {
            parent = parent || {};
            command.main.state = 'add';
            command.main.model = { ParentNode: parent.Node };
            command.main.update();
            $('#command-modal').modal('show');
        }
        function confirmRemove() {
            loadingService.show();
            commandService.remove({ ID: command.main.removeObject.ID }).then(() => {
                return commandService.list();
            }).then((result) => {
                let scrollPosition = document.querySelector('#content > div').scrollTop;

                command.main.parentDropDown.setItems(result);
                setTreeObject(result);
                command.main.tree.expandTo = command.main.model.Title;

                $timeout(() => {
                    document.querySelector('#content > div').scrollTop = scrollPosition;
                    $('#confirm-remove-modal').modal('hide');
                    loadingService.hide();
                    alertService.success('دسترسی با موفقیت حذف شد');
                }, 500);
            }).catch((error) => {
                loadingService.hide();
                alertService(error || 'خطا در حذف دسترسی');
            });
        }
        function editCommand(selected) {
            command.main.state = 'edit';
            command.main.model = angular.copy(selected);
            command.main.update();
            $('#command-modal').modal('show');
        }
        function removeCommand(selected) {
            command.main.removeObject = selected;
            $('#confirm-remove-modal').modal('show');
        }
        function save() {
            loadingService.show();
            commandService.save(command.main.model).then(() => {
                return commandService.list();
            }).then((result) => {
                let scrollPosition = document.querySelector('#content > div').scrollTop;

                command.main.parentDropDown.setItems(result);
                setTreeObject(result);
                command.main.tree.expandTo = command.main.model.Title;

                $timeout(() => {
                    document.querySelector('#content > div').scrollTop = scrollPosition;
                    $('#command-modal').modal('hide');
                    loadingService.hide();
                    alertService.success('تغییرات با موفقیت اعمال شد');
                }, 500);
            }).catch((error) => {
                loadingService.hide();
                alertService.error(error);

                if (command.main.model.errors.length)
                    $('#command-modal .modal-body').animate({ scrollTop: 0 }, 'slow');
            });
        }
        function setTreeObject(commands) {
            commands.map((item) => {
                if (item.ParentNode === '/')
                    item.expanded = true;
            });
            command.main.tree.data = toolsService.getTreeObject(commands, 'Node', 'ParentNode', '/');
        }
    }
})();