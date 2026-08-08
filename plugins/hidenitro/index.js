const mod = window.revenge || window.vendetta;
const { patcher, metro } = mod || {};

let unpatches = [];

export default {
  onLoad: () => {
    if (!patcher || !metro) return;

    // hide gift icon in chat bar
    const chatBar = metro.findByProps("RenderGiftButton");
    if (chatBar?.RenderGiftButton) {
      unpatches.push(patcher.instead(chatBar, "RenderGiftButton", () => null));
    }

    // strip nitro tabs from settings
    const settings = metro.findByProps("getSettingSections");
    if (settings?.getSettingSections) {
      unpatches.push(
        patcher.after(settings, "getSettingSections", (_, res) => {
          if (!Array.isArray(res)) return res;
          return res.filter((item) => {
            const label = (item?.title || item?.key || "").toLowerCase();
            return !label.includes("nitro") && !label.includes("billing");
          });
        })
      );
    }
  },

  onUnload: () => {
    unpatches.forEach((u) => u?.());
    unpatches = [];
  }
};
  onUnload: () => {
    unpatches.forEach((u) => u?.());
    unpatches = [];
  }
};
