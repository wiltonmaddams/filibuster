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
    this.SCREEN_SIZE_MOBILE = 799
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
      $("#hamburger-nav span").css("border", "1px solid #333");
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
    var that = this;
    var width = $(window).width();
    var index;

    if (width <= this.SCREEN_SIZE_MOBILE) {
      this.desiredSize = this.SCREEN_SIZE_MOBILE
    } else if (width >= this.SCREEN_SIZE_DESKTOP_BIG) {
      this.desiredSize = this.SCREEN_SIZE_DESKTOP_BIG
    } else if (width >= this.SCREEN_SIZE_DESKTOP) {
      this.desiredSize = this.SCREEN_SIZE_DESKTOP
    }

    $(".bg-image").each(function(index, element) {
      var photoName;

      switch (that.desiredSize) {
        case that.SCREEN_SIZE_MOBILE:
          photoName = "vertical";
          break;
        case that.SCREEN_SIZE_DESKTOP:
          photoName = "horizontal_small";
          break;
        case that.SCREEN_SIZE_DESKTOP_BIG:
          photoName = "horizontal_large";
          break;
        default:
          photoName = "vertical";
      }

      // EXCEPTIONS //////////



      // Three sections have "fx" images
      switch ($(element).attr("class")) {
         case "section events_past bg-image":
         case "section signup bg-image":
         case "section intro bg-image":
            photoName += "_fx";
            break;
          default:
            break;
      }

      // Past events have only one size
      if ($(element).hasClass("past-event_item")) {
        photoName = "vertical";
      }

      // END EXCEPTIONS //////

      var extension = ".jpg"
      if ($(element).attr("data-img-src") == "site_cover") {
        extension = ".png"
      }

      var backgroundURL = "./assets/" + $(element).attr("data-img-src") + "_" + photoName + extension;
      $(element).attr("style", "background-image:url(" + backgroundURL + ")");
    });
  },
  onWindowResize: function(element, e) {
    this.onSetBackgroundImages();
  }
});