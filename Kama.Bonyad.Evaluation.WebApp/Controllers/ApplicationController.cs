using System;
using System.Threading.Tasks;
using System.Web.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace Kama.Bonyad.Evaluation.WebApp.Controllers
{
    public class ApplicationController : BaseController
    {
        public ApplicationController(Organization.ApiClient.Interface.IApplicationService applicationService)
        {
            _applicationService = applicationService;
        }

        readonly Organization.ApiClient.Interface.IApplicationService _applicationService;

        [HttpPost]
        public async Task<JsonResult> Get(Guid ID)
        {
            var result = await _applicationService.Get(ID);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> Add(Organization.Core.Model.Application model)
        {
            var result = await _applicationService.Add(model);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> Edit(Organization.Core.Model.Application model)
        {
            var result = await _applicationService.Edit(model);
            return Json(result);
        }


        [HttpPost]
        public async Task<JsonResult> List(Organization.Core.Model.ApplicationListVM model)
        {
            var result = await _applicationService.List(model);
            return Json(result);
        }
    }
}