//using Kama.Bonyad.Evaluation.WebApp.Tools;
//using System;
//using System.Threading.Tasks;
//using System.Web.Mvc;

//namespace Kama.Bonyad.Evaluation.WebApp.Controllers
//{
//    public class ApplicationSurveyGroupController : BaseController
//    {
//        public ApplicationSurveyGroupController(Organization.ApiClient.Interface.IApplicationSurveyGroupService applicationSurveyGroupService)
//        {
//            _applicationSurveyGroupService = applicationSurveyGroupService;
//        }

//        readonly Organization.ApiClient.Interface.IApplicationSurveyGroupService _applicationSurveyGroupService;

//        [HttpPost]
//        public async Task<JsonResult> Add(Organization.Core.Model.ApplicationSurveyGroup model)
//        {
//            var result = await _applicationSurveyGroupService.Add(model);
//            return Json(result);
//        }

//        [HttpPost]
//        public async Task<JsonResult> Edit(Organization.Core.Model.ApplicationSurveyGroup model)
//        {
//            var result = await _applicationSurveyGroupService.Edit(model);
//            return Json(result);
//        }

//        [HttpPost]
//        public async Task<JsonResult> Get(Guid id)
//        {
//            var result = await _applicationSurveyGroupService.Get(id);
//            return Json(result);
//        }

//        [HttpPost]
//        public async Task<JsonResult> List(Organization.Core.Model.ApplicationSurveyGroupListVM model)
//        {
//            var result = await _applicationSurveyGroupService.List(model);
//            return Json(result);
//        }

//        [HttpPost]
//        public async Task<JsonResult> ListGroupAndQuestion(Organization.Core.Model.ApplicationSurveyGroupListVM model)
//        {
//            var result = await _applicationSurveyGroupService.ListGroupAndQuestion(model);
//            return Json(result);
//        }

//        [HttpPost]
//        public async Task<JsonResult> ReportGroup(Organization.Core.Model.ApplicationSurveyGroupListVM model)
//        {
//            var result = await _applicationSurveyGroupService.ReportGroup(model);
//            return Json(result);
//        }

//        [HttpPost]
//        public async Task<JsonResult> Remove(Guid id)
//        {
//            var result = await _applicationSurveyGroupService.Delete(id);
//            return Json(result);
//        }
//    }
//}