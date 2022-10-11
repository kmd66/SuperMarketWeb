//using Kama.Bonyad.Evaluation.WebApp.Tools;
//using System;
//using System.Threading.Tasks;
//using System.Web.Mvc;

//namespace Kama.Bonyad.Evaluation.WebApp.Controllers
//{
//    public class ApplicationSurveyQuestionController : BaseController
//    {
//        public ApplicationSurveyQuestionController(Organization.ApiClient.Interface.IApplicationSurveyQuestionService applicationSurveyQuestionService)
//        {
//            _applicationSurveyQuestionService = applicationSurveyQuestionService;
//        }

//        readonly Organization.ApiClient.Interface.IApplicationSurveyQuestionService _applicationSurveyQuestionService;

//        [HttpPost]
//        public async Task<JsonResult> Add(Organization.Core.Model.ApplicationSurveyQuestion model)
//        {
//            var result = await _applicationSurveyQuestionService.Add(model);
//            return Json(result);
//        }

//        [HttpPost]
//        public async Task<JsonResult> Edit(Organization.Core.Model.ApplicationSurveyQuestion model)
//        {
//            var result = await _applicationSurveyQuestionService.Edit(model);
//            return Json(result);
//        }

//        [HttpPost]
//        public async Task<JsonResult> Get(Guid id)
//        {
//            var result = await _applicationSurveyQuestionService.Get(id);
//            return Json(result);
//        }

//        [HttpPost]
//        public async Task<JsonResult> List(Organization.Core.Model.ApplicationSurveyQuestionListVM model)
//        //{
//            var result = await _applicationSurveyQuestionService.List(model);
//            return Json(result);
//        }

//        [HttpPost]
//        public async Task<JsonResult> ListQuestionAndChoice(Organization.Core.Model.ApplicationSurveyQuestionListVM model)
//        {
//            var result = await _applicationSurveyQuestionService.ListQuestionAndChoice(model);
//            return Json(result);
//        }

//        [HttpPost]
//        public async Task<JsonResult> ReportQuestion(Organization.Core.Model.ApplicationSurveyQuestionListVM model)
//        {
//            var result = await _applicationSurveyQuestionService.ReportQuestion(model);
//            return Json(result);
//        }

//        [HttpPost]
//        public async Task<JsonResult> Remove(Guid id)
//        {
//            var result = await _applicationSurveyQuestionService.Delete(id);
//            return Json(result);
//        }
//    }
//}