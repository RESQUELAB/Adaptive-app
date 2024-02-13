$( function() { $( "#tabsContainer" ).tabs() } )

function openTab(evt, profileTab) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(profileTab).style.display = "block";
  evt.currentTarget.className += " active";
}

document.getElementById("defaultProfile").click();

let pc = new ProfileController()
pc.render()