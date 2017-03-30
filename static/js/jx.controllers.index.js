jx.define('jx.controllers.index', {
  require: ['jx.ajax'],  
  init: function() {
    this.on({
      "window": {
        "scroll": this.onLogScroll,
        "resize": this.onWindowResize
      },
      "#hamburger-nav": {
        "click": this.onToggleNav
      }
    });
    this.videoDesired = true // THIS BECOMES SOME SERVER VARIABLE
    this.navAnimating = false;
  },
  onLogScroll: function(element, e) {
    e.preventDefault();
    // If wanting to use custom logic based on pageY position, put code here
  },
  onReady: function(element, e) {
    // This function is invoked automatically by the base jx.ajax.js files when the DOM is ready, any custom
    // starting code can go here
  },
  onToggleNav: function(element, e) {
    var that = this;
    if (!this.navAnimating) {
      this.navAnimating = true;
      var navWidth = $(".menu.menu-container").width();
      //Change the hamburger styling/animate
      $(element).toggleClass("open");  

      // If the nav is hidden
      if ($(".menu.menu-container").hasClass("mod_hide")) {
        // First pop the menu off screen
        $(".menu.menu-container").css({
          "right": "-=" + navWidth
        });
        // Set it to visible
        $(".menu.menu-container").toggleClass("mod_hide");
        // Then animate in
        $(".menu.menu-container").animate({
          "right": "+=" + navWidth
        }, 400, function() {
          //Reset
          that.navAnimating = false;
        });
      } else {
        // Animate out
        $(".menu.menu-container").animate({
          "right": "-=" + navWidth
        }, 400, function() {
          // Set it to hidden
          $(".menu.menu-container").toggleClass("mod_hide");
          // Then pop back to original position
          $(".menu.menu-container").css({
            "right": "+=" + navWidth
          });
          //Reset
          that.navAnimating = false;  
        });
      }
      
    }
  },
  onWindowResize: function(element, e) {
    // Custom logic for window resize? Put here...
  }
});