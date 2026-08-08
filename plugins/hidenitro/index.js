var PluginModule = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // plugins/hidenitro/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    default: () => src_default
  });
  var g = globalThis;
  var revenge = g.revenge || g.vendetta || {};
  var patcher = revenge.patcher;
  var metro = revenge.metro;
  var unpatches = [];
  var src_default = {
    onLoad: () => {
      try {
        if (!metro || !patcher)
          return;
        const chatBar = metro.findByProps("RenderGiftButton");
        if (chatBar) {
          unpatches.push(
            patcher.instead(chatBar, "RenderGiftButton", () => null)
          );
        }
        const settings = metro.findByProps("getSettingSections");
        if (settings) {
          unpatches.push(
            patcher.after(settings, "getSettingSections", (_, res) => {
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
  return __toCommonJS(src_exports);
})();
module.exports = PluginModule.default || PluginModule;
