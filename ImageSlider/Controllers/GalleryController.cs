using ImageSlider.Data;
using ImageSlider.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ImageSlider.Controllers
{
    [Route("api/[controller]")]
    public class GalleryController : Controller
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IHostingEnvironment _environment; 
        public GalleryController(ApplicationDbContext dbContext, IHostingEnvironment environment)
        {
            _dbContext = dbContext;
            _environment = environment; 
        }

        //get list of  galleries
        [HttpGet("[action]")]
        public IActionResult GetImageGallery()
        {
            var result = _dbContext.Galleries.ToList();
            return Ok(result.Select( g => new { g.GalleryId, g.Title, g.TimeCreated, g.LastUpdated, g.IsActive, g.IsFeatured, g.GalleryType, g.Username})); 
        }
         

        // get the featured galleries
        [HttpGet("[action]/galleryType")]
        public IActionResult GetFeaturedImageGallery([FromRoute] string galleryType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); 
            }

            var result = from g in _dbContext.Galleries.Where(g=> g.IsFeatured== true && g.IsActive==true && g.GalleryType == galleryType)
                         join i in _dbContext.GalleryImages on  g.GalleryId equals i.GalleryId
                         select new
                         {
                             Gallery_Id = g.GalleryId,
                             Gallery_Title = g.Title,
                             Gallery_Path = g.GalleryUrl,
                             Gallery_Username = g.Username,
                             Gallery_Type = g.GalleryType,
                             Image_Id = i.ImageId,
                             Image_Path = i.ImageUrl,
                             Image_Caption = i.Caption,
                             Image_Description = i.Description,
                             Image_AltText = i.AlternateText

                         };

            return Ok(result); 
        }

        //Get Gallery by Id
        [HttpGet("[action]/{Id}")]
        public IActionResult GetImageGalleryById([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = from g in _dbContext.Galleries
                         join i in _dbContext.GalleryImages.Where(t => t.GalleryId == id)
                         on g.GalleryId equals i.GalleryId
                         select new
                         {
                             Gallery_Id = g.GalleryId,
                             Gallery_Title =g.Title,
                             Gallery_Path = g.GalleryUrl,
                             Image_Id = i.ImageId,
                             Image_Path = i.ImageUrl,
                             Image_Caption = i.Caption,
                             Image_Description = i.Description,
                             Image_AltText = i.AlternateText
                         };
            if(result == null)
            {
                return NotFound(); 
            }

            return Ok(result); 
        }

        //Add a new Galler
        [HttpPost("[action]")]
        public async Task<IActionResult> CreateNewGallery(Gallery gallery, IFormCollection formData)
        {
            int i = 0;
            string GalleryTitle = formData["GalleryTitle"];
            string GalleryType = formData["GalleryType"];
            string Username = "Administrator";
            DateTime LastUpadteTime = DateTime.Now;

            // First we will craete a new Galllery and id from it
            int id = await CreateGalleryId(gallery);

            //Create The Gallery Path
            string GalleryPath = Path.Combine(_environment.WebRootPath + $"{Path.DirectorySeparatorChar}uploads{Path.DirectorySeparatorChar}Gallery{Path.DirectorySeparatorChar}", id.ToString());

            // Path of Gallery to store in Db. No neeed full Path (Without root path)
            string dbImageGalleryPath = Path.Combine($"{Path.DirectorySeparatorChar}uploads{Path.DirectorySeparatorChar}Gallery{Path.DirectorySeparatorChar}", id.ToString()); 

            //Create The Directory/Folder ion the Sercer to store New Gallery Image
            CreateDirectory(GalleryPath); 
            
            // get all uploaded  Files and files details

            foreach(var file in formData.Files)
            {
                if(file.Length > 0)
                {
                    var extension = Path.GetExtension(file.FileName);
                    //  time to add in  FileName
                    var fileName = DateTime.Now.ToString("yymmssfff");

                    //Create  the File Path 
                    var path = Path.Combine(GalleryPath, fileName) + extension;

                    // Path of Image that will be stored in database - No need to add the full path
                    var dbImagePath = Path.Combine(dbImageGalleryPath+ $"{Path.DirectorySeparatorChar}", fileName) + extension;

                    string ImageCaption = formData["ImageCaption[]"][i];
                    string ImageDescription = formData["ImageDescription[]"][i];
                    string AlternateText = formData["ImageAlt[]"][i];

                    GalleryImage gImage = new GalleryImage();
                    gImage.ImageId = id;
                    gImage.ImageUrl = dbImagePath;
                    gImage.Description = ImageDescription;
                    gImage.AlternateText = AlternateText;
                    gImage.Caption = ImageCaption;
                   
                    // Add images details o Images Table
                   await  _dbContext.GalleryImages.AddAsync(gImage);

                    //Copy the uploaded images to server - Uploads folder
                    //Using - Once file is copied then we will close the stream
                    using (var stream = new FileStream(path, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    i = i + 1; 
                }
            }

            gallery.LastUpdated = LastUpadteTime;
            gallery.Title = GalleryTitle;
            gallery.GalleryType = GalleryType;
            gallery.Username = Username;
            gallery.GalleryUrl = dbImageGalleryPath;
            _dbContext.Galleries.Update(gallery);

            await _dbContext.SaveChangesAsync();

             return Ok(new JsonResult("Successfully Added : " + GalleryTitle));
            
        }

        // Create  the new Gallery
        private async Task<int> CreateGalleryId(Gallery gallery)
        {
            DateTime CreatedTime = DateTime.Now;
            gallery.TimeCreated = CreatedTime;
            _dbContext.Galleries.Add(gallery);
            await _dbContext.SaveChangesAsync();
            await _dbContext.Entry(gallery).GetDatabaseValuesAsync();
            int Id = gallery.GalleryId;
            return Id;
        }

        //Create the Directory Path if it does not exist.

        public void CreateDirectory(string galleryPath)
        {
            if (!Directory.Exists(galleryPath))
            {
                Directory.CreateDirectory(galleryPath);
            }
        }

        // Delete Gallery
        [HttpDelete("[action]/{id}")]
        public async Task<IActionResult> DeleteGallery([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); 
            }

            var findGallery = await _dbContext.Galleries.FindAsync(id);
            if(findGallery == null)
            {
                return NotFound();
            }
            _dbContext.Galleries.Remove(findGallery);

            // Delete the folder Name  from Server
            DeleteGaleleryDirectory(id);

            await _dbContext.SaveChangesAsync();

            return new JsonResult("Gallery deleted Added : " + id);
        }

        private void  DeleteGaleleryDirectory(int id)
        {
            // Path of th Gallery Folder
            string GalleryPath = Path.Combine(_environment.WebRootPath + $"{Path.DirectorySeparatorChar}uploads{Path.DirectorySeparatorChar}Gallery{Path.DirectorySeparatorChar}", id.ToString());

            string[] files = Directory.GetFiles(GalleryPath);

            //Check if the GalleryFolder Exist
            if (Directory.Exists(GalleryPath))
            {
                foreach(var file in files)
                {
                    System.IO.File.SetAttributes(file, FileAttributes.Normal);
                    System.IO.File.Delete(file); 
                }

                // Delete the Gallery folder
                Directory.Delete(GalleryPath); 
            }
        }

        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateGallery([FromRoute] int id, IFormCollection formData)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); 
            }
            //Counter 
            int i = 0;
            int j = 0;

            // Hold the New Gallery Tittle
            string Title = formData["GalleryTitleEdit"];
            // Get the Gallery Detail
            var oGallery = await _dbContext.Galleries.FirstOrDefaultAsync(g => g.GalleryId == id);
            //Path of the Gallery
            var GalleryPath = Path.Combine(_environment.WebRootPath + oGallery.GalleryUrl);
            
            //If any file to Update
            if(formData.Files.Count > 0)
            {
                // Empty arry to store old File info 
                string[] filesToDeletePath = new string[formData.Files.Count]; 

                foreach(var file in formData.Files)
                {
                    if(file.Length > 0)
                    {
                        var extension = Path.GetExtension(file.FileName);
                        //  time to add in  FileName
                        var fileName = DateTime.Now.ToString("yymmssfff");

                        //Create  the File Path 
                        var path = Path.Combine(GalleryPath, fileName) + extension;
                        var dbImagePath = Path.Combine(oGallery.GalleryUrl + $"{Path.DirectorySeparatorChar}", fileName) + extension;
                        string ImageId = formData["imageId[]"][i];
                        // get the image info to update
                        var updateImage = _dbContext.GalleryImages.FirstOrDefault(o => o.ImageId == Convert.ToInt32(ImageId));

                        // First we will store path of each old file to delete in an empty array.
                        filesToDeletePath[i] = Path.Combine(_environment.WebRootPath + updateImage.ImageUrl);
                        updateImage.ImageUrl = dbImagePath;

                        //Copiing New files to the Server -Gallery Folder
                        using (var stream = new FileStream(path, FileMode.Create))
                        {
                            await file.CopyToAsync(stream); 
                        }

                        // Update and Save Changes to DB
                        using (var dbContextTransaction = _dbContext.Database.BeginTransaction())
                        {
                            try
                            {
                                _dbContext.Entry(updateImage).State = EntityState.Modified;
                                await _dbContext.SaveChangesAsync();

                                dbContextTransaction.Commit();
                            }
                            catch (Exception)
                            {
                                dbContextTransaction.Rollback(); 
                            }
                        }

                        i = i + 1;
                    }                    
                }
                //Deelte all the old file
                foreach(var item in filesToDeletePath)
                {
                    //if Image file Exist - Delete the file inside the Gallery folder first 
                    if(System.IO.File.Exists(item))
                    {
                        System.IO.File.SetAttributes(item, FileAttributes.Normal);
                        System.IO.File.Delete(item);
                    }
                }
            }

            // Contidion Validate and Update Gallery Title and image Caption
            if (formData["imageCaption[]"].Count > 0)
            {
                oGallery.Title = Title;
                _dbContext.Entry(oGallery).State = EntityState.Modified;

                foreach (var imgcap in formData["imageCaption[]"])
                {
                    string ImageIdCap = formData["imageId[]"][j];
                    string Caption = formData["imageCaption[]"][j];
                    string Description = formData["description[]"][j];
                    string AltText = formData["altText[]"][j];
                    var updateImageDetails = _dbContext.GalleryImages.FirstOrDefault(o => o.ImageId == Convert.ToInt32(ImageIdCap));
                    updateImageDetails.Caption = Caption;
                    updateImageDetails.Description = Description;
                    updateImageDetails.AlternateText = AltText;
                    using (var dbContextTransaction = _dbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            _dbContext.Entry(updateImageDetails).State = EntityState.Modified;
                            await _dbContext.SaveChangesAsync();
                            dbContextTransaction.Commit();
                        }
                        catch (Exception)
                        {
                            dbContextTransaction.Rollback();
                        }
                    }

                    j = j + 1;
                }
            }


            return Ok(new JsonResult("Updateed Successfully")); 
        }

        [HttpPut("[action]/{id}")]
        public async Task<IActionResult> UpdateGalleryById([FromRoute]int id, IFormCollection formData)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Will Hold the New Gallery Title
            string Title = formData["GalleryTitleEditById"];

            // Get the info of the Gallery that needs to be updated
            var updateGallery = await _dbContext.Galleries.FirstOrDefaultAsync(o => o.GalleryId == id);

            // Will Hold the Is Active value
            if (formData["isActive"] == "on")
            {
                updateGallery.IsActive = true;
            }
            else
            {
                updateGallery.IsActive = false;
            }
            // Will Hold the Is Featured value
            if (formData["isfeatured"] == "on")
            {
                updateGallery.IsFeatured = true;
            }
            else
            {
                updateGallery.IsFeatured = false;
            }

            // update the time stamps
            updateGallery.LastUpdated = DateTime.Now;
            updateGallery.Title = Title;
            // Update and Save Changes to the Database
            using (var dbContextTransaction = _dbContext.Database.BeginTransaction())
            {
                try

                {
                    _dbContext.Entry(updateGallery).State = EntityState.Modified;
                    await _dbContext.SaveChangesAsync();

                    dbContextTransaction.Commit();
                }
                catch (Exception)
                {
                    dbContextTransaction.Rollback();
                }
            }


            return new JsonResult("Updated Successfully : " + Title);


        }
    }
}

