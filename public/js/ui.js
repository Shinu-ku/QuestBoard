function setTheme(theme){

  document.getElementById("theme-style").href =
    "css/themes/" + theme + ".css"

  localStorage.setItem("theme",theme)
}

const savedTheme = localStorage.getItem("theme") || "default"

document.getElementById("theme-style").href =
  "css/themes/" + savedTheme + ".css"