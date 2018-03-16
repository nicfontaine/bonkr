const loader = {
  cont: document.getElementById('bonkr-loader'),
  offset: 500,
  kill: function() {
    setTimeout(function() {
      loader.cont.classList.add('hide')
      window.removeEventListener('load', loader.kill)
    },loader.offset)
  }
}

if (loader.cont !== null) {
  window.addEventListener('load', loader.kill)
}
