(() => {
    angular
        .module('evaluation')
        .factory('customHttpService', customHttpService);

    customHttpService.$inject = ['httpService', '$http', '$q', 'authenticationService'];
    function customHttpService(httpService, $http, $q, authenticationService) {
        let refreshTokenInprogress = 0;

        httpService.ApplicationSurveyAnswer = {
            Get: new RequestService('ApplicationSurveyAnswer/Get'),
            List: new RequestService('ApplicationSurveyAnswer/List'),
        };
        httpService.Message = {
            Add: new RequestService('Message/Add'),
            Edit: new RequestService('Message/Edit'),
            PermanentDelete: new RequestService('Message/PermanentDelete'),
            Delete: new RequestService('Message/Delete'),
            Seen: new RequestService('Message/Seen'),
            Send: new RequestService('Message/Send'),
            Get: new RequestService('Message/Get'),
            ListInBox: new RequestService('Message/ListInBox'),
            ListOutBox: new RequestService('Message/ListOutBox'),
            ListDraft: new RequestService('Message/ListDraft'),
        };
        httpService.Place = {
            List: new RequestService('Place/List'),
            Get: new RequestService('Place/Get'),
        };
        httpService.Position = {
            ListByUser: new RequestService('Position/ListByUser'),
            List: new RequestService('Position/List'),
            Get: new RequestService('Position/Get'),
            Save: new RequestService('Position/Save'),
            Remove: new RequestService('Position/Remove'),
            RemoveUser: new RequestService('Position/RemoveUser'),
            GetPermissions: new RequestService('Position/GetPermissions'),
            SetDefault: new RequestService('Position/SetDefault'),
            ListInAllApplications: new RequestService('Position/ListInAllApplications'),
            GetOnlineCount: new RequestService('Position/GetOnlineCount'),
        };
        httpService.Role = {
            Add: new RequestService('Role/Add'),
            Edit: new RequestService('Role/Edit'),
            Remove: new RequestService('Role/Remove'),
            List: new RequestService('Role/List'),
            Get: new RequestService('Role/Get'),
        };
        httpService.Application = {
            Get: new RequestService('Application/Get'),
            Add: new RequestService('Application/Add'),
            Edit: new RequestService('Application/Edit'),
            List: new RequestService('Application/List'),
        };
        httpService.Tag = {
            Save: new RequestService('Tag/Save'),
            Delete: new RequestService('Tag/Delete'),
            List: new RequestService('Tag/List'),
        };
        httpService.Stock = {
            Save: new RequestService('Stock/Save'),
            AddList: new RequestService('Stock/AddList'),
            Get: new RequestService('Stock/Get'),
            List: new RequestService('Stock/List'),
            Delete: new RequestService('Stock/Delete'),
            ChangeState: new RequestService('Stock/ChangeState'),
        };
        httpService.Product = {
            Save: new RequestService('Product/Save'),
            Delete: new RequestService('Product/Delete'),
            Get: new RequestService('Product/Get'),
            List: new RequestService('Product/List'),
        };
        httpService.ProductClassification = {
            Save: new RequestService('ProductClassification/Save'),
            Delete: new RequestService('ProductClassification/Delete'),
            Get: new RequestService('ProductClassification/Get'),
            List: new RequestService('ProductClassification/List'),
        };
        httpService.Attachment = {
            Upload: new RequestService('Attachment/Upload'),
            Save: new RequestService('Attachment/Save'),
            Remove: new RequestService('Attachment/Remove'),
            Get: new RequestService('Attachment/Get'),
            List: new RequestService('Attachment/List'),
        };
        httpService.Brand = {
            Save: new RequestService('Brand/Save'),
            Delete: new RequestService('Brand/Delete'),
            Get: new RequestService('Brand/Get'),
            List: new RequestService('Brand/List'),
        };
        httpService.Department = {
            Add: new RequestService('Department/Add'),
            Edit: new RequestService('Department/Edit'),
            Delete: new RequestService('Department/Delete'),
            List: new RequestService('Department/List'),
            Get: new RequestService('Department/Get'),
        };
        httpService.Command = {
            Add: new RequestService('Command/Add'),
            Edit: new RequestService('Command/Edit'),
            Remove: new RequestService('Command/Remove'),
            List: new RequestService('Command/List'),
        };
        httpService.Error = {
        };
        httpService.Home = {
            GetOnlineUsersCount: new RequestService('Home/GetOnlineUsersCount'),
            Init: new RequestService('Home/Init'),
            IsAuthenticated: new RequestService('Home/IsAuthenticated'),
        };
        httpService.NotFound = {
        };
        httpService.ApplicationSurvey = {
            List: new RequestService('ApplicationSurvey/List'),
        };
        httpService.OrganizationAttachment = {
            Upload: new RequestService('OrganizationAttachment/Upload'),
            Save: new RequestService('OrganizationAttachment/Save'),
            Remove: new RequestService('OrganizationAttachment/Remove'),
            Get: new RequestService('OrganizationAttachment/Get'),
            List: new RequestService('OrganizationAttachment/List'),
        };
        httpService.User = {
            Add: new RequestService('User/Add'),
            Register: new RequestService('User/Register'),
            SaveSettings: new RequestService('User/SaveSettings'),
            GetSettings: new RequestService('User/GetSettings'),
            Edit: new RequestService('User/Edit'),
            GetToken: new RequestService('User/GetToken'),
            GetRefreshToken: new RequestService('User/GetRefreshToken'),
            GetById: new RequestService('User/GetById'),
            GetByUsername: new RequestService('User/GetByUsername'),
            GetByNationalCode: new RequestService('User/GetByNationalCode'),
            GetByEmail: new RequestService('User/GetByEmail'),
            GetCurrentUser: new RequestService('User/GetCurrentUser'),
            List: new RequestService('User/List'),
            ForgotPassword: new RequestService('User/ForgotPassword'),
            SetPassword: new RequestService('User/SetPassword'),
            SetPasswordWithSecuriyStamp: new RequestService('User/SetPasswordWithSecuriyStamp'),
            GetCaptcha: new RequestService('User/GetCaptcha'),
            SendSecurityCode: new RequestService('User/SendSecurityCode'),
            VerifyCellPhone: new RequestService('User/VerifyCellPhone'),
            ResetPassword: new RequestService('User/ResetPassword'),
            ValidateSecurityCode: new RequestService('User/ValidateSecurityCode'),
        };

        return httpService;

        function RequestService(route, type = 'POST') {
            let model = {};

            return (params) => {
                model = params || {};
                return request().then((result) => {
                    return onSuccess({ result: result, request: request });
                }).catch((result) => {
                    return onError({ result: result, request: request });
                });
            };

            function request() {
                let options = { method: type, url: route };

                if (type === 'GET') {
                    for (let key in model) {
                        options.url += `/${model[key]}`;
                    }
                }
                else if (type === 'POST') {
                    options.data = model;
                };

                return $http(options);
            };
        };
        function onSuccess(response) {
            if (!response.result.data.Success)
                return $q.reject(response.result);

            return response.result.data.Data;
        }
        function onError(error) {
            if (error.result && error.result.data.Code === 401)
                return refreshToken().then(error.request).then((result) => {
                    return onSuccess({ result: result, request: error.request });
                }).catch((result) => {
                    return onError({ result: result, request: error.request });
                });
            else
                return $q.reject(error.result && error.result.data.Message || 'خطای ناشناخته');
        }
        function refreshToken() {
            return $q.resolve().then(() => {
                if (localStorage.authorizationData && refreshTokenInprogress === 0) {
                    refreshTokenInprogress += 1;
                    const token = JSON.parse(localStorage.authorizationData);
                    return $http({
                        method: 'POST'
                        , url: '/User/GetRefreshToken'
                        , data: { RefreshToken: token.refresh_token }
                    }).then((result) => {
                        if (result.data.Success) {
                            authenticationService.setCredentials(JSON.parse(result.data.Data));
                        }
                        else {
                            localStorage.clear();
                            $('body').html(`<div id='quit-container'><p>${result.data.Description}</p><button type='button' onclick='window.location.href = window.location.origin'>خروج</button></div>`);
                        }
                    }).finally(() => {
                        refreshTokenInprogress -= 1;
                    });
                }
            });
        }
    }
})();
