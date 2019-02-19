import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import {AmfHelperMixin} from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
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
 * @polymer
 * @demo demo/index.html
 * @memberof ApiElements
 * @appliesMixin AmfHelperMixin
 */
class ApiAnnotationDocument extends AmfHelperMixin(PolymerElement) {
  static get template() {
    return html`
    <style>
    :host {
      display: block;
      color: var(--api-annotation-document-color, #616161);
      @apply --api-annotation-document;
    }

    :host([hidden]) {
      display: none;
    }

    .custom-prtoperty {
      margin: 12px 0;
    }

    .custom-prtoperty > span {
      display: block;
    }

    .name {
      font-weight: 500;
    }

    .scalar-value {
      display: block;
    }
    </style>
    <section class="custom-list" role="list">
      <template is="dom-repeat" items="[[customList]]">
        <div role="listitem" class="custom-prtoperty">
          <span class="name">[[_computeName(item)]]</span>
          <template is="dom-if" if="[[_hasValue(item)]]" data-has-value="">
            <span class="value">
              <template is="dom-if" if="[[_isScalar(item)]]">
                <span class="scalar-value">[[_scalarValue(item)]]</span>
              </template>
              <template is="dom-if" if="[[!_isScalar(item)]]">
                <template is="dom-repeat" items="[[_complexValue(item)]]">
                  <span class="scalar-value">[[item.label]]: [[item.value]]</span>
                </template>
              </template>
            </span>
          </template>
        </div>
      </template>
    </section>
`;
  }

  static get is() {return 'api-annotation-document';}
  static get properties() {
    return {
      /**
       * A property shape definition of AMF.
       * The element looks for `http://raml.org/vocabularies/document#customDomainProperties`
       * key in the property and renders custom properties view if any
       * property is defined.
       */
      shape: {
        type: Object,
        observer: '_shapeChanged'
      },
      /**
       * Computed value, true if any custom property has been found.
       */
      hasCustomProperties: {
        type: Boolean,
        notify: true,
        readOnly: true,
        value: false,
        observer: '_hasCustomChanged'
      },
      /**
       * List of custom properties in the shape.
       *
       * @type {Array<Object>}
       */
      customList: {
        type: Array,
        readOnly: true
      }
    };
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
    const key = this._getAmfKey(this.ns.raml.vocabularies.document + 'customDomainProperties');
    const custom = this._ensureArray(shape && shape[key]);
    const has = !!(custom && custom.length);
    this._setHasCustomProperties(has);
    if (!has) {
      return;
    }
    const keys = custom.map((item) => item['@id']);
    const properties = keys.map((key) => shape[key] || shape['amf://id' + key]);
    this._setCustomList(properties);
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
    return this._getValue(item, this.ns.raml.vocabularies.document + 'name');
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
    const key = this._getAmfKey(this.ns.raml.vocabularies.data + 'value');
    let value = item && item[key];
    if (!value) {
      return false;
    }
    if (value instanceof Array) {
      value = value[0];
    }
    return !this._hasType(value, this.ns.w3.xmlSchema + 'nil');
  }
  /**
   * Tests if value is a scalar value
   *
   * @param {Object} item AMF custom property definition
   * @return {Boolean}
   */
  _isScalar(item) {
    return this._hasType(item, this.ns.raml.vocabularies.data + 'Scalar');
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
    return this._getValue(item, this.ns.raml.vocabularies.data + 'value');
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
    const dataKey = this._getAmfKey(this.ns.raml.vocabularies.data);
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
}
window.customElements.define(ApiAnnotationDocument.is, ApiAnnotationDocument);
