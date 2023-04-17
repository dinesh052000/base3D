// Add smooth scrolling to navigation links
$('nav a').on('click', function(event) {
  if (this.hash !== '') {
    event.preventDefault();

    const hash = this.hash;
    const target = $(hash);

    if (target.length) {
      $('html, body').animate(
        {
          scrollTop: target.offset().top
        },
        800 // set the scrolling duration in milliseconds
      );
    } else {
      console.log(`Error: Could not find target element '${hash}'`);
    }
  }
});

// Change navbar background color on scroll
$(window).on('scroll', function() {
  const navbar = $('nav');
  const scrollPosition = $(this).scrollTop();

  if (scrollPosition > 50) {
    navbar.addClass('scrolled');
  } else {
    navbar.removeClass('scrolled');
  }
});
