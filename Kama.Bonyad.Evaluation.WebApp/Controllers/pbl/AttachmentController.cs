using Kama.Bonyad.Evaluation.ApiClient.Interface;
using Kama.Bonyad.Evaluation.Core.Model;
using Kama.Bonyad.Evaluation.WebApp.Tools;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using System.Web.Mvc;
using WebConfig = System.Web.Configuration.WebConfigurationManager;

namespace Kama.Bonyad.Evaluation.WebApp.Controllers
{
    public class AttachmentController : BaseController
    {
        public AttachmentController(ApiClient.Interface.IAttachmentService attachmentService)
        {
            _attachmentService = attachmentService;
        }

        readonly ApiClient.Interface.IAttachmentService _attachmentService;

        [HttpPost]
        public ActionResult Upload()
        {
            string fileName = string.Empty;
            string filePath = string.Empty;
            var guid = Guid.NewGuid();
            var url = "/TemporaryFiles/";

            try
            {
                if (Request.Files.Count > 0)
                {
                    if (!Request.Files[0].IsValidFile(Request))
                        return Json(AppCore.Result<Attachment>.Failure(message: "مجاز به آپلود این نوع فایل نیستید"));

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
                        if (Request.Files[0].ContentLength > int.Parse(WebConfig.AppSettings["PrivateAttachmentSize"]))
                            return Json(AppCore.Result<Attachment>.Failure(message: "حجم فایل بزرگتر از حد مجاز است"));
                    }
                    else
                    {
                        if (Request.Files[0].ContentLength > int.Parse(WebConfig.AppSettings["PublicAttachmentSize"]))
                            return Json(AppCore.Result<Attachment>.Failure(message: "حجم فایل بزرگتر از حد مجاز است"));
                    }

                    fileName = guid.ToString() + Path.GetExtension(fileName);

                    url += fileName;
                    // Set Path  
                    filePath = Path.Combine(Server.MapPath(url));
                    // Save the file
                    Request.Files[0].SaveAs(filePath);

                }
                ;
                return Json(AppCore.Result<Attachment>.Successful(data: new Attachment { FileName = fileName, GuID = guid,Url = url }));

            }
            catch (Exception e)
            {
                return Json(AppCore.Result<Attachment>.Failure(message: e.Message));
            }
        }

        [HttpPost]
        public async Task<JsonResult> Save(Attachment model)
        {
            var filePath = Path.Combine(Server.MapPath(model.Url));
            if (!System.IO.File.Exists(filePath))
                return Json(AppCore.Result<Attachment>.Failure(message: "فایل یافت نشد"));

            if(model.Type == AttachmentType.Unknown)
                return Json(AppCore.Result<Attachment>.Failure(message: ":/"));


            var url = $"/files/img/{(short)model.Type}/{model.FileName}";
            var newFilePath = Path.Combine(Server.MapPath(url));

            System.IO.File.Copy(filePath, newFilePath);

            System.IO.File.Delete(filePath);

            model.Url = url;
            var result = await _attachmentService.Add(model);
            //else
            //    result = await _attachmentService.Edit(model);

            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> SaveList(List<Attachment> model)
        {
            foreach (var m in model)
               await Save(m);
            return Json(AppCore.Result.Successful());
        }

        [HttpPost]
        public async Task<JsonResult> Remove(Attachment model)
        {
            var filePath = Path.Combine(Server.MapPath(model.Url));

            if (!System.IO.File.Exists(filePath))
                return Json(AppCore.Result<Attachment>.Failure(message: "فایل یافت نشد"));
            System.IO.File.Delete(filePath);

            var result = await _attachmentService.Delete(model);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> Get(Attachment model)
        {
            FileConverter converter = new FileConverter();

            var result = await _attachmentService.Get(model);

            //if (result.Success)
            //{
            //    result.Data.FileName = converter.ToFile(result.Data.Data, result.Data.FileName);
            //    result.Data.Data = null;
            //}

            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> List(AttachmentListVM model)
        {
            var result = await _attachmentService.List(model);
            return Json(result);
        }
    }
}