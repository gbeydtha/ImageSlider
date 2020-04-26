using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ImageSlider.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class FeaturedSliderController : Controller
    {
        public IActionResult Index()
        {
            return View(); 
        }
    }
}
