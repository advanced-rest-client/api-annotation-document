[![Published on NPM](https://img.shields.io/npm/v/@api-components/api-annotation-document.svg)](https://www.npmjs.com/package/@api-components/api-annotation-document)

[![Build Status](https://travis-ci.org/advanced-rest-client/api-annotation-document.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/api-annotation-document)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/@advanced-rest-client/api-annotation-document)

## api-annotation-document

An element to render RAML annotations based on AMF data model.

## Version compatibility

This version only works with AMF model version 2 (AMF parser >= 4.0.0).
For compatibility with previous model version use `3.x.x` version of the component.

## Usage

### Installation
```
npm install --save @api-components/api-annotation-document
```

The element requires to set the `amf` property with the full generated AMF model to properly resolve compact JSON model. It also requires to set the `shape` property to whatever API property being currently documented (endpoint, method, type (including properties of a type which is also a type), security, security settings, and so on).

### In an html file

```html
<html>
  <head>
    <script type="module">
      import '@api-components/api-annotation-document/api-annotation-document.js';
    </script>
  </head>
  <body>
    <api-annotation-document></api-annotation-document>
    <script>
    {
      const model = await getAmfModelSomehow();
      const shape = computeCurrentShape(model, someId);
      const aad = document.querySelector('api-annotation-document');
      aad.amf = model;
      aad.shape = shape;
    }
    </script>
  </body>
</html>
```

### In a LitElement

```js
import { LitElement, html } from 'lit-element';
import '@api-components/api-annotation-document/api-annotation-document.js';

class SampleElement extends LitElement {
  render() {
    return html`
    <api-annotation-document
      .amf="${this.model}"
      .shape="${this.shape}"
    ></api-annotation-document>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

## Development

```sh
git clone https://github.com/advanced-rest-client/api-annotation-document
cd api-annotation-document
npm install
```

### Running the demo locally

```sh
npm start
```

### Running the tests
```sh
npm test
```
