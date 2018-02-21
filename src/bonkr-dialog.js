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

    let dNo = undefined
    // data attribute to associate open button & dialog modal
    // If it exists, we'll use that for the index. otherwise, just use the existing order
    if (open.hasAttribute('data-dialog-no') && modal.hasAttribute('data-dialog-no')) {
      dNo = open.getAttribute('data-dialog-no')
    } else {
      dNo = i
      console.log('bonkr - no data attribute "data-dialog-no", just using index of dialog classes')
    }

    let open = domDialog.dialog.btnOpen[dNo]
    let close = domDialog.dialog.btnClose[dNo]
    let outer = domDialog.dialog.outer[dNo]
    let inner = domDialog.dialog.inner[dNo]
    let modal = domDialog.dialog.modal[dNo]

    // Open Button
    if (open !== undefined && open !== null) {
      open.addEventListener('click', function() {
        dialog.ModalToggle(dNo)
      })
      open.addEventListener('touchstart', function(e) {
        e.preventDefault()
        e.stopPropagation()
        dialog.ModalToggle(dNo)
      },{passive:false})
    } else {
      console.log('bonkr dialog error - no open button exists to display dialog')
    }

    // Close button
    if (close !== undefined && close !== null) {
      close.addEventListener('click', function() {
        dialog.ModalToggle(dNo)
      })
      close.addEventListener('touchstart', function(e) {
        e.preventDefault()
        e.stopPropagation()
        dialog.ModalToggle(dNo)
      },{passive:false})
    } else {
      console.log('bonkr dialog warning - no close button associated with dialog')
    }

    // Outer to close
    if (outer !== undefined && outer !== null) {
      outer.addEventListener('click', function(e) {
        dialog.ModalToggle(dNo)
      })
      outer.addEventListener('touchstart', function(e) {
        e.preventDefault()
        e.stopPropagation()
        dialog.ModalToggle(dNo)
      },{passive:false})

      // Inner - Disable toggle on children of outer
      if (inner !== undefined && inner !== null) {
        inner.addEventListener('click', function(e) {
          e.stopPropagation()
        })
        inner.addEventListener('touchstart', function(e) {
          e.preventDefault()
          e.stopPropagation()
        },{passive:false})
      }

    } else {
      console.log('bonkr dialog warning - no .dialog-outer exists. This is used to cover the page content & make closing easier')
    }

    // Add esc key function to Document, to close dialog
    // Keep function reference in dialog obj, so we can remove on close & not keep listening
    document.addEventListener('keydown', dialog.escListener = function(e) {
      (function(index) {
        if (e.keyCode === 27) { // Esc key
          domDialog.body[0].classList.remove('dialog-active')
          document.removeEventListener('keydown', dialog.escListener)
          modal.classList.remove('active')
          if (open !== undefined) {
            domDialog.dialog.btnOpen[dialog.openIndex].focus()
          }
        }
      })(dNo)
    })

    // If any are set to .active on load, focus that dialog's close button
    if (dModal.classList.contains('active')) {
      close.focus()
    }

  })
}