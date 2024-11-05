function prettierQuote(hook) {
  hook.beforeEach(function (content) {
    return content
      .replaceAll("“**", "**“")
      .replaceAll("**”", "”**")
      .replaceAll("“", "『")
      .replaceAll("”", "』")
      .replaceAll("‘", "「")
      .replaceAll("’", "」");
  });
}

function autoTop(hook) {
  hook.doneEach(function () {
    window.scrollTo(0, 0);
  });
}

function fix(hook) {
  hook.doneEach(function () {
    const f = document.querySelectorAll("footer");
    if (f.length == 1) {
      const e = document.createElement("footer");
      e.innerHTML = f[0].childNodes[0].innerHTML;
      f[0].appendChild(e);
      f[0].childNodes[0].remove();
    }
  });
}

var discussionTip = function (hook, vm) {
  hook.doneEach(function () {
    document
      .querySelector(".giscus")
      .insertAdjacentHTML(
        "beforebegin",
        "<hr/><h2>讨论区</h2><p>您需要登录 GitHub 帐户才能进行讨论，讨论区支持 Markdown 语法。</p>" +
          "<p>请不要发布与课程无关的内容。</p>"
      );
  });
};

var footer = function (hook, vm) {
  hook.doneEach(function () {
    document
      .querySelector("article")
      .insertAdjacentHTML(
        "beforeend",
        "<footer><hr/>© 2024 USTC CS1002A.02 助教团队，保留所有权利。<br/><br/>不提供任何担保。</footer>"
      );
  });
};

window.$docsify = {
  plugins: [prettierQuote, autoTop, fix, discussionTip, footer],
  markdown: {
    gfm: true,
  },
  executeScript: true,
  name: "ICS 2024 Miao",
  count: {
    color: "white",
    language: "chinese",
  },
  loadSidebar: true,
  alias: { "/.*/_sidebar.md": "/_sidebar.md" },
  externalLinkTarget: "_blank",
  pagination: {
    crossChapter: true,
    crossChapterText: true,
  },
  copyCode: {
    buttonText: "复制代码",
    successText: "OK!",
  },
  loadFooter: "_footer.md",
  giscus: {
    repo: "skjsjhb/lc3-docs",
    repoId: "R_kgDOM0GxuQ",
    category: "Announcements",
    categoryId: "DIC_kwDOM0Gxuc4CinIJ",
    mapping: "title",
    reactionsEnabled: "1",
    strict: "0",
    emitMetadata: "0",
    inputPosition: "top",
    theme: "preferred_color_scheme",
    lang: "zh-CN",
    loading: "lazy",
  },
  latex: {
    customOptions: {},
  },
};
