(() => {
    angular
        .module('evaluation')
        .directive('kamaItemModify', kamaItemModify);

    kamaItemModify.$inject = ['itemService', 'loadingService', 'alertService', 'enumService', 'attachmentService', 'brandService', '$q'];
    function kamaItemModify(itemService, loadingService, alertService, enumService, attachmentService, brandService, $q) {
        let directive = {
            link: {
                pre: preLink
            }
            , template: require('./item-modify.directive.html')
            , restrict: 'E'
            , scope: {
                main: '=main'
                , modify: '=modify'
                , cartable: '=cartable'
                , tag: '=tag'
            }
        };

        return directive;
        function preLink(scope, element, attrs) {
            let item = scope;

            item.modify.save = save;
            item.modify.convetInformation = convetInformation;
            item.modify.addImg = addImg;
            item.modify.removeImg = removeImg;
            item.modify.saveImgs = saveImgs;
            item.modify.img = {
                title: 'تصویر شاخص',
                Type: 2
            };

            item.modify.imgs = [];

            item.modify.classificationDropdown = {
                bindingObject: item.modify
                , parameters: { ID: 'ClassificationID' }
                , select2: true
            };

            item.modify.brandDropdown = {
                bindingObject: item.modify
                , displayName:['FaName']
                , parameters: { ID: 'BrandID' }
                , select2: true
            };

            function save(getCartable) {
                loadingService.show();
                if (item.main.state == 'edit')
                    addInformation();
                itemService.save(item.modify.model).then((result) => {
                    item.modify.model = result
                    return item.modify.img.save(item.modify.model.GuID);
                }).then((result) => {
                    return saveImgs();
                }).then((result) => {
                    if (item.main.state == 'add' && !getCartable) {
                        item.main.changeState.edit(item.modify.model);
                    }
                    alertService.success('جنس با موفقیت ثبت شد');
                    if (getCartable) {
                        item.main.changeState.cartable();
                    }
                    return item.cartable.grid.getlist(false);
                }).catch(alertService.error).finally(loadingService.hide);

            }

            function addInformation() {
                item.modify.model.Information = JSON.stringify(item.modify.Informations);
                item.modify.model.Information = '{';
                item.modify.Informations.map((x) => {
                    if (x.Value)
                        item.modify.model.Information += `"${x.Text}":"${x.Value}",`;
                });
                item.modify.model.Information += '}';
            }

            function convetInformation() {
                var information = item.modify.model.Information.replaceAll("'", "").replaceAll('"', '').replace('{', '').replace('}', '');
                if (information.length > 0) {
                    var split = information.split(',');
                    split.map((x) => {
                        if (x.length > 0) {
                            var e = x.split(':');
                            var indexOf = item.modify.Informations.findIndex(i => i.Text == e[0]);
                            if (indexOf > -1)
                                item.modify.Informations[indexOf].Value = e[1];
                        }
                    });
                }
            }

            function addImg() {
                item.modify.imgs.push({
                    Type: 4,
                    hideHead: true,
                    remove: removeImg
                });
            }

            function saveImgs(parentID) {
                return $q.resolve().then(() => {
                    var list = [];
                    item.modify.imgs.map((x) => {
                        if (x.uploading) {
                            x.bindingObject.ParentID = item.modify.model.GuID;
                            x.bindingObject.Type = x.Type;
                            list.push(x.bindingObject);
                        }
                    });
                    if (list.length > 0)
                        return attachmentService.saveList(list);
                });
            }

            function removeImg(b, item) {
                var index = item.modify.imgs.findIndex(i => i.id == item.id);

                if (index > -1) {
                    var _img = item.modify.imgs[index];
                    if (_img.uploading) {
                        _img.reset();
                    }
                    else {
                        if (b) {
                            $(`#remove-modal${_img.id}`).modal('hide');
                            loadingService.show();
                            return attachmentService.remove(_img.bindingObject).then(() => {
                                _img.reset();
                                alertService.success('فایل حذف شد');
                            }).catch((error) => {
                                _img.uploading = false; //**state
                                alertService.error(error);
                            }).finally(loadingService.hide);
                        }
                        else
                            $(`#remove-modal${_img.id}`).modal('show');
                    }
                    return $q.resolve()
                }
            }

        }
    }
})();
