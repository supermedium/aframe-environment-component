karma-chai-shallow-deep-equal
==============================

chai-shallow-deep-equal for Karma

## Installation

```
npm install karma-shallow-deep-equals --save-dev
```

Add ```chai-shallow-deep-equal``` to ```frameworks``` in your Karma configuration:

```js
module.exports = function(config) {
  'use strict';
  config.set({
    #...
    frameworks: ['chai', 'chai-shallow-deep-equal'],
    #...
  });
}
```

### Example

See documentation of ```chai-shallow-deep-equal```: https://github.com/michelsalib/chai-shallow-deep-equal
