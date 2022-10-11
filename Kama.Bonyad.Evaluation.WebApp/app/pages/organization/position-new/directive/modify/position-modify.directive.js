(() => {
    angular
        .module('evaluation')
        .directive('kamaPositionModify', kamaPositionModify);

    kamaPositionModify.$inject = ['globalService', 'alertService', 'loadingService', 'toolsService', 'httpService', 'enumService', 'userService', '$timeout', 'daadDepartmentService', 'roleService', 'positionService', 'organizationAttachmentService', '$q'];
    function kamaPositionModify(globalService, alertService, loadingService, toolsService, httpService, enumService, userService, $timeout, daadDepartmentService, roleService, positionService, organizationAttachmentService, $q) {
        let directive = {
            link: {
                pre: preLink
            }
            , template: require('./position-modify.directive.html')
            , restrict: 'E'
            , scope: {
                main: '=main'
                , modify: '=modify'
                , cartable: '=cartable'
                , user: '=user'
                , userInfo: '=userInfo'
                , history: '=history'
                , historyModel: '=historyModel'
            }
        };

        return directive;
        function preLink(scope, element, attrs) {
            let position = scope;

            position.modify.attachment50 = {};
            position.modify.attachment50 = {
                bindings: [{ obj: position.userInfo, parameter: 'ID', as: 'ParentID' }]
                , autoSave: false
                , type: 50
                , uploadService: organizationAttachmentService.upload
                , downloadService: organizationAttachmentService.download
                , deleteService: organizationAttachmentService.remove
                , saveService: organizationAttachmentService.save
            }

            position.modify.currentUserPositionType = globalService.get('currentUserPosition').Type;
            position.modify.save = save;
            position.modify.typeDropDown = {
                items: enumService.EvaluationPositionType
                , bindingObject: position.modify
                , parameters: { ID: 'Type', Name: 'TypeName' }
                , select2: true
            };
            position.modify.departmentDropDown = {
                bindingObject: position.modify
                , parameters: { ID: 'DepartmentID', Name: 'DepartmentName' }
                , select2: true
                , initLoad: true
                , listService: daadDepartmentService.list
            };

            position.userInfo.get = getUserInfo;
            position.user.save = saveUser;
            position.userInfo.validateNationalCode = toolsService.validate.nationalCode;

            init();

            function init() {
                roleService.list().then((roles) => {
                    position.modify.roles = roles;
                }).catch(() => {
                        alertService.error(error || 'خطا در بارگذاری اطلاعات نقش‌ها');
                });
            }
            function getUserInfo() {
                if (!toolsService.validate.nationalCode(position.userInfo.nationalCode))
                    return alertService.error('کد ملی را به صورت صحیح وارد نمایید.');
                loadingService.show();
                return userService.getByNationalCode({ NationalCode: position.userInfo.nationalCode }).then((user) => {
                    if (user && user.ID) {
                        position.userInfo.model = user;
                        position.modify.model.UserID = user.ID;
                    }
                    else {
                        position.user.setNationalCode(position.userInfo.nationalCode);
                        $('#user-modal').modal('show');
                        $timeout(() => { document.querySelector('input[name=user-national-code]').focus(); }, 500);
                    }
                    loadingService.hide();
                }).catch((error) => {
                    loadingService.hide();
                    alertService.error(error);
                });
            }
            function saveUser() {
                loadingService.show();
                userService.save(position.user.get()).then(() => {
                    position.userInfo.nationalCode = position.user.get().NationalCode;
                    return userService.getByNationalCode({ NationalCode: position.user.get().NationalCode });
                }).then((result) => {
                    position.userInfo.model = result;
                    position.modify.model.UserID = result.ID;
                    loadingService.hide();
                    $('#user-modal').modal('hide');
                    alertService.success('اطلاعات با موفقیت ذخیره شد');
                }).catch((error) => {
                    loadingService.hide();
                    alertService.error(error);
                });
            }
            function save() {


                loadingService.show();

                return $q.resolve().then(() => {
                    if (position.main.state === 'edit')
                        return httpService.User.Edit(position.userInfo.model);
                }).then(() => {
                    if (position.main.state === 'edit' && position.modify.attachment50.successUpload)
                        return position.modify.attachment50.save();
                }).then(() => {
                    return positionService.save(position.modify.model)
                }).then(() => {
                    alertService.success('اطلاعات با موفقیت ذخیره شد');
                    position.main.changeState.cartable();
                    position.cartable.grid.getlist(position.main.state === 'cartable');
                }).catch((error) => {
                    alertService.error(error);
                }).finally(loadingService.hide);
            }

        }
    }
})();
