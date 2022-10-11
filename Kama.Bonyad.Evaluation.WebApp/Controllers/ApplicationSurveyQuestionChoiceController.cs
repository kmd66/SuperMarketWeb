//using Kama.Bonyad.Evaluation.WebApp.Tools;
//using System;
//using System.Threading.Tasks;
//using System.Web.Mvc;

//namespace Kama.Bonyad.Evaluation.WebApp.Controllers
//{
//    public class ApplicationSurveyQuestionChoiceController : BaseController
//    {
//        public ApplicationSurveyQuestionChoiceController(Organization.ApiClient.Interface.IApplicationSurveyQuestionChoiceService applicationSurveyQuestionChoiceService)
//        {
//            _applicationSurveyQuestionChoiceService = applicationSurveyQuestionChoiceService;
//        }

//        readonly Organization.ApiClient.Interface.IApplicationSurveyQuestionChoiceService _applicationSurveyQuestionChoiceService;

//        [HttpPost]
//        [Authorize]
//        public async Task<JsonResult> Add(Organization.Core.Model.ApplicationSurveyQuestionChoice model)
//        {
//            var result = await _applicationSurveyQuestionChoiceService.Add(model);
//            return Json(result);
//        }

//        [HttpPost]
//        [Authorize]
//        public async Task<JsonResult> Edit(Organization.Core.Model.ApplicationSurveyQuestionChoice model)
//        {
//            var result = await _applicationSurveyQuestionChoiceService.Edit(model);
//            return Json(result);
//        }

//        [HttpPost]
//        public async Task<JsonResult> Get(Guid id)
//        {
//            var result = await _applicationSurveyQuestionChoiceService.Get(id);
//            return Json(result);
//        }

//        [HttpPost]
//        [Authorize]
//        public async Task<JsonResult> List(Organization.Core.Model.ApplicationSurveyQuestionChoiceListVM model)
//        {
//            var result = await _applicationSurveyQuestionChoiceService.List(model);
//            return Json(result);
//        }

//        [HttpPost]
//        [Authorize]
//        public async Task<JsonResult> Remove(Guid id)
//        {
//            var result = await _applicationSurveyQuestionChoiceService.Delete(id);
//            return Json(result);
//        }
//    }
//}