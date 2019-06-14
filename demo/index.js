import { LitElement } from 'lit-element';
import { html, render } from 'lit-html';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
import '@api-components/raml-aware/raml-aware.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@api-components/api-navigation/api-navigation.js';
import '@api-components/api-console-default-theme/api-console-default-theme.js';
import '../api-annotation-document.js';

class DemoElement extends AmfHelperMixin(LitElement) {}
window.customElements.define('demo-element', DemoElement);

export class DemoPage {
  constructor() {
    this._apiChanged = this._apiChanged.bind(this);
    this._navChanged = this._navChanged.bind(this);

    window.addEventListener('api-navigation-selection-changed', this._navChanged);
    setTimeout(() => {
      document.getElementById('apiList').selected = 0;
    });
  }

  get amfModel() {
    return this._amfModel;
  }

  set amfModel(value) {
    this._setObservableProperty('amfModel', value);
  }

  get hasType() {
    return this._hasType;
  }

  set hasType(value) {
    this._setObservableProperty('hasType', value);
  }

  get shape() {
    return this._shape;
  }

  set shape(value) {
    this._setObservableProperty('shape', value);
  }

  _setObservableProperty(prop, value) {
    const key = '_' + prop;
    if (this[key] === value) {
      return;
    }
    this[key] = value;
    this.render();
  }

  _apiChanged(e) {
    const file = e.target.selectedItem.dataset.src;
    this._loadFile(file);
  }

  _loadFile(file) {
    fetch('./' + file)
    .then((response) => response.json())
    .then((data) => {
      this.amfModel = data;
    });
  }

  _navChanged(e) {
    const { selected, type } = e.detail;
    if (type === 'type') {
      this.setTypeData(selected);
      this.hasType = true;
    } else {
      this.hasType = false;
    }
  }

  setTypeData(id) {
    const declares = document.getElementById('helper')._computeDeclares(this.amfModel);
    const type = declares.find((item) => item['@id'] === id);
    if (!type) {
      console.error('Type not found');
      return;
    }
    this.shape = type;
  }

  apiListTemplate() {
    return html`
    <paper-item data-src="demo-api.json">Demo api</paper-item>
    <paper-item data-src="demo-api-compact.json">Demo api - compact version</paper-item>
    `;
  }

  render() {
    render(html`
    <raml-aware .api="${this.amfModel}" scope="model"></raml-aware>
    <header>
      <paper-dropdown-menu label="Select demo endpoint">
        <paper-listbox slot="dropdown-content" id="apiList" @selected-changed="${this._apiChanged}">
        ${this.apiListTemplate()}
        </paper-listbox>
      </paper-dropdown-menu>
    </header>
    <div class="centered" role="main">
      <api-navigation aware="model" types-opened></api-navigation>
      ${this.hasType ?
        html`<api-annotation-document .amf-model="${this.amfModel}" .shape="${this.shape}"></api-annotation-document>` :
        html`<p>Select type in the navigation to see the demo.</p>`}
    </div>
    <demo-element id="helper" .amf-model="${this.amfModel}"></demo-element>`, document.querySelector('#demo'));
  }
}
const instance = new DemoPage();
instance.render();
window._demo = instance;
