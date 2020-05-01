﻿// <auto-generated />
using System;
using ImageSlider.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace ImageSlider.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20200430133218_add_ImageTitle")]
    partial class add_ImageTitle
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.1.14-servicing-32113")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("ImageSlider.Models.Gallery", b =>
                {
                    b.Property<int>("GalleryId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("GalleryType");

                    b.Property<string>("GalleryUrl");

                    b.Property<bool>("IsActive");

                    b.Property<bool>("IsFeatured");

                    b.Property<DateTime>("LastUpdated");

                    b.Property<DateTime>("TimeCreated");

                    b.Property<string>("Title");

                    b.Property<string>("UserId");

                    b.Property<string>("Username");

                    b.HasKey("GalleryId");

                    b.ToTable("Galleries");
                });

            modelBuilder.Entity("ImageSlider.Models.GalleryImage", b =>
                {
                    b.Property<int>("ImageId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("AlternateText");

                    b.Property<string>("Caption");

                    b.Property<string>("Description");

                    b.Property<int>("GalleryId");

                    b.Property<string>("ImageTitle");

                    b.Property<string>("ImageUrl");

                    b.HasKey("ImageId");

                    b.HasIndex("GalleryId");

                    b.ToTable("GalleryImages");
                });

            modelBuilder.Entity("ImageSlider.Models.GalleryImage", b =>
                {
                    b.HasOne("ImageSlider.Models.Gallery", "Gallery")
                        .WithMany()
                        .HasForeignKey("GalleryId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
