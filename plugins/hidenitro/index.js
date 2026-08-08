const revenge = window.revenge || window.vendetta;
const patcher = revenge?.patcher || revenge?.metro?.patcher;
const metro = revenge?.metro;

let unpatches = [];

module.exports = {
  onLoad: function() {
    if (!patcher || !metro) return;

    try {
      const chatBar = metro.findByProps("RenderGiftButton");
      if (chatBar?.RenderGiftButton) {
        unpatches.push(patcher.instead(chatBar, "RenderGiftButton", function() { return null; }));
      }

      const settings = metro.findByProps("getSettingSections");
      if (settings?.getSettingSections) {
        unpatches.push(
          patcher.after(settings, "getSettingSections", function(_, res) {
            if (!Array.isArray(res)) return res;
            return res.filter(function(item) {
              const label = (item?.title || item?.key || "").toLowerCase();
              return !label.includes("nitro") && !label.includes("billing");
            });
          })
        );
      }
    } catch (err) {
      console.error("[HideNitro Error]:", err);
    }
  },

  onUnload: function() {
    unpatches.forEach(function(unpatch) {
      if (typeof unpatch === "function") unpatch();
    });
    unpatches = [];
  }
};
