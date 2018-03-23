var test = require('tape')
var fmt = require('../').transform

var noops = [
  {
    program: [
      'export default class Foo extends Component {',
      '  renderPartial () {',
      '    return this.props.bar.map((item) => {',
      '      return <Bar key={item.foo} data={item} />;',
      '    });',
      '  }',
      '};',
      ''
    ].join('\n'),

    msg: 'Keep indentation for multiple return statements with JSX'
  },
  {
    program: [
      'export class Foo extends React.Component {',
      '  render () {',
      '    return (',
      '    <div></div>',
      '    );',
      '  }',
      '};',
      ''
    ].join('\n'),
    msg: 'Preserve indendation on JSX blocks',
    issues: ['https://github.com/maxogden/standard-format/issues/99']
  },
  {
    program: [
      'export class Foo extends React.Component {',
      '  render () {',
      '    return (',
      '    <div>',
      '      <span foo={bar} bar={baz} beep={boop} />',
      '    </div>',
      '    );',
      '  }',
      '};',
      ''
    ].join('\n'),
    msg: 'Preserve indendation on JSX blocks with parameters',
    issues: ['https://github.com/maxogden/standard-format/issues/99']
  },
  {
    program: [
      'export class Foo extends React.Component {',
      '  render () {',
      '    return (',
      '    <div>',
      '      <span',
      '        foo={bar}',
      '        bar={baz}',
      '        maxArgs={four}',
      '        beep={boop} />',
      '    </div>',
      '    );',
      '  }',
      '};',
      ''
    ].join('\n'),
    msg: '4+ jsx args are multilined and aligned',
    issues: ['https://github.com/maxogden/standard-format/issues/99']
  }
]

test('jsx noop', function (t) {
  t.plan(noops.length)
  noops.forEach(function (obj) {
    t.equal(fmt(obj.program), obj.program, obj.msg)
  })
})
