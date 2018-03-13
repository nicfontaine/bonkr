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
  transTime: 150, // dialog transition time will need to be used as a delay to remove .dialog-active from <body>
  // Toggle modal per index, change focus between open/close buttons
  ModalToggle: function (index,modal,open,close) {
    // Dialog is closed. Open
    if (!modal.classList.contains('active')) {
      domDialog.body[0].classList.add('dialog-active')
      // Reset to top on open
      modal.scrollTop = 0
      dialog.openIndex = index
      // Show
      modal.classList.add('active')
      // Focus Close btn
      close.focus()
      // Add ESC listener, that removes itself
      document.addEventListener('keydown', dialog.escListener = function(e) {
        (function(i,btnOpen) {
          if (e.keyCode === 27) { // Esc key
            document.removeEventListener('keydown', dialog.escListener)
            setTimeout(function() {
              domDialog.body[0].classList.remove('dialog-active')
            },150)
            modal.classList.remove('active')
            btnOpen.focus()
          }
        })(index,open)
      })
      
    }
    // Dialog is Open. Close
    else {
      setTimeout(function() {
        domDialog.body[0].classList.remove('dialog-active')
      },150)
      // Remove 'esc to close' listener from document
      document.removeEventListener('keydown', dialog.escListener)
      dialog.escListener = undefined
      dialog.openIndex = undefined
      modal.classList.remove('active')
      // Focus Open btn again
      if (open !== undefined) {
        open.focus()
      }
    }
    
  }

}

// Add Dialog events
if (domDialog.dialog.modal.length > 0) {
  Array.from(domDialog.dialog.modal).forEach((dModal,i) => {

    let dNo = undefined

    // Lookup open button & dialog by their indices
    var open = domDialog.dialog.btnOpen[i],
      modal,
      outer,
      close,
      inner

    // Data attribute to associate open button & dialog modal
    // Open button will have data-dialog-id=xxxx & will correspond to dialog's #dialog-xxxx
    if (domDialog.dialog.btnOpen[i].hasAttribute('data-dialog-id')) {
      var dId = 'dialog-' + domDialog.dialog.btnOpen[i].getAttribute('data-dialog-id')
      if (document.getElementById(dId) != undefined) {
        modal = document.getElementById(dId)
        if (modal.getElementsByClassName('dialog-outer')[0] != undefined) {
          outer = modal.getElementsByClassName('dialog-outer')[0]
        } else { console.log('bonkr dialog warning - no .dialog-outer exists. This is used to cover the page content & make closing easier') }
        if (modal.getElementsByClassName('dialog-btn-close')[0] != undefined) {
          close = modal.getElementsByClassName('dialog-btn-close')[0]
        } else { console.log('bonkr dialog warning - no close button associated with dialog') }
        if (modal.getElementsByClassName('dialog-inner')[0] != undefined) {
          inner = modal.getElementsByClassName('dialog-inner')[0]  
        } else { console.log('bonkr dialog error - need .dialog-inner within dialog') }
        dNo = Number(domDialog.dialog.btnOpen[i].getAttribute('data-dialog-no'))
      } else {
        console.log('bonkr dialog error - there is no dialog associated with the open button\'s data-dialog-id attribute of: ' + domDialog.dialog.btnOpen[i].hasAttribute('data-dialog-no'))
      }
    } else {
      console.log('bonkr dialog error - open button needs "data-dialog-id" to associate it to a dialog')
    }

    // Open Button
    if (open !== undefined && open !== null) {
      open.addEventListener('click', function() {
        dialog.ModalToggle(dNo,modal,open,close)
        // Add esc key function to Document, to close dialog
        // Keep function reference in dialog obj, so we can remove on close & not keep listening
        
      })
      open.addEventListener('touchstart', function(e) {
        e.preventDefault()
        e.stopPropagation()
        dialog.ModalToggle(dNo,modal,open,close)
      },{passive:false})
    } else {
      console.log('bonkr dialog error - Dialog exists, but no open button exists to display it')
    }

    // Close button
    if (close !== undefined && close !== null) {
      close.addEventListener('click', function() {
        dialog.ModalToggle(dNo,modal,open,close)
      })
      close.addEventListener('touchstart', function(e) {
        e.preventDefault()
        e.stopPropagation()
        dialog.ModalToggle(dNo,modal,open,close)
      },{passive:false})
    } else {
      console.log('bonkr dialog warning - no close button associated with dialog. Use .dialog-btn-close')
    }

    // Outer to close
    if (outer !== undefined && outer !== null) {
      outer.addEventListener('click', function(e) {
        dialog.ModalToggle(dNo,modal,open,close)
      })
      outer.addEventListener('touchstart', function(e) {
        e.preventDefault()
        e.stopPropagation()
        dialog.ModalToggle(dNo,modal,open,close)
      },{passive:false})

      // Inner - Disable toggle on children of outer
      if (inner !== undefined && inner !== null) {
        inner.addEventListener('click', function(e) {
          e.stopPropagation()
        })
        inner.addEventListener('touchstart', function(e) {
          // e.preventDefault()
          e.stopPropagation()
        // },{passive:false})
        })
      }

    } else {
      console.log('bonkr dialog warning - no .dialog-outer exists. This is used to cover the page content & make closing easier')
    }

    // If any are set to .active on load, focus that dialog's close button
    if (dModal.classList.contains('active')) {
      close.focus()
    }

  })
}