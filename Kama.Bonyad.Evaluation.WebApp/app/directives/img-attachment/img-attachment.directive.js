(() => {
    angular
        .module('evaluation')
        .directive('imgAttachment', imgAttachment);

    imgAttachment.$inject = ['$q', 'loadingService', 'alertService', '$timeout', 'attachmentService'];
    function imgAttachment($q, loadingService, alertService, $timeout, attachmentService) {
        var directive = {
            restrict: 'E'
            , link: link
            , template: require('./img-attachment.html')
            , scope: {
                obj: '=obj',
            }
        };

        return directive;

        function link(scope, element, attrs) {
            scope.obj.id = "id" + Math.random().toString(16).slice(2)
            if (!scope.obj.title)
                scope.obj.title = 'تصویر';
            scope.obj.select = select;
            scope.obj.upload = upload;
            scope.obj.save = save;
            if (!scope.obj.remove)
                scope.obj.remove = remove;
            scope.obj.show = show;
            scope.obj.reset = reset;
            scope.obj.changeSelect = changeSelect;

            scope.obj.selectFile ;
            scope.obj.selected;
            scope.obj.uploading ; 

            function select() {
                //var f = document.getElementById(`file${scope.obj.id}`).files[0];
                $(`#file${scope.obj.id}`).click();
            }
            function upload() {
                if (!scope.obj.selected || !document.getElementById(`file${scope.obj.id}`).files[0])
                    return;

                loadingService.show();
                let fileData = new FormData();
                fileData.append(document.getElementById(`file${scope.obj.id}`).files[0].name, document.getElementById(`file${scope.obj.id}`).files[0]);
                scope.obj.uploading = true; // rename to state // **state

                attachmentService.upload(fileData)
                    .then((result) => {
                        if (result) scope.obj.bindingObject = result;
                        else return $q.reject('خطا در بارگذاری فایل');
                    }).catch((error) => {
                        scope.uploading = false; //**state
                        alertService.error(error);
                    }).finally(loadingService.hide);
            }
            function save(parentID) {
                return $q.resolve().then(() => {
                    if (scope.obj.uploading) {
                        if (!parentID)
                            return $q.reject('parentID null');
                        else if (!scope.obj.bindingObject)
                            return $q.reject('bindingObject null');
                        else {
                            scope.obj.bindingObject.ParentID = parentID;
                            scope.obj.bindingObject.Type = scope.obj.Type;
                            return attachmentService.save(scope.obj.bindingObject);
                        }
                    }
                });

                $(`#file${scope.obj.id}`).click();
            }
            function remove(b, item) {
                if (scope.obj.uploading) {
                    reset();
                    //return $q.reject();
                }
                else {
                    if (b) {
                        $(`#remove-modal${scope.obj.id}`).modal('hide');
                        loadingService.show();
                        return attachmentService.remove(scope.obj.bindingObject).then(() => {
                            reset();
                            alertService.success('فایل حذف شد');
                        }).catch((error) => {
                            scope.uploading = false; //**state
                            alertService.error(error);
                        }).finally(loadingService.hide);
                    }
                    else
                        $(`#remove-modal${scope.obj.id}`).modal('show');
                }
                return $q.resolve()
            }
            function show() {
                window.open(scope.obj.bindingObject.Url);
            }
            function reset() {
                $timeout(function () {
                    document.getElementById(`file${scope.obj.id}`).value = "";
                    scope.obj.selected = false;
                    scope.obj.uploading = false;
                    scope.obj.bindingObject = null;
                }, 1);
            }
            function changeSelect() {
                $timeout(function () {
                    if (document.getElementById(`file${scope.obj.id}`).files[0])
                        scope.obj.selected = true;
                    else
                        scope.obj.selected = false;
                }, 1);
            }
        }
    }
})();