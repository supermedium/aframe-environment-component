var test = require('tape')
var fmt = require('../').transform

var classes = [
  {
    program: [
      'export class com extends Component {',
      '  render() {}',
      '}',
      ''
    ].join('\n'),

    expected: [
      'export class com extends Component {',
      '  render () {}',
      '}',
      ''
    ].join('\n'),

    msg: 'class methods should have correct spacing',
    issues: [
      'https://github.com/maxogden/standard-format/issues/126',
      'https://github.com/millermedeiros/esformatter/issues/384',
      'https://github.com/maxogden/standard-format/issues/111',
      'https://github.com/maxogden/standard-format/issues/75'
    ]
  },
  {
    program: [
      'array.map(el => ({',
      'inc: el.val + 1,',
      'dec: el.val - 1',
      '}))',
      ''
    ].join('\n'),

    expected: [
      'array.map(el => ({',
      '  inc: el.val + 1,',
      '  dec: el.val - 1',
      '}))',
      ''
    ].join('\n'),

    msg: 'arrow functions correctly indent',
    issues: [
      'https://github.com/maxogden/standard-format/issues/127'
    ]
  }
]

test('ES6 Classes', function (t) {
  t.plan(classes.length)
  classes.forEach(function (obj) {
    t.equal(fmt(obj.program), obj.expected, obj.msg)
    console.log('issues:\n' + obj.issues.join('\n'))
  })
})
