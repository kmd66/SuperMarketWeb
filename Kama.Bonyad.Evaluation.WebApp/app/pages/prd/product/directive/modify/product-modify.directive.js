(() => {
    angular
        .module('evaluation')
        .directive('kamaProductModify', kamaProductModify);

    kamaProductModify.$inject = ['productService', 'loadingService', 'alertService', 'enumService', 'attachmentService', 'brandService', '$q'];
    function kamaProductModify(productService, loadingService, alertService, enumService, attachmentService, brandService, $q) {
        let directive = {
            link: {
                pre: preLink
            }
            , template: require('./product-modify.directive.html')
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
            let product = scope;

            product.modify.save = save;
            product.modify.convetInformation = convetInformation;
            product.modify.addImg = addImg;
            product.modify.removeImg = removeImg;
            product.modify.saveImgs = saveImgs;
            product.modify.img = {
                title: 'تصویر شاخص',
                Type: 2
            };

            product.modify.imgs = [];

            product.modify.classificationDropdown = {
                bindingObject: product.modify
                , parameters: { ID: 'ClassificationID' }
                , select2: true
            };

            product.modify.brandDropdown = {
                bindingObject: product.modify
                , displayName:['FaName']
                , parameters: { ID: 'BrandID' }
                , select2: true
            };

            function save(getCartable) {
                loadingService.show();
                if (product.main.state == 'edit')
                    addInformation();
                productService.save(product.modify.model).then((result) => {
                    product.modify.model = result
                    return product.modify.img.save(product.modify.model.GuID);
                }).then((result) => {
                    return saveImgs();
                }).then((result) => {
                    if (product.main.state == 'add' && !getCartable) {
                        product.main.changeState.edit(product.modify.model);
                    }
                    alertService.success('جنس با موفقیت ثبت شد');
                    if (getCartable) {
                        product.main.changeState.cartable();
                    }
                    return product.cartable.grid.getlist(false);
                }).catch(alertService.error).finally(loadingService.hide);

            }

            function addInformation() {
                product.modify.model.Information = JSON.stringify(product.modify.Informations);
                product.modify.model.Information = '{';
                product.modify.Informations.map((x) => {
                    if (x.Value)
                        product.modify.model.Information += `"${x.Text}":"${x.Value}",`;
                });
                product.modify.model.Information += '}';
            }

            function convetInformation() {
                var information = product.modify.model.Information.replaceAll("'", "").replaceAll('"', '').replace('{', '').replace('}', '');
                if (information.length > 0) {
                    var split = information.split(',');
                    split.map((x) => {
                        if (x.length > 0) {
                            var e = x.split(':');
                            var indexOf = product.modify.Informations.findIndex(i => i.Text == e[0]);
                            if (indexOf > -1)
                                product.modify.Informations[indexOf].Value = e[1];
                        }
                    });
                }
            }

            function addImg() {
                product.modify.imgs.push({
                    Type: 4,
                    hideHead: true,
                    remove: removeImg
                });
            }

            function saveImgs(parentID) {
                return $q.resolve().then(() => {
                    var list = [];
                    product.modify.imgs.map((x) => {
                        if (x.uploading) {
                            x.bindingObject.ParentID = product.modify.model.GuID;
                            x.bindingObject.Type = x.Type;
                            list.push(x.bindingObject);
                        }
                    });
                    if (list.length > 0)
                        return attachmentService.saveList(list);
                });
            }

            function removeImg(b, item) {
                var index = product.modify.imgs.findIndex(i => i.id == item.id);

                if (index > -1) {
                    var _img = product.modify.imgs[index];
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
