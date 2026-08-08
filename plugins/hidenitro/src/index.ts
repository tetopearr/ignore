import { instead, after } from "@revenge-mod/patcher";
import { findByProps } from "@revenge-mod/metro";

let unpatches: Array<() => void> = [];

export default {
  onLoad: () => {
    try {
      const safeAfter = after || (window as any).revenge?.patcher?.after || (window as any).vendetta?.patcher?.after;
      const safeInstead = instead || (window as any).revenge?.patcher?.instead || (window as any).vendetta?.patcher?.instead;
      const safeFindByProps = findByProps || (window as any).revenge?.metro?.findByProps || (window as any).vendetta?.metro?.findByProps;

      if (!safeFindByProps) return;

      const chatBar = safeFindByProps("RenderGiftButton");
      if (chatBar?.RenderGiftButton && safeInstead) {
        unpatches.push(safeInstead(chatBar, "RenderGiftButton", () => null));
      }

      const settings = safeFindByProps("getSettingSections");
      if (settings?.getSettingSections && safeAfter) {
        unpatches.push(
          safeAfter(settings, "getSettingSections", (_: any, res: any) => {
            if (!Array.isArray(res)) return res;
            return res.filter((item: any) => {
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
      if (typeof unpatch === "function") unpatch();
    });
    unpatches = [];
  }
};
