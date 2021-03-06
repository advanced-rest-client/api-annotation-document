import { LitElement } from 'lit-element';
import { html } from 'lit-html';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
import { ApiDemoPageBase } from '@advanced-rest-client/arc-demo-helper/ApiDemoPage.js';
import '@api-components/raml-aware/raml-aware.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@api-components/api-navigation/api-navigation.js';
import '@api-components/api-console-default-theme/api-console-default-theme.js';
import '../api-annotation-document.js';

class DemoElement extends AmfHelperMixin(LitElement) {}
window.customElements.define('demo-element', DemoElement);

export class DemoPage extends ApiDemoPageBase {
  get hasData() {
    return this._hasData;
  }

  set hasData(value) {
    this._setObservableProperty('hasData', value);
  }

  get shape() {
    return this._shape;
  }

  set shape(value) {
    this._setObservableProperty('shape', value);
  }

  get helper() {
    return document.getElementById('helper');
  }

  _navChanged(e) {
    const { selected, type } = e.detail;
    if (type === 'type') {
      this.setTypeData(selected);
      this.hasData = true;
    } else if (type === 'endpoint') {
      this.setEndpointData(selected);
      this.hasData = true;
    } else if (type === 'method') {
      this.setMethodData(selected);
      this.hasData = true;
    } else {
      this.hasData = false;
    }
  }

  setTypeData(id) {
    const declares = document.getElementById('helper')._computeDeclares(this.amf);
    const type = declares.find((item) => item['@id'] === id);
    if (!type) {
      console.error('Type not found');
      return;
    }
    this.shape = type;
  }

  setEndpointData(id) {
    const helper = this.helper;
    helper.amf = this.amf;
    const webApi = helper._computeWebApi(this.amf);
    this.shape = helper._computeEndpointModel(webApi, id);
  }

  setMethodData(id) {
    const helper = this.helper;
    helper.amf = this.amf;
    const webApi = helper._computeWebApi(this.amf);
    this.shape = helper._computeMethodModel(webApi, id);
  }

  _apiListTemplate() {
    return [
      ['demo-api', 'Demo API'],
      ['nill-annotation', 'Nil annotation'],
      ['spec-api', 'spec-api'],
    ].map(([file, label]) => html`
      <paper-item data-src="${file}-compact.json">${label} - compact model</paper-item>
      <paper-item data-src="${file}.json">${label}</paper-item>
      `);
  }


  contentTemplate() {
    return html`
    <demo-element id="helper" .amf="${this.amf}"></demo-element>
    ${this.hasData ?
      html`<api-annotation-document .amf="${this.amf}" .shape="${this.shape}"></api-annotation-document>` :
      html`<p>Select type in the navigation to see the demo.</p>`}
    `;
  }
}
const instance = new DemoPage();
instance.render();
window._demo = instance;
