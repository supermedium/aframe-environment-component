# ghpages

A command-line tool to easily deploy your current working branch to GitHub Pages.


## CLI Usage

```
Usage
  $ ghpages

Options
  -r, --repo    Repository (GitHub username, GitHub username/repo, full repo URL)
  -d, --domain  Domain name (for `CNAME` to create in GitHub Pages branch)
  -h, --help    Show help

Examples
  $ ghpages
  $ ghpages cvan
  $ ghpages cvan/blog
  $ ghpages git@github.com:cvan/blog.git
  $ ghpages -r cvan/blog -d blog.cvan.io
```


## License

[MIT](LICENSE)


## Credits

This utility mostly wraps the fantastic [`gh-pages` package](https://github.com/tschaub/gh-pages).
