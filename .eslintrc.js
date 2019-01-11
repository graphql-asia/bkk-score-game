module.exports = {
  parser: 'babel-eslint',
  extends: ['prettier', 'prettier/react'],
  plugins: ['prettier', 'graphql'],
  rules: {
    'prettier/prettier': 'error',
    'graphql/template-strings': [
      'error',
      {
        env: 'apollo',
        validators: 'all',
        schemaJson: require('./src/generated/schema.json'),
      },
    ],
  },
}
