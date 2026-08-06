const { withProjectBuildGradle } = require('@expo/config-plugins');

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
  return withProjectBuildGradle(config, (gradleConfig) => {
    if (!gradleConfig.modResults.contents.includes("wireGeneratedSourcesInto")) {
      gradleConfig.modResults.contents = `${gradleConfig.modResults.contents.trimEnd()}\n${gradleFix}`;
    }
    return gradleConfig;
  });
}

module.exports = withAndroidBuildFixes;
