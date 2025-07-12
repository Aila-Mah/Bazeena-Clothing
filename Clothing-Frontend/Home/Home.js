//TOGGLE WELCOME

$(document).ready(function () {
    $("p").hide();                 // Initially para hide

    $(".welcome button").click(function () {
        $("p").toggle();
    });
});


//CHANGE WELCOME ON HOVER

$(document).ready(function () {
    // Function to handle button hover
    $(".welcome button").hover(function () {
        $(this).css({
            'background': 'rgba(255, 255, 255, 0.664)',
            'color': 'black',
            'text-shadow': '2px 2px 2px rgba(0, 0, 0, 0.137)'
        });
    }, function () {
        // Revert to original styles on mouse leave
        $(this).css({
            'background': '',
            'color': '',
            'text-shadow': ''
        });
    });
    // Function to handle button click
    $(".welcome button").click(function () {
        // Apply styles when button is clicked
        $(this).css({
            'background': 'rgba(255, 255, 255, 0.664)',
            'color': 'black',
            'text-shadow': '2px 2px 2px rgba(0, 0, 0, 0.137)'
        });
    });
});

//MODAL IMAGE

$(document).ready(function () {
    // Get all images
    var carouselItems = $('.carousel-item img');
    var popularProductImages = $('.popular-products .products-item img');
    var mostRatedProductImages = $('.most-rated .products-item img');
    var modalImg = $('#modalImage');
    var captionText = $('#caption');

    // Function to handle click on carousel items
    carouselItems.click(function () {
        modalImg.attr('src', $(this).attr('src'));
        captionText.text($(this).attr('alt'));
        $('#myModal').modal('show');
    });

    // Function to handle click on popular product images
    popularProductImages.click(function () {
        modalImg.attr('src', $(this).attr('src'));
        captionText.text($(this).attr('alt'));
        $('#myModal').modal('show');
    });

    // Function to handle click on most rated product images
    mostRatedProductImages.click(function () {
        modalImg.attr('src', $(this).attr('src'));
        captionText.text($(this).attr('alt'));
        $('#myModal').modal('show');
    });

    // Close modal when the close button is clicked
    $('.modal .btn-close').click(function () {
        $('#myModal').modal('hide');
    });
});

  