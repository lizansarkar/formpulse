(function () {
  "use strict";

  // Prevent multiple initializations
  if (window.__FORMPULSE_INITIALIZED__) return;
  window.__FORMPULSE_INITIALIZED__ = true;

  // Find the current script tag to read data attributes
  var currentScript =
    document.currentScript ||
    (function () {
      var scripts = document.getElementsByTagName("script");
      for (var i = scripts.length - 1; i >= 0; i--) {
        if (scripts[i].src && scripts[i].src.indexOf("embed.js") !== -1) {
          return scripts[i];
        }
      }
      return scripts[scripts.length - 1];
    })();

  var formId =
    (currentScript && currentScript.getAttribute("data-form-id")) ||
    (window.FormPulseConfig && window.FormPulseConfig.formId);

  if (!formId) {
    console.warn("[FormPulse] No data-form-id provided on script tag.");
    return;
  }

  // Derive origin from script URL or current window
  var scriptSrc = currentScript && currentScript.src;
  var baseUrl = "";
  if (scriptSrc) {
    var a = document.createElement("a");
    a.href = scriptSrc;
    baseUrl = a.protocol + "//" + a.host;
  } else {
    baseUrl = window.location.origin;
  }

  var primaryColor =
    (currentScript && currentScript.getAttribute("data-color")) || "#4f46e5";
  var position =
    (currentScript && currentScript.getAttribute("data-position")) || "right"; // "right" | "left"

  // Inject Styles
  var style = document.createElement("style");
  style.id = "formpulse-widget-styles";
  style.textContent = `
    .fp-widget-container {
      position: fixed;
      bottom: 24px;
      ${position === "left" ? "left: 24px;" : "right: 24px;"}
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .fp-widget-button {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: ${primaryColor};
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      color: white;
      outline: none;
    }
    .fp-widget-button:hover {
      transform: scale(1.08);
      box-shadow: 0 14px 30px -4px rgba(0, 0, 0, 0.35);
    }
    .fp-widget-button:active {
      transform: scale(0.95);
    }
    .fp-widget-badge {
      position: absolute;
      top: -3px;
      right: -3px;
      background: #ef4444;
      color: white;
      font-size: 11px;
      font-weight: 700;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #ffffff;
      animation: fp-bounce 2s infinite ease-in-out;
    }
    .fp-widget-frame-wrapper {
      position: fixed;
      bottom: 100px;
      ${position === "left" ? "left: 24px;" : "right: 24px;"}
      width: 420px;
      height: 640px;
      max-width: calc(100vw - 32px);
      max-height: calc(100vh - 120px);
      background: #ffffff;
      border-radius: 20px;
      box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.25), 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      overflow: hidden;
      display: none;
      opacity: 0;
      transform: translateY(20px) scale(0.96);
      transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 999998;
      border: 1px solid rgba(0, 0, 0, 0.08);
    }
    .fp-widget-frame-wrapper.fp-open {
      display: block;
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    .fp-widget-frame {
      width: 100%;
      height: 100%;
      border: none;
      display: block;
    }
    @media (max-width: 640px) {
      .fp-widget-frame-wrapper {
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100vw;
        height: 100vh;
        max-width: 100vw;
        max-height: 100vh;
        border-radius: 0;
        border: none;
      }
    }
    @keyframes fp-bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }
  `;
  document.head.appendChild(style);

  // Create Container
  var container = document.createElement("div");
  container.className = "fp-widget-container";
  container.id = "formpulse-root";

  // Create Button
  var button = document.createElement("button");
  button.className = "fp-widget-button";
  button.setAttribute("aria-label", "Open Chatbot Form");
  button.innerHTML = `
    <svg id="fp-icon-chat" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
    </svg>
    <svg id="fp-icon-close" style="display:none;" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
    <div id="fp-badge" class="fp-widget-badge">1</div>
  `;

  // Create Frame Wrapper
  var frameWrapper = document.createElement("div");
  frameWrapper.className = "fp-widget-frame-wrapper";

  var iframe = document.createElement("iframe");
  iframe.className = "fp-widget-frame";
  iframe.src = baseUrl + "/embed/" + encodeURIComponent(formId);
  iframe.title = "FormPulse Interactive Form";
  iframe.setAttribute("allow", "clipboard-write");

  frameWrapper.appendChild(iframe);
  document.body.appendChild(frameWrapper);
  container.appendChild(button);
  document.body.appendChild(container);

  var isOpen = false;

  function toggleWidget() {
    isOpen = !isOpen;
    var iconChat = document.getElementById("fp-icon-chat");
    var iconClose = document.getElementById("fp-icon-close");
    var badge = document.getElementById("fp-badge");

    if (isOpen) {
      frameWrapper.style.display = "block";
      setTimeout(function () {
        frameWrapper.classList.add("fp-open");
      }, 10);
      if (iconChat) iconChat.style.display = "none";
      if (iconClose) iconClose.style.display = "block";
      if (badge) badge.style.display = "none";
    } else {
      frameWrapper.classList.remove("fp-open");
      setTimeout(function () {
        frameWrapper.style.display = "none";
      }, 250);
      if (iconChat) iconChat.style.display = "block";
      if (iconClose) iconClose.style.display = "none";
    }
  }

  button.addEventListener("click", toggleWidget);

  // Listen to postMessage from iframe
  window.addEventListener("message", function (event) {
    if (event.data === "formpulse:close") {
      if (isOpen) toggleWidget();
    }
  });
})();
