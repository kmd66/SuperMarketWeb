using Kama.Bonyad.Evaluation.WebApp.Tools;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;

namespace Kama.Bonyad.Evaluation.WebApp.Controllers
{
    public class OrganizationAttachmentController : BaseController
    {
        public OrganizationAttachmentController(Organization.ApiClient.Interface.IAttachmentService AttachmentService)
        {
            _AttachmentService = AttachmentService;
        }

        readonly Organization.ApiClient.Interface.IAttachmentService _AttachmentService;

        [HttpPost]
        public ActionResult Upload()
        {
            string fileName = string.Empty;
            string filePath = string.Empty;

            try
            {
                if (Request.Files.Count > 0)
                {
                    if (!Request.Files[0].IsValidFile(Request))
                        return Json("مجاز به آپلود این نوع فایل نیستید");

                    // Checking for Internet Explorer  
                    if (Request.Browser.Browser.ToUpper() == "IE" || Request.Browser.Browser.ToUpper() == "INTERNETEXPLORER")
                    {
                        string[] testfiles = Request.Files[0].FileName.Split(new char[] { '\\' });
                        fileName = testfiles[testfiles.Length - 1];
                    }
                    else
                        fileName = Request.Files[0].FileName;

                    if (Request.Params.Get("userType") == "1")
                    {
                        if (Request.Files[0].ContentLength > int.Parse(WebConfigurationManager.AppSettings["PrivateAttachmentSize"]))
                            return Json("حجم فایل بزرگتر از حد مجاز است");
                    }
                    else
                    {
                        if (Request.Files[0].ContentLength > int.Parse(WebConfigurationManager.AppSettings["PublicAttachmentSize"]))
                            return Json("حجم فایل بزرگتر از حد مجاز است");
                    }

                    // Change file name to guid
                    string extension = Path.GetExtension(fileName);
                    fileName = Guid.NewGuid().ToString() + extension;

                    // Set Path  
                    filePath = Path.Combine(Server.MapPath("~/TemporaryFiles/"), fileName);

                    // Save the file
                    Request.Files[0].SaveAs(filePath);
                }

                return Json(new { Success = true, Data = new { FileName = fileName } });
            }
            catch (Exception e)
            {
                return Json(new { Success = false, Data = new { } });
            }
        }

        [HttpPost]
        public async Task<JsonResult> Save(Organization.Core.Model.Attachment model, string fileName)
        {
            AppCore.Result<Organization.Core.Model.Attachment> result;
            FileConverter converter = new FileConverter();
            model.Data = converter.ToByteArray(fileName);

            if (model.ID == Guid.Empty)
                result = await _AttachmentService.Add(model);
            else
                result = await _AttachmentService.Edit(model);

            result.Data = null;
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> Remove(Organization.Core.Model.Attachment model)
        {
            var result = await _AttachmentService.Delete(model);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> Get(Guid id)
        {
            FileConverter converter = new FileConverter();

            var result = await _AttachmentService.Get(id, null);

            result.Data.FileName = converter.ToFile(result.Data.Data, result.Data.FileName);
            result.Data.Data = null;

            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> List(Guid parentId)
        {
            var result = await _AttachmentService.List(parentId);
            return Json(result);
        }
    }
}