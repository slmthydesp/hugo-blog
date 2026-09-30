(function () {
  var root = document.querySelector(".site-search");
  if (!root) return;

  var input = root.querySelector("#site-search-input");
  var resultsEl = root.querySelector("#site-search-results");
  if (!input || !resultsEl) return;

  var pagefindUrl = root.getAttribute("data-pagefind-url");
  var pagefind = null;
  var maxResults = 8;

  function disableMissingIndex() {
    input.disabled = true;
    input.placeholder = "请先运行 ./scripts/build.sh 生成索引";
    input.setAttribute("aria-label", "搜索（构建索引后可用）");
    resultsEl.hidden = true;
    resultsEl.innerHTML = "";
  }

  function clearResults() {
    resultsEl.innerHTML = "";
    resultsEl.hidden = true;
  }

  function renderResults(items) {
    resultsEl.innerHTML = "";
    if (!items.length) {
      var empty = document.createElement("li");
      empty.className = "search-result search-result--empty";
      empty.setAttribute("role", "option");
      empty.textContent = "无匹配结果";
      resultsEl.appendChild(empty);
      resultsEl.hidden = false;
      return;
    }

    items.forEach(function (item) {
      var li = document.createElement("li");
      li.className = "search-result";
      li.setAttribute("role", "option");

      var a = document.createElement("a");
      a.href = item.url;
      a.className = "search-result-link";

      var title = document.createElement("span");
      title.className = "search-result-title";
      title.textContent = item.title || item.url;

      a.appendChild(title);

      if (item.excerpt) {
        var excerpt = document.createElement("span");
        excerpt.className = "search-result-excerpt";
        excerpt.innerHTML = item.excerpt;
        a.appendChild(excerpt);
      }

      li.appendChild(a);
      resultsEl.appendChild(li);
    });

    resultsEl.hidden = false;
  }

  async function ensurePagefind() {
    if (pagefind) return pagefind;
    if (!pagefindUrl) {
      disableMissingIndex();
      return null;
    }
    try {
      pagefind = await import(pagefindUrl);
      if (typeof pagefind.init === "function") {
        await pagefind.init();
      }
      return pagefind;
    } catch (err) {
      disableMissingIndex();
      return null;
    }
  }

  async function runSearch(term) {
    var trimmed = (term || "").trim();
    if (!trimmed) {
      clearResults();
      return;
    }

    var pf = await ensurePagefind();
    if (!pf) return;

    var search = await pf.debouncedSearch(trimmed);
    if (search === null) return;

    var slice = (search.results || []).slice(0, maxResults);
    var items = await Promise.all(
      slice.map(async function (result) {
        var data = await result.data();
        return {
          url: data.url,
          title: (data.meta && data.meta.title) || data.url,
          excerpt: data.excerpt || "",
        };
      })
    );
    renderResults(items);
  }

  input.addEventListener("input", function () {
    runSearch(input.value);
  });

  input.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      clearResults();
      input.blur();
    }
  });

  document.addEventListener("click", function (event) {
    if (!root.contains(event.target)) {
      clearResults();
    }
  });

  // Probe index on load so missing pagefind disables the field immediately.
  ensurePagefind();
})();
