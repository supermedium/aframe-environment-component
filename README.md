# Stage

A simple way of setting up a whole basic environment, for demos, prototypes..

Just include `stage.js` in your .html:

```html
  <script src="stage.js"></script>
```

and add the component `stage` to an entity (or to the a-scene):

```html
  <a-entity stage></a-entity>
```

That's it! :)

## Parameters

You can customize the environment with the parameters below, like this:

```html
  <a-entity stage="sunPosition:1 5 -2; groundColor: #445"></a-entity>
```

Or even easier, you can press `ctrl-alt-i` to enter inspector mode, search for 'stage' in the filter box, tweak parameters and check in realtime, and copy them to clipboard.


| Parameter   | Default | Description |
|-------------|---------|-------------|
| groundColor | '#555'  | |
| sunPosition | '0 3 -1'| |
| autoLights  | true    | |
| gridType    | 'none'  | valid values: none, cross, squares, circles, checkerboard |
| gridColor   | '#ccc'  | |
| gridSpacing | 1.0     | |
| gridSize    | 10.0    | | 