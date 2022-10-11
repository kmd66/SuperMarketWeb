(() => {
    angular
        .module('evaluation')
        .controller('UserSettingsController', UserSettingsController);

    UserSettingsController.$inject = ['ObjectService', 'loadingService', 'alertService', 'userService', 'toolsService'];
    function UserSettingsController(ObjectService, loadingService, alertService, userService, toolsService) {
        let setting = this;

        setting.main = new ObjectService();
        setting.main.saveSettings = saveSettings;
        setting.fields = new ObjectService();

        setting.fields.pageSizeDropDown = {
            items: [{ ID: 5 }, { ID: 10 }, { ID: 20 }, { ID: 50 }, { ID: 100 }]
            , bindingObject: setting.fields
            , parameters: { ID: 'PageSize' }
            , displayName: ['ID']
        }

        init();

        function init() {
            loadingService.show();
            userService.getSettings().then((result) => {
                setting.main.model = result || {};
                setting.fields.model = setting.main.model.Setting ? JSON.parse(setting.main.model.Setting) : {};
                setting.fields.update();
                loadingService.hide();
            }).catch((error) => {
                loadingService.hide();
                alertService.error(error);
            });
        }

        function saveSettings() {
            loadingService.show();
            setting.main.model.Setting = JSON.stringify(setting.fields.model)
            userService.saveSettings(setting.main.model).then(() => {
                loadingService.hide();
                location.reload();
            }).catch((error) => {
                alertService.error(error);
                loadingService.hide();
            });
        }
    }
})();