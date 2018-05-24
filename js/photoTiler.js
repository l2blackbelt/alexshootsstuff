/*

photoTiler.js

    ABOUT: 
    Dynamically tiles photos of any size rather beautifully to the width of your screen. 

    USAGE:
    Currently set up to tile all img tags within a <section id=photos>, which is located within <body>
    It does require some css to work correctly.  
    1.  Bare minimum, need "body{font-size: 0px;}" to prevent unaccounted for space betwen images.  
    2.  Can add padding between photos with "img{padding: 5px;}"  Increasing this number to a large value will noticably distort images.
    3.  Can also add padding to the top, bottom, and sides of the photos section, this will handle it just fine.

    TODO:
    1.  It does "cheat" a couple pixels on the aspect ratio of photos get it pixel perfect.  This cheating may be able to be minimized further, but it's already not noticable.
    2.  Right now it needs to wait until all photos are loaded in html before it can start tiling to calculate accurate photo dimensions, and keep tiling order the same.
        This could be improved if we loaded photos sequentially in js, and tile them as they become available, or store photo dimensions in a file
        (If I do decide to store photo dimensions in a file, I can also store dates and make sure they are sorted by date.  Perhaps I can generate this yaml with jekyll)

Copyright (C) 2017  Alexander Smith

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.



*/



//tiled images js.  Requires jquery

$(window).resize(function(){
    sort_pics()
});

var pic_array = []

$(window).on("load", function(){
    create_pic_array()
    sort_pics()
});

function create_pic_array(){
    $('#photos img').each(function () {
        var pic = new picture($(this),$(this).width(),$(this).height())
        pic_array.push(pic)
    });

    function picture(src, width, height) {
        this.src = src;
        this.width = width;
        this.height = height;
        this.ratio = width/height;
    }
    //console.log(pic_array.length)

}


function sort_pics(){


    function line(window_width) { //line object represents a line of images on the screen
        this.maxheight = 600 //tiling lines will never be taller than this height.
        this.padding = parseInt($('img').css('padding-right'))*2 //fore some reason needs to be double the css padding value
        //console.log(this.padding)

        this.width = window_width
        this.imgs = []
        this.ratiosum = 0
        this.height = 999999
        this.add_img = function(img){
            this.imgs.push(img)
            this.ratiosum += img.ratio
            this.height = this.width / this.ratiosum
            this.maxheight = Math.min(img.height,this.maxheight)

        }
        this.am_i_properly_sized = function(){
            return (this.height < this.maxheight)
        }
        this.fit_line_to_window = function(){
            var scaled_image_width = 0 //find out what the image was actually scaled to.  To get pixel perfect edges we will need to fudge the width of a picture per line
            for(j = 0; j < this.imgs.length; j++){
                this.imgs[j].src.height(this.height)
                this.imgs[j].src.width(this.height*this.imgs[j].ratio - this.padding) //there's still more work I can do refactoring this code. why need to store copies of all the picture structure in the new array?
                scaled_image_width += this.imgs[j].src.width()
                //console.log("image with width="+this.imgs[j].src.width())
            }
            //this.imgs[0].src.width(this.imgs[0].src.width()-(scaled_image_width-this.width)) //fudging the scaling of one image per line to get pixel perfect right edge.
        }
        this.scale_line_height_to_value = function(val){
            for(j = 0; j < this.imgs.length; j++){
                this.imgs[j].src.height(val)
                this.imgs[j].src.width(this.imgs[j].src.height()*this.imgs[j].ratio - this.padding) //there's still more work I can do refactoring this code. why need to store copies of all the picture structure in the new array?
            }
        }
    }


    //master variables
    var window_width = $("#photos").width() //note: 16 appears to be the default margin size  Just on Chrome?

    //console.log("window.  width="+window_width)

    var cur_line = new line(window_width) //create first line
    for(i = 0; i < pic_array.length; i++){
        cur_line.add_img(pic_array[i])

        if(cur_line.am_i_properly_sized()){ //calculated height of window less than maximum
            cur_line.fit_line_to_window()
            var cur_line = new line(window_width) //start next line
        }
        
    }
    cur_line.scale_line_height_to_value(cur_line.maxheight*.8) //fit any straggling lines that aren't fit to the window

}