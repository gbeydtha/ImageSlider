using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ImageSlider.Models
{
    public class GalleryImage
    {
        [Key]
        public int ImageId { get; set; }
        public string ImageUrl { get; set; }
        public string Caption { get; set; }
        public int GalleryId { get; set; }
        public string Description { get; set; }
        public string AlternateText { get; set; }
        public Gallery Gallery { get; set; }
    }
}
