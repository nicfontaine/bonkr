// Immutable domDialog references
const domDialog = {
  body: document.getElementsByTagName('body'),
  dialog: {
    modal: document.getElementsByClassName('dialog'),
    btnOpen: document.getElementsByClassName('dialog-btn-open'),
    btnClose: document.getElementsByClassName('dialog-btn-close'),
    outer: document.getElementsByClassName('dialog-outer'),
    inner: document.getElementsByClassName('dialog-inner'),
    mask: document.getElementsByClassName('dialog-mask')
  }
}

// Store mutable dialog values, & toggle function
var dialog = {
  openIndex: undefined,
  escListener: undefined,
  // Toggle modal per index, change focus between open/close buttons
  ModalToggle: function (index) {
    let target = domDialog.dialog.modal[index]
    
    // Dialog is closed. Open
    if (!target.classList.contains('active')) {
      domDialog.body[0].classList.add('dialog-active')
      // Reset to top on open
      target.scrollTop = 0
      dialog.openIndex = index
      // Show
      target.classList.add('active')
      // Focus Close btn
      domDialog.dialog.btnClose[index].focus()
      // Re-add ESC listener
      document.addEventListener('keydown', dialog.escListener = function(e) {
        (function(i) {
          if (e.keyCode === 27) { // Esc key
            domDialog.body[0].classList.remove('dialog-active')
            document.removeEventListener('keydown', dialog.escListener)
            target.classList.remove('active')
            domDialog.dialog.btnOpen[i].focus()
          }
        })(index)
      })
      
    }
    // Dialog is Open. Close
    else {
      domDialog.body[0].classList.remove('dialog-active')
      // Remove 'esc to close' listener from document
      document.removeEventListener('keydown', dialog.escListener)
      dialog.escListener = undefined
      dialog.openIndex = undefined
      target.classList.remove('active')
      // Focus Open btn again
      if (domDialog.dialog.btnOpen[index] !== undefined) {
        domDialog.dialog.btnOpen[index].focus()
      }
    }
    
  }

}

// Add Dialog events
if (domDialog.dialog.modal.length > 0) {
  Array.from(domDialog.dialog.modal).forEach((dModal,i) => {
    if (domDialog.dialog.btnOpen[i] !== undefined) {
      // Open button
      domDialog.dialog.btnOpen[i].addEventListener('click', function() {
        dialog.ModalToggle(i)
      })
      domDialog.dialog.btnOpen[i].addEventListener('touchstart', function(e) {
        e.preventDefault()
        e.stopPropagation()
        dialog.ModalToggle(i)
      },{passive:false})
    }
    // Close button
    domDialog.dialog.btnClose[i].addEventListener('click', function() {
      dialog.ModalToggle(i)
    })
    domDialog.dialog.btnClose[i].addEventListener('touchstart', function(e) {
      e.preventDefault()
      e.stopPropagation()
      dialog.ModalToggle(i)
    },{passive:false})
    // Close on outer click
    domDialog.dialog.outer[i].addEventListener('click', function(e) {
      dialog.ModalToggle(i)
    })
    domDialog.dialog.outer[i].addEventListener('touchstart', function(e) {
      e.preventDefault()
      e.stopPropagation()
      dialog.ModalToggle(i)
    },{passive:false})
    // Disable toggle on children of outer
    domDialog.dialog.inner[i].addEventListener('click', function(e) {
      e.stopPropagation()
    })
    domDialog.dialog.inner[i].addEventListener('touchstart', function(e) {
      e.preventDefault()
      e.stopPropagation()
    },{passive:false})

    // Add esc key function to Document, to close dialog
    // Keep function reference in dialog obj, so we can remove on close & not keep listening
    document.addEventListener('keydown', dialog.escListener = function(e) {
      (function(index) {
        if (e.keyCode === 27) { // Esc key
          domDialog.body[0].classList.remove('dialog-active')
          document.removeEventListener('keydown', dialog.escListener)
          domDialog.dialog.modal[index].classList.remove('active')
          if (domDialog.dialog.btnOpen[i] !== undefined) {
            domDialog.dialog.btnOpen[dialog.openIndex].focus()
          }
        }
      })(i)
    })

    // If any are set to .active on load, focus that dialog's close button
    if (dModal.classList.contains('active')) {
      domDialog.dialog.btnClose[i].focus()
    }

  })
}