/*************************************
- General, non-Designer specific, dialog handler
*************************************/

// Store mutable dialog values, & toggle function
var dialog = {
  
  // Dom references
  dom: {
    body: document.getElementsByTagName("body")
  },

  openIndex: undefined,
  escListener: undefined,
  
  // Toggle modal per index, change focus between open/close buttons
  ModalToggle: (e, id) => {

    let modal = document.getElementById("dialog-" + id)
    if (modal === undefined || modal === null) {
      console.log("Dialog not found for event: " + id)
      return;
    }
    
    // Dialog is closed. Open
    if (!modal.classList.contains("active")) {

      // Set scroll, body class, reference, and show
      dialog.dom.body[0].classList.add("dialog-active")
      modal.scrollTop = 0
      dialog.openIndex = id
      modal.classList.add("active")

      // Add ESC listener, that removes itself
      document.addEventListener("keydown", dialog.escListener = function(e) {
        (function(modal) {
          if (e.keyCode === 27) { // Esc key
            document.removeEventListener("keydown", dialog.escListener)
            if (modal.classList.contains("dialog-event-esc")) {
              dialog.dom.body[0].classList.remove("dialog-active")
              modal.classList.remove("active")
            }
          }
        })(modal)
      })
      
    }
    // Dialog is Open. Close
    else {

      dialog.dom.body[0].classList.remove("dialog-active")
      // Remove "esc to close" listener from document
      document.removeEventListener("keydown", dialog.escListener)
      dialog.escListener = undefined
      dialog.openIndex = undefined
      modal.classList.remove("active")

    }
    
  },

  // Set frontend event listeners
  fevents: () =>{
    dialog.dom.body[0].addEventListener("click", (e) => {
      let t = e.target
      // Dialog open/close buttons
      if (t.classList.contains("dialog-btn-open") || t.classList.contains("dialog-btn-close")) {
        let id = t.getAttribute("data-dialog-id")
        if (id !== undefined) {
          dialog.ModalToggle(e, id)
        }
      }
      // Dialog outer cover
      else if (t.classList.contains("dialog-event-outer-close")) {
        let id = t.parentElement.getAttribute("id").split("dialog-")[1]
        dialog.ModalToggle(e, id)
      }
    })
  }

}

dialog.fevents()