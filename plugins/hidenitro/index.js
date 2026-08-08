(() => {
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });

  // plugins/hidenitro/src/index.ts
  var import_plugins = __require("@revenge-mod/plugins");
  var unpatches = [];
  var src_default = {
    onLoad: () => {
      try {
        const chatBar = import_plugins.metro.findByProps("RenderGiftButton");
        if (chatBar) {
          unpatches.push(
            import_plugins.patcher.instead(chatBar, "RenderGiftButton", () => null)
          );
        }
        const settings = import_plugins.metro.findByProps("getSettingSections");
        if (settings) {
          unpatches.push(
            import_plugins.patcher.after(settings, "getSettingSections", (_, res) => {
              if (!Array.isArray(res))
                return res;
              return res.filter((item) => {
                const label = String(item?.title || item?.key || "").toLowerCase();
                return !label.includes("nitro") && !label.includes("billing");
              });
            })
          );
        }
      } catch (err) {
        console.error("[HideNitro Error]:", err);
      }
    },
    onUnload: () => {
      unpatches.forEach((unpatch) => {
        try {
          if (typeof unpatch === "function")
            unpatch();
        } catch (e) {
        }
      });
      unpatches = [];
    }
  };
})();
