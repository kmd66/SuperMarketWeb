//using System;
//using System.Threading.Tasks;
//using System.Web.Mvc;

//namespace Kama.Bonyad.Evaluation.WebApp.Controllers
//{
//    public class PositionHistoryController : BaseController
//    {
//        public PositionHistoryController(Organization.ApiClient.Interface.IPositionHistoryService positionHistoryService)
//        {
//            _positionHistoryService = positionHistoryService;
//        }

//        readonly Organization.ApiClient.Interface.IPositionHistoryService _positionHistoryService;


//        [HttpPost]
//        public async Task<JsonResult> Add(Organization.Core.Model.PositionHistory model)
//        {
//            var result = await _positionHistoryService.Add(model);
//            return Json(result);
//        }

//        [HttpPost]
//        public async Task<JsonResult> Edit(Organization.Core.Model.PositionHistory model)
//        {
//            var result = await _positionHistoryService.Edit(model);
//            return Json(result);
//        }

//        [HttpPost]
//        public async Task<JsonResult> List(Organization.Core.Model.PositionHistoryListVM model)
//        {
//            var result = await _positionHistoryService.List(model);
//            return Json(result);
//        }

//        [HttpPost]
//        public async Task<JsonResult> Get(Guid id)
//        {
//            var result = await _positionHistoryService.Get(id);
//            return Json(result);
//        }

//        [HttpPost]
//        public async Task<JsonResult> Remove(Guid id)
//        {
//            var result = await _positionHistoryService.Delete(id);
//            return Json(result);
//        }


//    }
//}