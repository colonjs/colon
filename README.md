<!-- README.md -->
<p align="center">
    <img src="logo.png" alt="colon">
</p>
<h1 align="center">colon:</h1>
<p align="center">Minimal, concise and blazing fast template engine.</p>
<p align="center">Server side render is coming.</p>
<p align="center">
    <a href="https://travis-ci.org/colonjs/colon">
        <img src="https://travis-ci.org/colonjs/colon.svg?branch=master" alt="Travis-ci">
    </a>
    <a href="https://www.npmjs.com/package/colon">
        <img src="https://img.shields.io/npm/v/colon.svg" alt="NPM Version">
    </a>
    <a href="https://www.npmjs.com/package/colon">
        <img src="https://img.shields.io/npm/dt/colon.svg" alt="NPM Downloads">
    </a>
    <a href="javascript:;">
        <img src="https://img.shields.io/github/size/colonjs/colon/dist/colon.min.js.svg" alt="size">
    </a>
    <a href="https://github.com/colonjs/colon/blob/master/LICENSE">
        <img src="https://img.shields.io/github/license/colonjs/colon.svg" alt="MIT License">
    </a>
</p>

### Usage

See [the website](https://colonjs.github.io/).

### Why colon

- `siwg`, `art-template`, `doT` ...

```html
<h1>{{ title }}</h1>
<ul>
{% for author in authors %}
    <li{% if loop.first %} class="first"{% endif %}>{{ author }}</li>
{% endfor %}
</ul>
```

- `colon`

```html
<h1>{{ title }}</h1>
<ul>
    <li :each="authors" :class="[index == 0 ? 'first' : '']">{{ item }}</li>
</ul>
```

`colon` has a more concise template syntax.

### License

Licensed under the [MIT License](https://github.com/colonjs/colon/blob/master/LICENSE) by 大板栗
