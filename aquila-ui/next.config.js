const withPlugins = require('next-compose-plugins')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const withTranspileModules = require("next-transpile-modules")(["echarts", "zrender"]);

module.exports = withPlugins(
    [withBundleAnalyzer, withTranspileModules],
    {
    reactStrictMode: true,
    images: {
        domains: ['www.um.edu.mo'],
    },
})
