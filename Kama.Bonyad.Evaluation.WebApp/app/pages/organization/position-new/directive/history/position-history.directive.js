(() => {
    angular
        .module('evaluation')
        .directive('kamaPositionHistory', kamaPositionHistory);

    kamaPositionHistory.$inject = ['positionHistoryService', 'loadingService', 'organizationAttachmentService', 'toolsService', 'enumService'];
    function kamaPositionHistory(positionHistoryService, loadingService, organizationAttachmentService, toolsService, enumService) {
        let directive = {
            link: {
                pre: preLink
            }
            , template: require('./position-history.directive.html')
            , restrict: 'E'
            , scope: {
                main: '=main'
                , obj: '=obj'
                , history: '=history'
                , historyModel: '=historyModel'
                , user: '=user'
                , userInfo: '=userInfo'
                , initLoad: '=initLoad'
            }
        };

        return directive;

        function preLink(scope, element, attrs) {
            scope.id = toolsService.randomString(5);
            scope.obj = scope.obj || {};
            scope.history.refresh = update;
            scope.historyModel.saveHistory = saveHistory;

            if (scope.initLoad !== false)
                scope.initLoad = true;

            scope.history.grid = {
                bindingObject: scope.history
                , initLoad: scope.initLoad
                , columns: [
                    { name: 'FirstName', displayName: 'نام' }
                    , { name: 'LastName', displayName: 'نام خانوادگی' }
                    , { name: 'Username', displayName: 'نام کاربری' }
                    , { name: 'Date', displayName: 'تاریخ نامه', type: 'date' }
                    , { name: 'LetterNumber', displayName: 'شماره نامه' }
                    , { name: 'CreationDate', displayName: 'تاریخ ثبت کاربر', type: 'date' }
                    , { name: 'CreationDate', displayName: 'ساعت ثبت کاربر', type: 'time' }
                    , { name: 'CreatorUserFirstName', displayName: 'نام ایجاد کننده' }
                    , { name: 'CreatorUserLastName', displayName: 'نام خانوادگی ایجاد کننده' }
                    , { name: 'CreatorPositionType', displayName: 'سمت ایجاد کننده', type: 'enum', source: enumService.SakhtarPositionType }
                    , { name: 'CreatorPositionDepartmentName', displayName: 'دستگاه ایجاد کننده' }
                ]
                , hideHeader: true
                , actions: [
                    {
                        class: "fa fa-pencil-square-o"
                        , name: "edit"
                        , title: "ویرایش"
                        , onclick: (selected) => {
                            loadingService.show();
                            scope.historyModel.resetAttachments();
                            scope.historyModel.model = {};
                            return positionHistoryService.get({ id: selected.ID }).then((result) => {
                                scope.historyModel.model = result;
                                return organizationAttachmentService.list({ parentId: scope.historyModel.model.ID });
                            }).then((attachment6 = []) => {
                                if (attachment6.length && attachment6[0].Type === 6)
                                    scope.historyModel.attachment6.bindingObject = attachment6[0];
                            }).then(() => {
                                $('#position-history-modify-modal').modal('show');
                            }).catch((error) => {
                                scope.historyModel.model.errors = error.split('&&');
                                $('#position-history-modify-modal .modal-body').animate({ scrollTop: 0 }, 'slow');
                            }).finally(loadingService.hide);
                        }
                    }
                    ,
                    {
                        class: "fa fa-folder-open-o"
                        , name: "view"
                        , title: "مشاهده"
                        , onclick: (selected) => {
                            loadingService.show();
                            scope.historyModel.resetAttachments();
                            scope.historyModel.model = {};
                            return positionHistoryService.get({ id: selected.ID }).then((result) => {
                                scope.historyModel.model = result;
                                return organizationAttachmentService.list({ parentId: scope.historyModel.model.ID });
                            }).then((attachment6 = []) => {
                                if (attachment6.length && attachment6[0].Type === 6)
                                    scope.historyModel.attachment6.bindingObject = attachment6[0];
                            }).then(() => {
                                $(`#position-history-view-modal-${scope.id}`).modal('show');
                            }).catch((error) => {
                                scope.historyModel.model.errors = error.split('&&');
                                $('#position-history-view-modal .modal-body').animate({ scrollTop: 0 }, 'slow');
                            }).finally(loadingService.hide);
                        }
                    }
                ]
                , checkActionVisibility: function (action, item) {
                    if (action === 'edit' && toolsService.checkPermission(['elmPositionNew/Add/History/Edit']))
                        return true;
                    else if (action === 'view' && toolsService.checkPermission(['elmPositionNew/Add/History/View']))
                        return true;
                    else
                        return false;
                }
                , options: () => {
                    return { PositionID: scope.obj.model.ID };
                }
                , listService: positionHistoryService.list
                , rowClass: (item) => {
                    let classes = '';
                    if (item.IsEndUser)
                        classes += 'is-end-user';
                    return classes;
                }
            };
            scope.historyModel.attachment6 = {
                bindings: [{ obj: scope.historyModel, parameter: 'ID', as: 'ParentID' }]
                , autoSave: false
                , type: 6
                , validTypes: ["application/pdf"]
                , readOnly: () => {
                    if (!toolsService.checkPermission(['elmPositionNew/Add/History/Edit']))
                        return true;
                }
                , uploadService: organizationAttachmentService.upload
                , downloadService: organizationAttachmentService.download
                , deleteService: organizationAttachmentService.remove
                , saveService: organizationAttachmentService.save
            };

            function update() {
                scope.history.grid.items = [];
                return scope.history.grid.getlist(false);
            }
            function saveHistory() {
                loadingService.show();
                positionHistoryService.save(scope.historyModel.model).then((result) => {
                    scope.historyModel.model = result;
                    if (scope.historyModel.attachment6.successUpload)
                        return scope.historyModel.attachment6.save();
                }).then(() => {
                    return update();
                }).then(() => {
                    $('#position-history-modify-modal').modal('hide');
                    alertService.success('اطلاعات با موفقیت ذخیره شد');
                }).catch((error) => {
                    alertService.error(error);
                }).finally(loadingService.hide);
            }
        }
    }
})();
