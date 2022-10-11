(() => {
    angular
        .module('evaluation')
        .directive('kamaPositionCartable', kamaPositionCartable);

    kamaPositionCartable.$inject = ['globalService', 'positionService', 'departmentService', 'alertService', '$q', 'loadingService', 'userService', 'enumService', 'roleService', 'toolsService', 'daadDepartmentService'];
    function kamaPositionCartable(globalService, positionService, departmentService, alertService, $q, loadingService, userService, enumService, roleService, toolsService, daadDepartmentService) {
        let directive = {
            link: {
                pre: preLink
            }
            , template: require('./position-cartable.directive.html')
            , restrict: 'E'
            , scope: {
                main: '=main'
                , cartable: '=cartable'
                , search: '=search'
            }
        };

        return directive;

        function preLink(scope, element, attrs) {
            let position = scope;

            position.cartable.currentUserPositionType = globalService.get('currentUserPosition').Type;
            position.cartable.removePersone = removePersone;
            position.cartable.removePosition = removePosition;
            position.cartable.confirmResetPassword = confirmResetPassword;
            position.cartable.exportExcel = exportExcel;
            position.cartable.changeTypeDropDown = changeTypeDropDown;
            position.cartable.grid = {
                bindingObject: position.cartable
                , columns: [
                    { name: 'DepartmentName', displayName: 'محل کار' }
                    , { name: 'NationalCode', displayName: 'کد ملی' }
                    , { name: 'FirstName', displayName: 'نام' }
                    , { name: 'LastName', displayName: 'نام خانوادگی' }
                    , { name: 'Username', displayName: 'نام کاربری' }
                    , { name: 'Type', displayName: 'سمت', type: 'enum', source: enumService.EvaluationPositionType }
                    , { name: 'CellPhone', displayName: 'تلفن همراه' }
                ]
                , initload: false
                , pageSize: globalService.get('userSettings').PageSize
                , options: () => { return position.search.model; }
                , listService: (options) => {
                    return $q.resolve().then(() => {
                        let settings = globalService.get('userSettings');

                        if (settings.PageSize !== position.cartable.grid.pageSize) {
                            settings.PageSize = position.cartable.grid.pageSize;
                            return userService.saveSettings({ Setting: JSON.stringify(settings) });
                        }
                    }).then(() => {
                        return positionService.list(options);
                    });
                }
                , hideHeader: (() => {
                    return position.cartable.currentUserPositionType !== 100 ? true : false;
                })()
                , actions: [
                    //{
                    //    class: "fa fa-user-times tgrid-action"
                    //    , name: "removeUser"
                    //    , title: "حذف شخص از جایگاه"
                    //    , onclick: (selected) => {
                    //        position.cartable.removePersoneObject = selected;
                    //        $('#confirm-remove-user-modal').modal('show');
                    //    }
                    //},
                    {
                        class: "fa fa-key tgrid-action"
                        , name: "resetPassword"
                        , title: "بازنشانی رمز عبور"
                        , onclick: (selected) => {
                            position.cartable.resetPasswordObject = selected;
                            $('#confirm-reset-password-modal').modal('show');
                        }
                    },
                    {
                        class: "fa fa-pencil tgrid-action"
                        , name: "editPosition"
                        , title: "ویرایش جایگاه"
                        , onclick: (selected) => {
                            position.main.changeState.edit(selected);
                        }
                    }
                ]
                , checkActionVisibility: (action, item) => {
                    if (action === 'removeUser') {
                        if ([20, 21].indexOf(item.Type) !== -1 && (item.UserID && item.UserID !== '00000000-0000-0000-0000-000000000000'))
                            return true;
                        else
                            return false;
                    }
                    else if (action === 'resetPassword') {
                        if ([100].indexOf(globalService.get('currentUserPosition').Type) !== -1 && (item.UserID && item.UserID !== '00000000-0000-0000-0000-000000000000'))
                            return true;
                        else
                            return false;
                    }
                    else
                        return true;
                }
                , onAdd: () => { position.main.changeState.add(); }
            };

            position.search.model.UserType = 1;
            position.search.departmentDropDown = {
                bindingObject: position.search
                , parameters: { ID: 'DepartmentID', Name: 'DepartmentName' }
                , select2: true
                , initLoad: true
                , listService: daadDepartmentService.list
            };
            position.search.typeDropDown = {
                items: toolsService.arrayEnum(enumService.EvaluationPositionType).filter((item) => { return [20, 21].indexOf(item.ID) === -1; })
                , bindingObject: position.search
                , parameters: { ID: 'Type', Name: 'TypeName' }
                , select2: true
            };

            position.search.enableDropDown = {
                items: enumService.EnableOrDisable
                , bindingObject: position.search
                , parameters: { ID: 'EnableState', Name: 'EnableStateName' }
            };

            function changeTypeDropDown(type) {
                let departmentNameColumnIndex;
                position.search.model.UserType = type;
                position.search.model.Type = null;
                
                switch (type) {
                    case 1:
                        departmentNameColumnIndex = position.cartable.grid.columns.findIndex((item) => { return item.name === 'DepartmentName' });
                        if (departmentNameColumnIndex === -1)
                            position.cartable.grid.columns.unshift({ name: 'DepartmentName', displayName: 'محل کار' });
                        position.search.typeDropDown.setItems(toolsService.arrayEnum(enumService.EvaluationPositionType).filter((item) => { return [20, 21].indexOf(item.ID) === -1; }));
                        break;

                    case 2:
                        departmentNameColumnIndex = position.cartable.grid.columns.findIndex((item) => { return item.name === 'DepartmentName' });
                        if (departmentNameColumnIndex !== -1)
                            position.cartable.grid.columns.splice(departmentNameColumnIndex, 1);
                        position.search.typeDropDown.setItems(toolsService.arrayEnum(enumService.EvaluationPositionType).filter((item) => { return [20, 21].indexOf(item.ID) !== -1; }));
                        break;

                    default:
                        position.search.typeDropDown.setItems(toolsService.arrayEnum(enumService.EvaluationPositionType));
                }

                position.cartable.grid.getlist();
            }
            function removePersone() {
                loadingService.show();
                return $q.resolve().then(() => {
                    return positionService.removeUser({ positionId: position.cartable.removePersoneObject.ID });
                }).then(() => {
                    return position.cartable.grid.getlist(false);
                }).then(() => {
                    setTimeout(() => {
                        loadingService.hide();
                        alertService.success('شخص با موفقیت از جایگاه حذف شد');
                        $('#confirm-remove-user-modal').modal('hide');
                    }, 500);
                }).catch((error) => {
                    loadingService.hide();
                    alertService.error(error);
                });
            }
            function removePosition() {
                loadingService.show();
                return $q.resolve().then(() => {
                    return positionService.remove({ positionId: position.cartable.removePositionObject.ID });
                }).then(() => {
                    return position.cartable.grid.getlist(false);
                }).then(() => {
                    setTimeout(() => {
                        loadingService.hide();
                        alertService.success('جایگاه با موفقیت حذف شد');
                        $('#confirm-remove-position-modal').modal('hide');
                    }, 500);
                }).catch((error) => {
                    loadingService.hide();
                    alertService.error(error);
                });
            }
            function confirmResetPassword() {
                loadingService.show();
                return userService.resetPassword({ ID: position.cartable.resetPasswordObject.UserID }).then(() => {
                    alertService.success('رمز عبور شخص با موفقیت بازنشانی شد');
                    $('#confirm-reset-password-modal').modal('hide');
                }).catch((error) => {
                    alertService.error(error || 'خطا در بازنشانی رمز عبور');
                }).finally(loadingService.hide);
            }
            function exportExcel() {
                loadingService.show();
                let downloadWindow = window.open();
                positionService.listExcel(position.search.model).then((result) => {
                    downloadWindow.location = result.FilePath;
                    alertService.success('دریافت اکسل با موفقیت انجام شد.');
                }).catch((error) => {
                    position.cartable.model.errors = error.split('&&');
                    $('#content > div').animate({ scrollTop: 0 }, 'slow');
                }).finally(loadingService.hide);
            }
        }
    }
})();
