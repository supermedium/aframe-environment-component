# aframe-environment-component

A simple way of setting up a whole basic environment for your
[A-Frame](http://aframe.io) VR scene.

![gif](https://github.com/feiss/aframe-environment-component/blob/master/assets/aframeenvironment.gif?raw=true)

Make sure you are using __A-Frame 0.6.0__ or later. Then just include `aframe-environment-component.js` in your HTML:

```html
  <script src="https://unpkg.com/aframe-environment-component@1.1.0/dist/aframe-environment-component.min.js"></script>
```

and add the `environment` component to an entity:

```html
  <a-entity environment></a-entity>
```

That's it! :)


## Presets

The previous code will setup a default scene, but you have a bunch of already predefined presets to choose from, using the `preset` parameter, like this:


```html
  <a-entity environment="preset: <name of the preset>"></a-entity>
```

You can view and try all the presets in the **[aframe-environment-component Test Page](http://feiss.github.io/aframe-environment-component/)**. The current list of presets are listed in the next section.


## Parameters

Apart from using a preset, you can tweak the environment with many parameters, like this:

```html
  <a-entity environment="lightPosition: 1 5 -2; groundColor: #445"></a-entity>
```

You can also select a preset but change some of its parameters:
```html
  <a-entity environment="preset: forest; groundColor: #445; grid: cross"></a-entity>
```

This is the list of the available parameters.


| Parameter   | Default | Description |
|-------------|---------|-------------|
| **active**  | true    | Show/hides the component. Use this instead of using the `visible` attribute |
| **preset**      | 'default'  | Valid values: `none`, `default`, `contact`, `egypt`, `checkerboard`, `forest`, `goaland`, `yavapai`, `goldmine`, `threetowers`, `poison`, `arches`, `tron`, `japan`, `dream`, `volcano`, `starry`, `osiris` |
| **seed**        | 1       | Seed for randomization. If you don't like the layout of the elements, try another value for the seed.  |
| **skyType**     | 'atmosphere' | Valid values: `color`, `gradient`, `atmosphere` |
| **skyColor**    |         | When `skyType` is `color` or  `gradient`, it sets the main sky color |
| **horizonColor**|         | When `skyType` is `gradient`, it sets the color of the sky near the horizon |
| **lighting**      | 'distant'   | Valid values: `none`, `distant`, `point`. A hemisphere light and a key light (directional or point) are added to the scene automatically when using the component. Use `none` if you don't want this automatic lighting set being added. The color and intensity are estimated automatically. |
| **shadow**  | false | Shadows on/off. Sky light casts shadows on the ground of all those objects with `shadow` component applied |
| **shadowSize** | 10 | Shadows size |
| **lightPosition** | 0 1 -0.2 | Position of the main light. If `skyType` is `atmospheric`, only the orientation matters (is a directional light) and it can turn the scene into night when lowered towards the horizon. |
| **fog**      |  0    | Amount of fog (0 = none, 1 = full fog). The color is estimated automatically. |
| **flatShading** | false | Whether to show everything smoothed (false) or polygonal (true). |
| **playArea** |  1    | Radius of the area in the center reserved for the player and the gameplay. The ground is flat in there and no objects are placed inside.|
| **ground**  | 'hills' | Valid values: `none`, `flat`, `hills`, `canyon`, `spikes`, `noise`. Orography style. |
| **groundYScale** | 3  | Maximum height (in meters) of ground's features (hills, mountains, peaks..) |
| **groundTexture**| 'none' | Valid values: `none`, `checkerboard`, `squares`, `walkernoise`|
| **groundColor** | '#553e35'  | Main color of the ground |
| **groundColor2**| '#694439'  | Secondary color of the ground. Used for textures, ignored if `groundTexture` is `none` |
| **dressing** | 'none' | Valid values: `none`, `cubes`, `pyramids`, `cylinders`, `towers`, `mushrooms`, `trees`, `apparatus`, `torii`. Dressing is the term we use here for the set of additional objects that are put on the ground for decoration. |
| **dressingAmount** | 10  | Number of objects used for dressing |
| **dressingColor** | '#795449' | Base color of dressing objects |
| **dressingScale** | 5   | Height (in meters) of dressing objects |
| **dressingVariance** | '1 1 1' | Maximum x,y,z meters to randomize the size and rotation of each dressing object. Use `0 0 0` for no variation in size nor rotation |
| **dressingUniformScale** | true | If `false`, a different value is used for each coordinate x, y, z in the random variance of size.|
| **grid**    | 'none'  | Valid values: `none`, `1x1`, `2x2`, `crosses`, `dots`, `xlines`, `ylines`. 1x1 and 2x2 are rectangular grids of 1 and 2 meters side, respectively.  |
| **gridColor** | '#ccc' | Color of the grid. |


The best way to work with them is to press `ctrl-alt-i` to open the [inspector](https://aframe.io/docs/master/introduction/visual-inspector-and-dev-tools.html#a-frame-inspector), search for 'environment' in the filter box and select it, and tweak the parameters while checking the changes in realtime. When you are happy, you can use the `Copy attributes` button or even better, copy the attributes logged in the browser's dev tools console.

## Performance

The main idea of this component is to have a complete and visually interesting environment by just including one .js file, with no extra includes or requests. This requires to store all the assets inside the js or (in most of cases) to procedurally generate them. Despite of the computing time and increased file size, both options are normally faster than requesting and waiting for additional textures or model files.

Apart from the parameter `dressingAmount`, there is not much difference among different values in parameters in terms of performance. Just keep `dressingAmount` value under watch and lower it if the performance is not optimal.

## Help and contact

PRs are appreciated, issues are welcomed. For any question, ping @feiss at [aframevr in Slack](https://aframe.io/slack-invite) or [Discord](https://supermedium.com/discord).
