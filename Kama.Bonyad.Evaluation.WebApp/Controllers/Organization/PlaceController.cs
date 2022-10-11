using System;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Kama.Bonyad.Evaluation.WebApp.Controllers
{
    public class PlaceController : BaseController
    {
        public PlaceController(Organization.ApiClient.Interface.IPlaceService service)
        {
            _service = service;
        }

        readonly Organization.ApiClient.Interface.IPlaceService _service;

        [HttpPost]
        [Authorize]
        //[CustomAntiforgery]
        public async Task<JsonResult> List(Organization.Core.Model.PlaceListVM model)
        {
            var result = await _service.List(model);
            return Json(result);
        }

        [HttpPost]
        [Authorize]
        public async Task<JsonResult> Get(Guid Id)
        {
            var result = await _service.Get(Id);
            return Json(result);
        }
    }
}