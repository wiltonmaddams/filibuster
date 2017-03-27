jx.define('jx.controllers.index', {
  require: ['jx.ajax'],  
  init: function() {
    this.on({
      "window": {
        "scroll": this.onLogScroll,
        "resize": this.onSnapCards
      },
      ".next-section-nav": {
        "click": this.onProceedToNextSection
      }
    });
    this.introAnimated = true;
    this.sectionHeight = $(window).height();
  },
  onAnimateIntro: function() {
    var textObjects = [
        {
          offset: 0,
          duration: 2000,
          animation: 'leftToRight'
        },
        {
          offset: 500,
          duration: 2000,
          animation: 'rightToLeft'
        },
        {
          offset: 1000,
          duration: 2000,
          animation: 'bottomRightToLeft'
        }
    ],
    options = {
      repeat: false
    },
    animations = {
      "leftToRight": {
        positions: {
          start: {
            width: '100%',
            right: '100%',
            opacity: 0,
            top: '15%',
            'text-align': 'right',
            'font-weight': 'bold',
            'font-size': '2em'
          },
          0: {
            right: '25%',
            opacity: 1,
            duration: 1200
          },
          2: {
            opacity: 1
          }
        }
      },
      "rightToLeft": {
        positions: {
          2: {
            opacity: 1
          }
        }
      },
      "bottomRightToLeft": {
        positions: {
          start: {
            width: '100%',
            left: '100%',
            opacity: 0,
            top: '75%',
            'text-align': 'left'
          },
          0: {
            left: '25%',
            opacity: 1,
            duration: 1200
          },
          1: {
            duration: 1200
          },
          2: {
            opacity: 1,
            duration: 1200
          }
        }
      }
    };
    $("#mission-statement").animateText(textObjects, options, animations);
  },
  onLogScroll: function(element, e) {
    e.preventDefault();
    
    var windowY = window.pageYOffset;
    var height = $(window).height();
    var width = $(window).width();
    var partyY = $("#party").position().top;
    var missionY = $("#mission").position().top;

    if (partyY > 0) {
      if (windowY >= partyY) {
        $("#party-callout").fadeIn(1000);
      } 
      
      var offsetRight = (width/2).toString() + "px";
      var offsetLeft = (width/3).toString() + "px";
      $('#mission-statement').offset().left;

      if (windowY >= (partyY + this.sectionHeight/2) && !this.introAnimated) {
        this.introAnimated = true;
        this.onAnimateIntro();
      }
    }  
  },
  onProceedToNextSection: function(element, e) {
    $(window).scrollTo($("#event-details"), {
      duration: 2000
    });
  },
  onReady: function(element, e) {
    // This snaps each "card" to the window's height
    this.onSnapCards();

    // Almost a hundred animation options available at the Github repo
    var animateInOptions = [
      "rotateInDownLeft",
      "rotateInDownRight",
      "rotateInUpLeft",
      "rotateInUpRight"
    ];
    var animateOutOptions = [
      "rotateOut",
      "rotateOutDownLeft",
      "rotateOutDownRight",
      "rotateOutUpLeft",
      "rotateOutUpRight"
    ];

    // Events overview carousel
    $('#events-overview').owlCarousel({
      loop: true,
      // responsiveClass: true,
      // dotsEach: 1,
      // dots: true,
      animateIn: animateInOptions[~~(Math.random() * animateInOptions.length)],
      animateOut: animateOutOptions[~~(Math.random() * animateOutOptions.length)],
      // dotsContainer: ".event-nav-container",
      responsive:{
        // 0:{
        //   items:1,
        //   loop: true
        // },
        // 600:{
        //   items:1,
        //   loop: true
        // },
        1000:{
          items:4,
        }
      }
    });

    // Event Details carousel
    $('#event-details').owlCarousel({
      loop: true,
      // responsiveClass: true,
      // dotsEach: 1,
      // dots: true,
      animateIn: animateInOptions[~~(Math.random() * animateInOptions.length)],
      animateOut: animateOutOptions[~~(Math.random() * animateOutOptions.length)],
      // dotsContainer: ".event-nav-container",
      responsive:{
        0:{
          items:1,
          loop: true
        },
        600:{
          items:1,
          loop: true
        },
        1000:{
          items:1,
        }
      }
    });

    // Event Tickets carousel
    $('#event-tickets').owlCarousel({
      loop: true,
      // responsiveClass: true,
      // dotsEach: 1,
      // dots: true,
      animateIn: animateInOptions[~~(Math.random() * animateInOptions.length)],
      animateOut: animateOutOptions[~~(Math.random() * animateOutOptions.length)],
      // dotsContainer: ".event-nav-container",
      responsive:{
        0:{
          items:1,
          loop: true
        },
        600:{
          items:1,
          loop: true
        },
        1000:{
          items:1,
        }
      }
    });
  },
  onSnapCards: function() {
    var windowHeight = $(window).height();

    // Set each card to be the window height
    $(".card-section").css({
      "height": windowHeight 
    });

    $("#theme-background").css({
      "height": windowHeight
    })

    $("#intro").css({
      "height": windowHeight
    })

    // Each event card should also be at least the window height
    $(".card-container").css("min-height", $(window).height());
    $("#events-overview .card-container").css("min-height", $(window).height() / 1.5);
  },
  onWindowResize: function(element, e) {
    this.onSnapCards();
  }
});