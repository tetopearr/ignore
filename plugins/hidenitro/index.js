(() => {
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });

  // plugins/hidenitro/src/index.ts
  var import_patcher = __require("@revenge-mod/patcher");
  var import_metro = __require("@revenge-mod/metro");
  var unpatches = [];
  var src_default = {
    onLoad: () => {
      try {
        const safeAfter = import_patcher.after || window.revenge?.patcher?.after || window.vendetta?.patcher?.after;
        const safeInstead = import_patcher.instead || window.revenge?.patcher?.instead || window.vendetta?.patcher?.instead;
        const safeFindByProps = import_metro.findByProps || window.revenge?.metro?.findByProps || window.vendetta?.metro?.findByProps;
        if (!safeFindByProps)
          return;
        const chatBar = safeFindByProps("RenderGiftButton");
        if (chatBar?.RenderGiftButton && safeInstead) {
          unpatches.push(safeInstead(chatBar, "RenderGiftButton", () => null));
        }
        const settings = safeFindByProps("getSettingSections");
        if (settings?.getSettingSections && safeAfter) {
          unpatches.push(
            safeAfter(settings, "getSettingSections", (_, res) => {
              if (!Array.isArray(res))
                return res;
              return res.filter((item) => {
                const label = (item?.title || item?.key || "").toLowerCase();
                return !label.includes("nitro") && !label.includes("billing");
              });
            })
          );
        }
      } catch (err) {
        console.error("[HideNitro Load Error]:", err);
      }
    },
    onUnload: () => {
      unpatches.forEach((unpatch) => {
        if (typeof unpatch === "function")
          unpatch();
      });
      unpatches = [];
    }
  };
})();
