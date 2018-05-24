module jekyll
	class Generator < Jekyll::Generator
		def generate(site)







#get file mtime File.mtime("testfile")
#=> 2014-04-13 16:00:23 -0300





#needs to create a json file that JS can later parse.  The elements should be already ordered in the json from newest to oldest, so the client side code doesn't have to do this.

#1. create json file with name, path, modification date, height, width
#2. jekyll refences the modification date when it builds the html, orders the images by this.
#3. JS references the height and width to build the imaigne tiling.  Even before the photos are fully loaded!


#  {
#     "DSC001.jpg": {
#         path:"/img/fed/DSC001.jpg",
#         age:"123421412321324,
#         height:"1200",
#         width:"1800",
#     }
#  }

#{{%for image in site.data.JSONFILENAME%}}
#create list of data scructures and filter by image.age