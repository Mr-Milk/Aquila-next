const withPlugins = require('next-compose-plugins')
const {withPlaiceholder} = require("@plaiceholder/next");
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})
const withTranspileModules = require("next-transpile-modules")(["echarts", "zrender"]);
const withPWA = require("next-pwa");
//const withWorker = require('worker-plugin');

// const nextConfig = {
//     webpack: (config, {isServer}) => {
//
//         config.reactStrictMode = true
//         config.images.domains.push('www.um.edu.mo')
//
//         // if (!isServer) {
//         //     config.plugins.push(
//         //         new withWorker({
//         //             // use "self" as the global object when receiving hot updates.
//         //             globalObject: "self",
//         //         })
//         //     );
//         // }
//
//
//         return config;
//     },
// };

module.exports = withPlugins(
    [
        withPlaiceholder,
        withBundleAnalyzer,
        withTranspileModules,
        [withPWA, {
                pwa: {
                    mode: 'production',
                    dest: 'public',
                    disable: process.env.NODE_ENV === 'development',
                },
    }]],
    {
        reactStrictMode: true,
    })
