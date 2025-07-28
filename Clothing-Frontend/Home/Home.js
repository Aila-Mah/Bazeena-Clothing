//TOGGLE WELCOME
$(document).ready(function () {
    $("p").hide();                

    $(".welcome button").click(function () {
        $("p").toggle();
    });
});

//MODAL IMAGE

$(document).ready(function () {
    var carouselItems = $('.carousel-item img');
    var popularProductImages = $('.popular-products .products-item img');
    var mostRatedProductImages = $('.most-rated .products-item img');
    var modalImg = $('#modalImage');
    var captionText = $('#caption');

    carouselItems.click(function () {
        modalImg.attr('src', $(this).attr('src'));
        captionText.text($(this).attr('alt'));
        $('#myModal').modal('show');
    });

    popularProductImages.click(function () {
        modalImg.attr('src', $(this).attr('src'));
        captionText.text($(this).attr('alt'));
        $('#myModal').modal('show');
    });

    mostRatedProductImages.click(function () {
        modalImg.attr('src', $(this).attr('src'));
        captionText.text($(this).attr('alt'));
        $('#myModal').modal('show');
    });

    $('.modal .btn-close').click(function () {
        $('#myModal').modal('hide');
    });
});

  