
chrome.storage.local.get('pwa', function(result) {

  if (typeof result.pwa === 'undefined' || result.pwa.ua.indexOf('UA') === -1) {
    console.log("Personal Web Analytics: You've not entered correct settings; navigate to Extension options to get started.");
    return;
  }

  var store = result.pwa;

  var pwa = {

    _getAttribute: function(name) {
      return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(name).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    },

    log: function() {
      console.log('PWA:', this.getPageview() );
    },

    getURL: function() {
      return window.location.host;
    },

    getURN: function() {
      return window.location.pathname;
    },

    getSearch: function() {
      return (
        this._getAttribute('q') ||
        this._getAttribute('s') ||
        this._getAttribute('query') ||
        this._getAttribute('search') ||
        this._getAttribute('keywords') ||
        this._getAttribute('keyword') ||
        this._getAttribute('field-keywords')
      );
    },

    getPageview: function() {
      return this.getURL() + this.getURN() + (this.getSearch() ? '?q='+this.getSearch() : '') + window.location.hash;
    }

  };

  /*
   * Do It!
   */

  _gaq.push([ 'PWA._setAccount', store.ua ])
  _gaq.push([ 'PWA._setSampleRate', 100 ]);               // there's only one user, do all
  _gaq.push([ 'PWA._setSessionCookieTimeout', 1800 ]);    // the default, 30min is return
  _gaq.push([ 'PWA._setSiteSpeedSampleRate', 100 ]);      // there's only one user, do all
  _gaq.push([ 'PWA._setVisitorCookieTimeout', 0 ]);       // there's only one user, expire
  _gaq.push([ 'PWA._setDomainName', 'none' ]);            // limit as much as possible
  _gaq.push([ 'PWA._trackPageview', pwa.getPageview() ]);

  if (store.debug == true) {
    console.log('PWA:', '_setAccount', store.ua);
    pwa.log();
  }

  // track for URL changes after any DOM inserted events
  var currentPV = pwa.getPageview();
  var locationChange = function(e) {
    var nextPV = pwa.getPageview();
    if (nextPV != currentPV) {
      currentPV = nextPV;
      _gaq.push([ 'PWA._trackPageview', nextPV ]);

      if (store.debug == true) pwa.log();
    }
  }

  document.addEventListener('DOMNodeInserted', locationChange);
  window.addEventListener('hashchange', locationChange, false);

  // track mouse clicks
  document.addEventListener('mousedown', function() {
    _gaq.push([ 'PWA._trackEvent', 'mouse', 'down' ]);
  });

});
