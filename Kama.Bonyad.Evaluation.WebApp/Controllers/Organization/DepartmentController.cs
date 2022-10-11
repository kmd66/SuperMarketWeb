using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Kama.Bonyad.Evaluation.WebApp.Controllers
{
    public class DepartmentController : BaseController
    {
        public DepartmentController(Organization.ApiClient.Interface.IDepartmentService departmentService)
        {
            _departmentService = departmentService;
        }

        readonly Organization.ApiClient.Interface.IDepartmentService _departmentService;

        [HttpPost]
        [Authorize]
        public async Task<JsonResult> Add(Organization.Core.Model.Department model)
        {
            var result = await _departmentService.Add(model);
            return Json(result);
        }

        [HttpPost]
        [Authorize]
        public async Task<JsonResult> Edit(Organization.Core.Model.Department model)
        {
            var result = await _departmentService.Edit(model);
            return Json(result);
        }

        [HttpPost]
        [Authorize]
        public async Task<JsonResult> Delete(Guid Id)
        {
            var result = await _departmentService.Delete(Id);
            return Json(result);
        }

        [HttpPost]
        [Authorize]
        public async Task<JsonResult> List(Organization.Core.Model.DepartmentListVM model)
        {
            var result = await _departmentService.List(model);
            return Json(result);
        }

        [HttpPost]
        [Authorize]
        public async Task<JsonResult> Get(Guid Id)
        {
            var result = await _departmentService.Get(Id);
            return Json(result);
        }
    }
}