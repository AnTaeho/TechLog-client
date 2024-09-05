const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      '/posts': {
        target: 'https://api.jobava.online',  // API 서버 URL
        changeOrigin: true,
        pathRewrite: { '^/posts': '' }  // 필요에 따라 경로 수정
      },
      '/tags': {
        target: 'https://api.jobava.online',  // API 서버 URL
        changeOrigin: true,
        pathRewrite: { '^/tags': '' }  // 필요에 따라 경로 수정
      }
    }
  }
})
