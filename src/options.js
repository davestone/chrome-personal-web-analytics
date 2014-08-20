
/*
 * Flash Message
 */

function flash(className, message) {
  var flash = document.getElementById("flash");
  flash.innerHTML = "Saved";
  setTimeout(function() {
    flash.innerHTML = "";
  }, 2000);
}

/*
 * Read & Write to storage
 */

function write() {
  var store = {};

  // store inputs
  var inputs = document.querySelectorAll('input');
  for(var i=0;i<inputs.length;i++) {
    var val,
        key = inputs[i].name;

    switch (inputs[i].type) {
      case 'checkbox':
        val = inputs[i].checked ? inputs[i].value : '';
        break;
      default:
        val = inputs[i].value;
        break;
    }

    store[key] = val;
  }

  // cast
  store.debug = Boolean(store.debug);

  chrome.storage.local.set({'pwa': store}, function() {
    flash('Options Saved');
  });
}

function read() {
  // get
  var store;

  chrome.storage.local.get('pwa', function(result) {
    store = result.pwa;

    // if empty
    if (store == undefined) return;

    var inputs = document.querySelectorAll('input');
    for(var i=0;i<inputs.length;i++) {
      var key = inputs[i].name;

      switch (inputs[i].type) {
        case 'checkbox':
          inputs[i].checked = store[key];
          break;
        default:
          val = store[key];
          break;
      }

      document.getElementById(key).value = val;
    }
  });
}

/*
 * Do It!
 */

document.addEventListener('DOMContentLoaded', read);
document.querySelector('#save').addEventListener('click', write);
