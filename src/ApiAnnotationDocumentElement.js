/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
import { LitElement, html } from 'lit-element';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin';
import '@advanced-rest-client/arc-icons/arc-icon.js';
import elementStyles from './styles.js';

/**
 * `api-annotation-document`
 *
 * An element to render annotations (also known as custom properties)
 * from AMF model.
 *
 * Annotations are part of RAML language and API console supports it.
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
 * `--api-annotation-document` | Mixin applied to this element | `{}`
 * `--api-annotation-document-color` | Color of the custom property (annotation) documentation | `#616161`
 */
export class ApiAnnotationDocumentElement extends AmfHelperMixin(LitElement) {
  get styles() {
    return elementStyles;
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

  /**
   * Computed value, true if any custom property has been found.
   */
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

  /**
   * List of custom properties in the shape.
   */
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
    super.connectedCallback();
    if (this._hasCustomProperties === undefined) {
      this._hasCustomProperties = false;
    }
  }

  ensureObject(value) {
    return Array.isArray(value) ? value[0] : value;
  }

  /**
   * Called when the shape property change.
   * Sets `hasCustomProperties` and `customList` properties.
   *
   * Note that for performance reasons, if the element determine that there's
   * no custom properties wit will not clear `customList`.
   * It will be updated only if the value actually change.
   *
   * @param {any} shape AMF shape or range property.
   */
  _shapeChanged(shape) {
    const key = this._getAmfKey(this.ns.aml.vocabularies.document.customDomainProperties);
    const custom = this._ensureArray(shape && shape[key]);
    const has = !!(custom && custom.length);
    this._hasCustomProperties = has;
    if (!has) {
      return;
    }

    const idKey = this._getAmfKey('amf://id');
    const properties = custom.map((item) => {
      const k = item['@id'];
      const name = this._computeName(item);
      const nameKey = this._getAmfKey(this.ns.aml.vocabularies.core.extensionName);
      const object = this.ensureObject(shape[k] || shape[`amf://id${k}`] || shape[`${idKey}:${k}`])
      object[nameKey] = object[nameKey] || name;
      return object;
    });
    this._customList = properties;
  }

  /**
   * Hides/shows the element depending on the state
   *
   * @param {Boolean} has True if has ay property
   */
  _hasCustomChanged(has) {
    this.setAttribute('aria-hidden', String(!has));
    if (has) {
      if (this.hasAttribute('hidden')) {
        this.removeAttribute('hidden');
      }
    } else if (!this.hasAttribute('hidden')) {
      this.setAttribute('hidden', 'true');
    }
  }

  /**
   * @param {any} item 
   * @returns {string|undefined}
   */
  _computeName(item) {
    return /** @type string */ (this._getValue(item, this.ns.aml.vocabularies.core.extensionName));
  }

  /**
   * Tests if custom property can have value.
   *
   * @param {any} item AMF custom property definition
   * @returns {boolean}
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
    if (Array.isArray(value)) {
      [value] = value;
    }
    return !this._hasType(value, this.ns.w3.xmlSchema.nil);
  }

  /**
   * Tests if value is a scalar value
   *
   * @param {any} item AMF custom property definition
   * @return {boolean}
   */
  _isScalar(item) {
    return this._hasType(item, this.ns.aml.vocabularies.data.Scalar);
  }

  /**
   * Computes scalar value for the item.
   *
   * @param {any} item AMF custom property definition
   * @returns {string}
   */
  _scalarValue(item) {
    if (Array.isArray(item)) {
      [item] = item;
    }
    return /** @type string */ (this._getValue(item, this.ns.aml.vocabularies.data.value));
  }

  /**
   * Computes complex (object) value for the custom property
   *
   * @param {any} item AMF custom property definition
   * @returns {any[]}
   */
  _complexValue(item) {
    if (!item) {
      return undefined;
    }
    const data = [];
    const dataKey = this._getAmfKey(`${this.ns.raml.vocabularies.data  }`);
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
    return items.map((i) => html`<span class="scalar-value">${i.label}: ${i.value}</span>`);
  }

  _renderItem(item) {
    const hasValue = this._hasValue(item);
    const name = this._computeName(item);
    const value = hasValue ? this._renderItemValue(item) : '';
    return html`<style>${this.styles}</style>
    <div class="custom-property">
      <arc-icon class="info-icon" icon="infoOutline"></arc-icon>
      <div class="info-value">
        <span class="name">${name}</span>
        ${value}
      </div>
    </div>`;
  }

  render() {
    const list = this.customList;
    if (!list || !list.length) {
      return '';
    }
    const items = list.map((item) => this._renderItem(item));
    return html`${items}`;
  }
}
