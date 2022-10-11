using Kama.AppCore;
using Kama.Bonyad.Evaluation.ApiClient.Interface;
using Kama.Bonyad.Evaluation.Core.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Kama.Bonyad.Evaluation.WebApp.Controllers
{
    public class TagController : BaseController
    {
        public TagController(ITagService service)
        {
            _service = service;
        }

        readonly ITagService _service;

        [HttpPost]
        public async Task<JsonResult> Save(Tag model)
        {
            var result = await _service.Add(model);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> Delete(Tag model)
        {
            var result = await _service.Delete(model);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> List(TagVM model)
        {
            var result = await _service.List(model);
            return Json(result);
        }

    }
}