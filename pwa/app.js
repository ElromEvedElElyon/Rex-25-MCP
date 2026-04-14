// Rex-25 PWA — vanilla JS app
// - Service worker registration
// - Copy snippet
// - Chat handler (tries localhost:9023 MCP, falls back to canned responses)

(function () {
  'use strict';

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/rex25/sw.js', {scope: '/rex25/'})
        .catch(function (err) { console.warn('SW register failed:', err); });
    });
  }

  window.copySnippet = function () {
    var code = document.getElementById('snippet-code');
    if (!code) return;
    var text = code.textContent;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      var ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
    }
    var btn = (typeof event !== 'undefined') ? event.target : null;
    if (btn) {
      var prev = btn.textContent; btn.textContent = 'Copied';
      setTimeout(function () { btn.textContent = prev; }, 1200);
    }
  };

  var LOCAL_MCP = 'http://localhost:9023/v1/chat';

  function appendMsg(role, text) {
    var log = document.getElementById('chat-log');
    if (!log) return;
    var div = document.createElement('div');
    div.className = 'msg';
    var r = document.createElement('span');
    r.className = 'role'; r.textContent = role + ':';
    div.appendChild(r);
    div.appendChild(document.createTextNode(' ' + text));
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  function cannedAnswer(q) {
    var ql = (q || '').toLowerCase();
    if (ql.indexOf('btc') >= 0 || ql.indexOf('bitcoin') >= 0 || ql.indexOf('price') >= 0) {
      return 'BTC price requires a live connection. Install rex25-mcp locally and I will fetch it from CoinGecko.';
    }
    if (ql.indexOf('install') >= 0 || ql.indexOf('setup') >= 0) {
      return 'Run: curl -fsSL https://sintex.ai/rex25/install.sh | sh  - then restart Claude Desktop.';
    }
    if (ql.indexOf('mcp') >= 0) {
      return 'Rex-25 ships as an MCP server. It exposes tools like rex25_chat, rex25_search, rex25_quote.';
    }
    return 'I am running in offline demo mode. Install rex25-mcp locally for real answers.';
  }

  window.sendChat = function (ev) {
    ev.preventDefault();
    var input = document.getElementById('chat-q');
    if (!input) return false;
    var q = (input.value || '').trim();
    if (!q) return false;
    appendMsg('you', q);
    input.value = '';

    fetch(LOCAL_MCP, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({query: q}),
      mode: 'cors'
    })
      .then(function (r) { if (!r.ok) throw new Error('bad status'); return r.json(); })
      .then(function (j) {
        appendMsg('rex25', (j && (j.answer || j.text)) || JSON.stringify(j));
      })
      .catch(function () {
        appendMsg('rex25', cannedAnswer(q));
      });

    return false;
  };
})();
