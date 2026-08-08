const { patcher, metro } = (window as any).revenge || (window as any).vendetta || {};

let unpatches: Array<() => void> = [];

export default {
  onLoad: () => {
    try {
      if (!metro || !patcher) return;

      const chatBar = metro.findByProps("RenderGiftButton");
      if (chatBar) {
        unpatches.push(
          patcher.instead(chatBar, "RenderGiftButton", () => null)
        );
      }

      const settings = metro.findByProps("getSettingSections");
      if (settings) {
        unpatches.push(
          patcher.after(settings, "getSettingSections", (_: any, res: any) => {
            if (!Array.isArray(res)) return res;
            return res.filter((item: any) => {
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
        if (typeof unpatch === "function") unpatch();
      } catch (e) {}
    });
    unpatches = [];
  }
};
