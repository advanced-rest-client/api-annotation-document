import { html } from 'lit-html';
import { ApiDemoPage } from '@advanced-rest-client/arc-demo-helper';
import '@anypoint-web-components/anypoint-styles/colors.js';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
import '@api-components/api-console-default-theme/api-console-default-theme.js';
import '../api-annotation-document.js';

export class DemoPage extends ApiDemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'shape'
    ]);
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
    const declares = this._computeDeclares(this.amf);
    const type = declares.find((item) => item['@id'] === id);
    if (!type) {
      console.error('Type not found');
      return;
    }
    this.shape = type;
  }

  setEndpointData(id) {
    const webApi = this._computeWebApi(this.amf);
    this.shape = this._computeEndpointModel(webApi, id);
  }

  setMethodData(id) {
    const webApi = this._computeWebApi(this.amf);
    this.shape = this._computeMethodModel(webApi, id);
  }

  _apiListTemplate() {
    return [
      ['demo-api', 'Demo API'],
      ['nill-annotation', 'Nil annotation'],
      ['spec-api', 'spec-api'],
    ].map(([file, label]) => html`
      <anypoint-item data-src="${file}-compact.json">${label} - compact model</anypoint-item>
      <anypoint-item data-src="${file}.json">${label}</anypoint-item>
      `);
  }

  contentTemplate() {
    return html`
    ${this.hasData ?
      html`<api-annotation-document .amf="${this.amf}" .shape="${this.shape}"></api-annotation-document>` :
      html`<p>Select type in the navigation to see the demo.</p>`}
    `;
  }
}
const instance = new DemoPage();
instance.render();
