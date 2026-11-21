(function () {
  'use strict';

  var options = {
    fileLoadingImage: 'css/images/loading.webp',
    fileCloseImage: 'css/images/close.webp',
    labelImage: 'Imagen',
    labelOf: 'de'
  };

  var album = [];
  var currentIndex = 0;
  var overlay, lightbox, outerContainer, container, lbImage, lbNav, lbPrev, lbNext, lbLoader, lbDataContainer, lbCaption, lbNumber;

  function build() {
    overlay = document.createElement('div');
    overlay.id = 'lightboxOverlay';
    overlay.style.display = 'none';

    lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.style.display = 'none';
    lightbox.innerHTML =
      '<div class="lb-outerContainer">' +
        '<div class="lb-container">' +
          '<img class="lb-image" alt="" />' +
          '<div class="lb-nav">' +
            '<a class="lb-prev" href="#" aria-label="Imagen anterior"></a>' +
            '<a class="lb-next" href="#" aria-label="Imagen siguiente"></a>' +
          '</div>' +
          '<div class="lb-loader">' +
            '<a class="lb-cancel" href="#" aria-label="Cerrar"><img src="' + options.fileLoadingImage + '" alt="Cargando" /></a>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="lb-dataContainer">' +
        '<div class="lb-data">' +
          '<div class="lb-details">' +
            '<span class="lb-caption"></span>' +
            '<span class="lb-number"></span>' +
          '</div>' +
          '<div class="lb-closeContainer">' +
            '<a class="lb-close" href="#" aria-label="Cerrar"><img src="' + options.fileCloseImage + '" alt="Cerrar" /></a>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);
    document.body.appendChild(lightbox);

    outerContainer = lightbox.querySelector('.lb-outerContainer');
    container = lightbox.querySelector('.lb-container');
    lbImage = lightbox.querySelector('.lb-image');
    lbNav = lightbox.querySelector('.lb-nav');
    lbPrev = lightbox.querySelector('.lb-prev');
    lbNext = lightbox.querySelector('.lb-next');
    lbLoader = lightbox.querySelector('.lb-loader');
    lbDataContainer = lightbox.querySelector('.lb-dataContainer');
    lbCaption = lightbox.querySelector('.lb-caption');
    lbNumber = lightbox.querySelector('.lb-number');

    overlay.addEventListener('click', function (e) { e.preventDefault(); end(); });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) { e.preventDefault(); end(); }
    });
    lbPrev.addEventListener('click', function (e) {
      e.preventDefault();
      if (currentIndex > 0) changeImage(currentIndex - 1);
    });
    lbNext.addEventListener('click', function (e) {
      e.preventDefault();
      if (currentIndex < album.length - 1) changeImage(currentIndex + 1);
    });
    lightbox.querySelector('.lb-close').addEventListener('click', function (e) { e.preventDefault(); end(); });
    lbLoader.addEventListener('click', function (e) { e.preventDefault(); end(); });
  }

  function sizeOverlay() {
    overlay.style.width = Math.max(document.documentElement.scrollWidth, window.innerWidth) + 'px';
    overlay.style.height = Math.max(document.documentElement.scrollHeight, window.innerHeight) + 'px';
  }

  function start(link) {
    album = [];
    var index = 0;
    var rel = link.getAttribute('rel');
    if (rel === 'lightbox') {
      album.push({ link: link.getAttribute('href'), title: link.getAttribute('title') || '' });
    } else {
      var links = document.querySelectorAll('a[rel="' + rel + '"]');
      for (var i = 0; i < links.length; i++) {
        album.push({ link: links[i].getAttribute('href'), title: links[i].getAttribute('title') || '' });
        if (links[i].getAttribute('href') === link.getAttribute('href')) index = i;
      }
    }
    sizeOverlay();
    overlay.style.display = 'block';
    lightbox.style.top = (window.scrollY + window.innerHeight / 10) + 'px';
    lightbox.style.left = window.scrollX + 'px';
    lightbox.style.display = 'block';
    window.addEventListener('resize', sizeOverlay);
    document.addEventListener('keyup', onKeyUp);
    changeImage(index);
  }

  function changeImage(index) {
    currentIndex = index;
    lbImage.style.display = 'none';
    lbNav.style.display = 'none';
    lbDataContainer.style.display = 'none';
    lbLoader.style.display = 'block';

    var preloader = new Image();
    preloader.onload = function () {
      var cs = window.getComputedStyle(container);
      var padX = (parseInt(cs.paddingLeft, 10) || 0) + (parseInt(cs.paddingRight, 10) || 0);
      var padY = (parseInt(cs.paddingTop, 10) || 0) + (parseInt(cs.paddingBottom, 10) || 0);
      var newW = preloader.naturalWidth + padX;
      var newH = preloader.naturalHeight + padY;

      lbImage.src = album[index].link;
      lbImage.alt = album[index].title || 'Hairstyle preview';
      outerContainer.style.width = newW + 'px';
      outerContainer.style.height = newH + 'px';
      lbDataContainer.style.width = newW + 'px';

      lbLoader.style.display = 'none';
      lbImage.style.display = 'block';
      lbNav.style.display = 'block';
      lbPrev.style.display = index > 0 ? 'block' : 'none';
      lbNext.style.display = index < album.length - 1 ? 'block' : 'none';

      lbCaption.textContent = album[index].title || '';
      lbCaption.style.display = album[index].title ? 'inline' : 'none';
      if (album.length > 1) {
        lbNumber.textContent = options.labelImage + ' ' + (index + 1) + ' ' + options.labelOf + ' ' + album.length;
        lbNumber.style.display = 'block';
      } else {
        lbNumber.style.display = 'none';
      }
      lbDataContainer.style.display = 'block';
      sizeOverlay();
    };
    preloader.src = album[index].link;
  }

  function onKeyUp(e) {
    if (e.key === 'Escape' || e.key === 'x' || e.key === 'X') {
      end();
    } else if ((e.key === 'ArrowLeft' || e.key === 'p' || e.key === 'P') && currentIndex > 0) {
      changeImage(currentIndex - 1);
    } else if ((e.key === 'ArrowRight' || e.key === 'n' || e.key === 'N') && currentIndex < album.length - 1) {
      changeImage(currentIndex + 1);
    }
  }

  function end() {
    window.removeEventListener('resize', sizeOverlay);
    document.removeEventListener('keyup', onKeyUp);
    lightbox.style.display = 'none';
    overlay.style.display = 'none';
  }

  document.addEventListener('DOMContentLoaded', function () {
    build();
    document.body.addEventListener('click', function (e) {
      var link = e.target.closest('a[rel^="lightbox"]');
      if (link) {
        e.preventDefault();
        start(link);
      }
    });
  });
})();
