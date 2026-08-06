const { withFinalizedMod, withProjectBuildGradle } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const gradleFix = `
subprojects { subproject ->
  def generatedSourceTaskNames = [
    'generatePackagesList',
    'generateCodegenArtifactsFromSchema',
    'generateCodegenSchemaFromJavaScript'
  ]

  def wireGeneratedSourcesInto = { sourcesJarTask ->
    generatedSourceTaskNames.each { taskName ->
      def generatedSourceTask = subproject.tasks.findByName(taskName)
      if (generatedSourceTask != null) {
        sourcesJarTask.dependsOn generatedSourceTask
      }
    }
  }

  subproject.tasks.matching { it.name.endsWith('SourcesJar') }.all { sourcesJarTask ->
    wireGeneratedSourcesInto(sourcesJarTask)
  }

  subproject.tasks.whenTaskAdded { addedTask ->
    if (addedTask.name in generatedSourceTaskNames) {
      subproject.tasks.matching { it.name.endsWith('SourcesJar') }.all { sourcesJarTask ->
        sourcesJarTask.dependsOn addedTask
      }
    }
  }
}
`;

function withAndroidBuildFixes(config) {
  config = withProjectBuildGradle(config, (gradleConfig) => {
    if (!gradleConfig.modResults.contents.includes("wireGeneratedSourcesInto")) {
      gradleConfig.modResults.contents = `${gradleConfig.modResults.contents.trimEnd()}\n${gradleFix}`;
    }
    return gradleConfig;
  });

  return withFinalizedMod(config, [
    'android',
    (androidConfig) => {
      const resRoot = path.join(androidConfig.modRequest.platformProjectRoot, 'app', 'src', 'main', 'res');
      const drawableDir = path.join(resRoot, 'drawable');
      const drawableNodpiDir = path.join(resRoot, 'drawable-nodpi');
      const valuesDir = path.join(resRoot, 'values');
      const sourceSplashPath = path.join(androidConfig.modRequest.projectRoot, 'src', 'icon', 'splash-fullscreen.png');
      const fullscreenImagePath = path.join(drawableNodpiDir, 'splashscreen_fullscreen_image.png');
      const fullscreenDrawablePath = path.join(drawableDir, 'splashscreen_fullscreen.xml');
      const stylesPath = path.join(valuesDir, 'styles.xml');

      fs.mkdirSync(drawableDir, { recursive: true });
      fs.mkdirSync(drawableNodpiDir, { recursive: true });

      if (fs.existsSync(sourceSplashPath)) {
        fs.copyFileSync(sourceSplashPath, fullscreenImagePath);
      }

      fs.writeFileSync(
        fullscreenDrawablePath,
        `<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
  <item android:drawable="@color/splashscreen_background" />
  <item>
    <bitmap android:gravity="fill" android:src="@drawable/splashscreen_fullscreen_image" />
  </item>
</layer-list>
`
      );

      if (fs.existsSync(stylesPath)) {
        let styles = fs.readFileSync(stylesPath, 'utf8');
        if (!styles.includes('<item name="android:windowBackground">@drawable/splashscreen_fullscreen</item>')) {
          styles = styles.replace(
            '<item name="windowSplashScreenBackground">@color/splashscreen_background</item>',
            `<item name="android:windowBackground">@drawable/splashscreen_fullscreen</item>
    <item name="windowSplashScreenBackground">@color/splashscreen_background</item>`
          );
        }
        fs.writeFileSync(stylesPath, styles);
      }

      return androidConfig;
    },
  ]);
}

module.exports = withAndroidBuildFixes;
