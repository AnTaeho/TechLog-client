const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: 'https://AnTaeho.github.io/TechLog-client',
  outputDir: 'dist'
})
