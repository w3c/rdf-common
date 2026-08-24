function postProcess() {
    // remove data-cite where the citation is to ourselves.
    const selfCites = Array.from(document.querySelectorAll(`a[data-cite^='${respecConfig.shortName}' i]`));
    for (const anchor of selfCites) {
      const text = anchor.text + ' (this document)';
      const citeParent = anchor.parentNode.parentNode;
      const textSpan = document.createElement('span');
      textSpan.textContent = text;
      citeParent.replaceChild(textSpan, anchor.parentNode);
    }

    // Add highlighting and remove comment from pre elements
    for (const pre of document.querySelectorAll("pre")) {
      // First pre element of aside
      const content = pre.innerHTML
        .replace(/\*\*\*\*([^*]*)\*\*\*\*/g, '<span class="hl-bold">$1</span>')
        .replace(/####([^#]*)####/g, '<span class="comment">$1</span>');
      pre.innerHTML = content;
    }
}

if (document.respec) {
  document.respec.ready.then(postProcess);
} else {
  document.addEventListener("DOMContentLoaded", postProcess);
}

function _esc(s) {
  return s.replace(/&/g,'&amp;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/</g,'&lt;');
}

function updateExample(utils, content) {
  // perform transformations to make it render and prettier
  return _esc(unComment(utils, content));
}

function unComment(utils, content) {
  // perform transformations to make it render and prettier
  return content
    .replace(/<!--/, '')
    .replace(/-->/, '')
    .replace(/< !\s*-\s*-/g, '<!--')
    .replace(/-\s*- >/g, '-->')
    .replace(/-\s*-\s*&gt;/g, '--&gt;');
}

// If content is a self-citation, replace it with the document name
function noSelfCite(utils, content) {
  if (content.toUpperCase() === `[[[${respecConfig.shortName}]]]`.toUpperCase()) {
    return respecConfig.title + ' (this document)';
  } else {
    return content;
  }
}

// Based on:
// - <https://respec.org/docs/#load-additional-languages>
// - <https://github.com/speced/respec/blob/main/tests/spec/core/highlight.html>
function highlightLoader(lang, langURL, propName) {
  langURL = new URL(langURL, window.location).href;
  return async function () {
    const worker = await document.respec.worker;
    const action = "highlight-load-lang";
    let langScript;
    try {
      const response = await fetch(langURL);
      if (response.ok) {
        langScript = await response.text();
      }
    } catch {
      // Fall back to langURL if fetch fails
    }
    worker.postMessage({ action, langScript, langURL, propName, lang });
    return new Promise(resolve => {
      worker.addEventListener("message", function listener({ data }) {
        const { action: responseAction, lang: responseLang } = data;
        if (responseAction === action && responseLang === lang) {
          worker.removeEventListener("message", listener);
          resolve();
        }
      });
    });
  }
}
