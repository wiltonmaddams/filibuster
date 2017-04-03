jx.define('jx.controllers.index', {
  require: ['jx.ajax'],  
  init: function() {
    this.on({
      "window": {
        "scroll": this.onLogScroll,
        "resize": this.onWindowResize
      },
      "#js_menu": {
        "click": this.onToggleMenu
      }
    });
    this.videoDesired = true // THIS BECOMES SOME SERVER VARIABLE
    this.navAnimating = false;
    this.SCREEN_SIZE_DESKTOP = 800;
    this.SCREEN_SIZE_DESKTOP_BIG = 1200;
    this.SCREEN_SIZE_MOBILE = 800
  },
  onLogScroll: function(element, e) {
    e.preventDefault();
    var offsetY = window.pageYOffset;
    var pageYStart = $(".about").position().top;
    var pageYEnd = $(".event_overview").position().top;
    var height = $(window).height();
    var bottomSpacer = 20; // Set by CSS
    
    // Change bottom link colors to black
    if ((offsetY + (height - bottomSpacer) >= pageYStart) 
      && ((offsetY + (height - bottomSpacer)) <= pageYEnd)) {
      $("li.nav-link > a").css("color", "black");
    } else {
      $("li.nav-link > a").css("color", "white");  
    }

    // Change hamburger nav and home image
    if ((offsetY + bottomSpacer + 12) >= pageYStart
      && ((offsetY + bottomSpacer + 12) <= pageYEnd)) { // 25 is image height, change it halfway
      $("#home-icon").css("background-image", "url(../../assets/f_full_horizontal_black.png)");
      $("#hamburger-nav span").css("border", "1px solid black"); 
    } else {
      $("#home-icon").css("background-image", "url(../../assets/f_full_horizontal_white.png)");
      $("#hamburger-nav span").css("border", "1px solid white");  
    }
    
    // If wanting to use custom logic based on pageY position, put code here
  },
  onReady: function(element, e) {
    // Load the proper images for the viewport
    this.onSetBackgroundImages();
  },
  onToggleMenu: function(element, e) {
    $("body").toggleClass("menu_closed");
    $("body").toggleClass("menu_open");
  },
  onSetBackgroundImages: function() {
    var width = $(window).width();
    var index;
    var desiredSize; 

    if (width < this.SCREEN_SIZE_MOBILE) {
    console.log('mobile')
      desiredSize = this.SCREEN_SIZE_MOBILE
    } else if (width >= this.SCREEN_SIZE_DESKTOP_BIG) {
    console.log('big desktop')
      desiredSize = this.SCREEN_SIZE_DESKTOP_BIG
    } else if (width >= this.SCREEN_SIZE_DESKTOP) {
    console.log('desktop')
      desiredSize = this.SCREEN_SIZE_DESKTOP
    }

    $(".bg-image").each(function(index, element) {
      var imageExtensions = $(element).attr("data-img-extensions");
      if (imageExtensions) { // Could be undefined
        imageExtensions = JSON.parse(imageExtensions);

        switch (desiredSize) {
          case this.SCREEN_SIZE_MOBILE:
            index = imageExtensions.length - 1;
            break;
          case this.SCREEN_SIZE_DESKTOP:
            var median = imageExtensions.length % 2; // Use modulo
            index = imageExtensions[median];
            break;
          case this.SCREEN_SIZE_DESKTOP_BIG:
            index = imageExtensions[0];
            break;
          default:
            index = imageExtensions.length - 1;
        }
        var photoName = imageExtensions[index]; // Always taking the last element for mobile
        var backgroundImage = $(this).css('background-image');
        console.log(index)
        var backgroundImageURL = backgroundImage.replace('url(','').replace(')','');
        var backgroundImageURLComponents = backgroundImageURL.split("/")
        var fileName = backgroundImageURLComponents[backgroundImageURLComponents.length - 1];
        var extension = fileName.split(".")[1].replace('"', "");
//        console.log(fileName)
        var backgroundURL = "./assets/" + $(element).attr("data-img-src") + "_" + photoName + "." + extension;
        $(element).attr("style", "background-image:url(" + backgroundURL + ")");
      }
    });
  },
  onWindowResize: function(element, e) {
    this.onSetBackgroundImages();
  }
});