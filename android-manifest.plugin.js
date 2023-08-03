const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function androiManifestPlugin(config) {
  return withAndroidManifest(config, async (config) => {
    let androidManifest = config.modResults.manifest;

    androidManifest.application[0]["meta-data"] = androidManifest.application[0]["meta-data"].map(res => {
        if (res.$["android:name"] === "com.google.android.gms.wallet.api.enabled") {
          res.$["android:value"] = "true";
        }

        return res;
    });


    return config;
  });
};