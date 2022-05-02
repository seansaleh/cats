export default (config, env, helpers) => {
  const { cwd, isProd, isWatch, src, source } = env;

  const backgroundFileRegex = /generated-background\.svg$/i

  let { rule } = helpers.getRulesByMatchingFile(config, 'generated-background.svg')[0];
  rule.exclude = [
    backgroundFileRegex
  ].concat(rule.exclude || [])

  config.module.rules.push({
    test: backgroundFileRegex,
    loader: isProd
      ? require.resolve('file-loader')
      : require.resolve('url-loader'),
      options: {
        name: '[path][name].[ext]',
      },
  })
};