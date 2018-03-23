# karma-env-preprocessor

> Preprocessor which makes environment variables available to your tests.

## Installation

The easiest way is to keep `karma-env-preprocessor` as a devDependency in your `package.json`.
```json
{
  "devDependencies": {
    "karma": "~0.10",
    "karma-env-preprocessor": "~0.1"
  }
}
```

You can simple do it by:
```bash
npm install karma-env-preprocessor --save-dev
```

## Configuration
Any files you preprocess using this plugin will be affected, e.g for all JavaScript files:
```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    preprocessors: {
      '**/*.js': ['env']
    },

    envPreprocessor: [
      'PATH',
      'HOME'
    ]
  });
};
```

## How does it work ?

This preprocessor uses `process.env` to read the value of each environment variable specified in `envPreprocessor` and publishes them in the global `window.__env__`, so you can read these values in your tests.

For example, the above configuration will be served as:
```js
window.__env__ = window.__env__ || []
window.__env__['PATH'] = '/usr/sbin:/usr/bin:/sbin:/bin';
window.__env__['HOME'] = '/home/jsok';
```

----

For more information on Karma see the [homepage].


[homepage]: http://karma-runner.github.com
