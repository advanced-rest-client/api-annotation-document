import { LitElement, html, css } from 'lit-element';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
import { infoOutline } from '@advanced-rest-client/arc-icons/ArcIcons.js';
/**
 * `api-annotation-document`
 *
 * An element to render annotations (also known as custom properties)
 * from AMF model.
 *
 * Anotations are part of RAML language and API console supports it.
 * The element looks for annotations in model and renders them.
 *
 * It hides itself from the view if there's no annotations.
 *
 * ## Styling
 *
 * `<api-annotation-document>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--api-annotation-document` | Mixin applied to this elment | `{}`
 * `--api-annotation-document-color` | Color of the custom property (annotation) documentation | `#616161`
 *
 * @customElement
 * @demo demo/index.html
 * @memberof ApiElements
 * @appliesMixin AmfHelperMixin
 */
export class ApiAnnotationDocument extends AmfHelperMixin(LitElement) {
  get styles() {
    return css`:host {
      display: block;
      color: var(--api-annotation-document-color, #616161);
    }

    :host([hidden]) {
      display: none;
    }

    .custom-property {
      border-left: 3px var(--api-annotation-accent-color, #1976D2) solid;
      border-radius: 2px;
      background-color: var(--api-annotation-background-color, #F5F7F9);
      padding: 16px 0;
      margin: 20px 0;
      display: flex;
    }

    .custom-property > span {
      display: block;
    }

    .name {
      font-weight: 500;
    }

    .scalar-value {
      display: block;
      margin-top: 3px;
    }

    .custom-list {
      padding: 0;
      margin: 0;
      list-style: none;
    }

    .info-icon {
      margin: 0 12px;
      fill: var(--api-annotation-accent-color, #1976D2);
      width: 24px;
      height: 24px;
    }`;
  }

  static get properties() {
    return {
      /**
       * A property shape definition of AMF.
       * The element looks for `http://raml.org/vocabularies/document#customDomainProperties`
       * key in the property and renders custom properties view if any
       * property is defined.
       */
      shape: { type: Object },
      /**
       * Computed value, true if any custom property has been found.
       */
      hasCustomProperties: { type: Boolean },
      /**
       * List of custom properties in the shape.
       *
       * @type {Array<Object>}
       */
      customList: { type: Array }
    };
  }

  get shape() {
    return this._shape;
  }

  set shape(value) {
    const oldValue = this._shape;
    if (oldValue === value) {
      return;
    }
    this._shape = value;
    this.requestUpdate('shape', oldValue);
    this._shapeChanged(value);
  }

  get hasCustomProperties() {
    return this.__hasCustomProperties;
  }

  get _hasCustomProperties() {
    return this.__hasCustomProperties;
  }

  set _hasCustomProperties(value) {
    const oldValue = this.__hasCustomProperties;
    if (oldValue === value) {
      return;
    }
    this.__hasCustomProperties = value;
    this._hasCustomChanged(value);
    this.dispatchEvent(new CustomEvent('has-custom-properties-changed', {
      composed: true,
      detail: {
        value
      }
    }));
  }

  get customList() {
    return this.__customList;
  }

  get _customList() {
    return this.__customList;
  }

  set _customList(value) {
    const oldValue = this.__customList;
    if (oldValue === value) {
      return;
    }
    this.__customList = value;
    this.requestUpdate('customList', oldValue);
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    if (this._hasCustomProperties === undefined) {
      this._hasCustomProperties = false;
    }
  }

