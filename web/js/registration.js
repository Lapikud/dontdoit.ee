var _has_ran = false;
var api = "/api/v1";

function main(){
  if (_has_ran) {
    return;
  }
  _has_ran = true;
  console.log("Running main");

  // add required attribute on text entry 
  var form = document.getElementById('registration-form');
  var inputs = form.querySelectorAll("input");
  for (var i = inputs.length - 1; i >= 0; i--) {
    var input = inputs[i]
    if (input.hasAttribute("data-required")) {
      input.addEventListener("focus", function(ev) {
        //this.setAttribute("required", "");
        console.log("adding required attribute");
      })
    }
  }

  // add form submission call back
  form.addEventListener("submit", function(ev){
    ev.preventDefault();

    var data = {};
    var missing_fields = false;
    for (var i = 0, ii = form.length; i < ii; ++i) {
      var input = form[i];
      if (input.name) {
        if (input.value) {
          data[input.name] = input.value;
        } else {
          if (input.hasAttribute("data-required")) {
            input.parentElement.className +=" is-invalid";
            missing_fields = true;
          }
        }
      }
    }
    if (missing_fields) {
      return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", api+"/registration-form", true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

    // send the collected data as JSON
    xhr.send(JSON.stringify(data));

    xhr.onloadend = function () {
      var notification = document.querySelector('.mdl-js-snackbar');
      if (this.status == 409) {
        notification.MaterialSnackbar.showSnackbar({message:"Sellise nimega tiim on juba olemas!"});
      } else if ((this.status >= 200) && (this.status < 300)) {
        notification.MaterialSnackbar.showSnackbar({message:"Meeskond lisatud"});
      } else {
        notification.MaterialSnackbar.showSnackbar({message:"tundmatu viga "+this.status+" "+this.statusText});
      }
      console.log(this)
    };
  })
}

document.addEventListener("DOMContentLoaded", function(event) { 
  main();
});
