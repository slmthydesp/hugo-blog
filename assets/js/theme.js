(function () {
  var KEY = "theme";
  var btn = document.getElementById("theme-toggle");
  if (!btn) return;

  function apply(mode) {
    if (mode === "light" || mode === "dark") {
      document.documentElement.setAttribute("data-theme", mode);
      localStorage.setItem(KEY, mode);
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.removeItem(KEY);
    }
  }

  function current() {
    return localStorage.getItem(KEY);
  }

  // Cycle: light → dark → system (cleared)
  btn.addEventListener("click", function () {
    var saved = current();
    if (saved === "light") {
      apply("dark");
    } else if (saved === "dark") {
      apply(null);
    } else {
      apply("light");
    }
  });
})();
