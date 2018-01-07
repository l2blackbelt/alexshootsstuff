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
		this.maxheight = 600
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