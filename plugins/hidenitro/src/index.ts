import { patcher, metro } from "@revenge-mod/plugins";

let unpatches: Array<() => void> = [];

export default {
  onLoad: () => {
    const chatBar = metro.findByProps("RenderGiftButton");
    if (chatBar?.RenderGiftButton) {
      unpatches.push(patcher.instead(chatBar, "RenderGiftButton", () => null));
    }

    const settings = metro.findByProps("getSettingSections");
    if (settings?.getSettingSections) {
      unpatches.push(
        patcher.after(settings, "getSettingSections", (_, res) => {
          if (!Array.isArray(res)) return res;
          return res.filter((item: any) => {
            const label = (item?.title || item?.key || "").toLowerCase();
            return !label.includes("nitro") && !label.includes("billing");
          });
        })
      );
    }
  },

  onUnload: () => {
    unpatches.forEach((unpatch) => unpatch?.());
    unpatches = [];
  }
};