  /**
   * Called when the shape property change.
   * Sets `hasCustomProperties` and `customList` properties.
   *
   * Note that for performance reasons, if the element determine that there's
   * no custom properties wit will not clear `customList`.
   * It will be updated only if tha vlue actually change.
   *
   * @param {Object} shape AMF shape or range property.
   */
  _shapeChanged(shape) {
    const key = this._getAmfKey(this.ns.aml.vocabularies.document.customDomainProperties);
    const custom = this._ensureArray(shape && shape[key]);
    const has = !!(custom && custom.length);
    this._hasCustomProperties = has;
    if (!has) {
      return;
    }
    const keys = custom.map((item) => item['@id']);
    const properties = keys.map((key) => shape[key] || shape['amf://id' + key]);
    this._customList = properties;
  }
  /**
   * Hiddes/shows the element depending on the state
   *
   * @param {Boolean} has True if has ay property
   */
  _hasCustomChanged(has) {
    this.setAttribute('aria-hidden', !has);
    if (has) {
      if (this.hasAttribute('hidden')) {
        this.removeAttribute('hidden');
      }
    } else {
      if (!this.hasAttribute('hidden')) {
        this.setAttribute('hidden', true);
      }
    }
  }

  _computeName(item) {
    return this._getValue(item, this.ns.aml.vocabularies.document.name);
  }
  /**
   * Tests if custom propery can have value.
   *
   * @param {Object} item AMF custom property definition
   * @return {Boolean}
   */
  _hasValue(item) {
    if (!this._isScalar(item)) {
      return true;
    }
    const key = this._getAmfKey(this.ns.aml.vocabularies.data.value);
    let value = item && item[key];
    if (!value) {
      return false;
    }
    if (value instanceof Array) {
      value = value[0];
    }
    return !this._hasType(value, this.ns.w3.xmlSchema.nil);
  }
  /**
   * Tests if value is a scalar value
   *
   * @param {Object} item AMF custom property definition
   * @return {Boolean}
   */
  _isScalar(item) {
    return this._hasType(item, this.ns.aml.vocabularies.data.Scalar);
  }
  /**
   * Computes scalar value for the item.
   *
   * @param {Object} item AMF custom property definition
   * @return {String}
   */
  _scalarValue(item) {
    if (item instanceof Array) {
      item = item[0];
    }
    return this._getValue(item, this.ns.aml.vocabularies.data.value);
  }
  /**
   * Computes complex (object) value for the custom property
   *
   * @param {Object} item AMF custom property definition
   * @return {Object}
   */
  _complexValue(item) {
    if (!item) {
      return;
    }
    const data = [];
    const dataKey = this._getAmfKey(this.ns.raml.vocabularies.data + '');
    const len = dataKey.length;
    Object.keys(item).forEach((key) => {
      if (key.indexOf(dataKey) === -1) {
        return;
      }
      let label = key.substr(len);
      if (label[0] === ':') {
        // compact model does that
        label = label.substr(1);
      }
      data.push({
        value: this._scalarValue(item[key]),
        label
      });
    });
    return data;
  }

  _renderItemValue(item) {
    const isScalar = this._isScalar(item);
    const value = isScalar ? this._scalarValue(item) : this._renderItemComplexValue(item);
    if (!value || value === 'nil') {
      return '';
    }
    return html`<span class="value">
      ${isScalar ?
        html`<span class="scalar-value">${value}</span>` :
        value}
    </span>`;
  }

  _renderItemComplexValue(item) {
    const items = this._complexValue(item);
    if (!items || !items.length) {
      return '';
    }
    return items.map((item) => html`<span class="scalar-value">${item.label}: ${item.value}</span>`);
  }

  _renderItem(item) {
    const hasValue = this._hasValue(item);
    const name = this._computeName(item);
    const value = hasValue ? this._renderItemValue(item) : '';
    if (!name && !value) {
      return '';
    }
    return html`<style>${this.styles}</style>
    <div class="custom-property">
      <div class="info-icon">${infoOutline}</div>
      <div class="info-value">
        ${name ? html`<span class="name">${name}</span>` : ''}
        ${value}
      </div>
    </div>`;
  }

  render() {
    const list = this.customList;
    if (!list || !list.length) {
      return;
    }
    const items = list.map((item) => this._renderItem(item));
    return html`${items}`;
  }
}
window.customElements.define('api-annotation-document', ApiAnnotationDocument);
