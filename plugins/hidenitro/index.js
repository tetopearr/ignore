import { patcher } from "@revenge-mod/patcher";
import { findByProps } from "@revenge-mod/metro";

let unpatches = [];

export default {
  onLoad: () => {
    // hide gift icon in chat
    const chatBar = findByProps("RenderGiftButton");
    if (chatBar?.RenderGiftButton) {
      unpatches.push(patcher.instead(chatBar, "RenderGiftButton", () => null));
    }

    // strip nitro tabs from settings menu
    const settings = findByProps("getSettingSections");
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