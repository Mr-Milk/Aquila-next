const withPlugins = require('next-compose-plugins')
const {withPlaiceholder} = require("@plaiceholder/next");
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})
const withTranspileModules = require("next-transpile-modules")(["echarts", "zrender", "echarts-gl"]);
const withPWA = require("next-pwa");

module.exports = withPlugins(
    [
        withTranspileModules,
        withPlaiceholder,
        withBundleAnalyzer,
        [withPWA, {
            pwa: {
                mode: 'production',
                dest: 'public',
                disable: process.env.NODE_ENV === 'development',
                buildExcludes: [
                    /\/*server\/middleware-chunks\/[0-9]*[a-z]*[A-Z]*\.js$/,
                    /middleware-manifest\.json$/,
                    /middleware-runtime\.js$/,
                    /_middleware\.js$/,
                    /^.+\\_middleware\.js$/,
                ],
            },
        }]],
    {
        reactStrictMode: true,
        compiler: {
            styledComponents: true
        }
    })
