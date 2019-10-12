/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/tools/tree/master/packages/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   api-annotation-document.js
 */


// tslint:disable:variable-name Describing an API that's defined elsewhere.
// tslint:disable:no-any describes the API as best we are able today

import {LitElement, html, css} from 'lit-element';

import {AmfHelperMixin} from '@api-components/amf-helper-mixin/amf-helper-mixin.js';

export {ApiAnnotationDocument};

declare namespace ApiElements {

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
   */
  class ApiAnnotationDocument extends
    AmfHelperMixin(
    Object) {

    /**
     * A property shape definition of AMF.
     * The element looks for `http://raml.org/vocabularies/document#customDomainProperties`
     * key in the property and renders custom properties view if any
     * property is defined.
     */
    shape: object|null|undefined;

    /**
     * Computed value, true if any custom property has been found.
     */
    readonly hasCustomProperties: boolean|null|undefined;
    _hasCustomProperties: any;

    /**
     * List of custom properties in the shape.
     */
    readonly customList: Array<object|null>|null;
    _customList: any;
    connectedCallback(): void;

    /**
     * Called when the shape property change.
     * Sets `hasCustomProperties` and `customList` properties.
     *
     * Note that for performance reasons, if the element determine that there's
     * no custom properties wit will not clear `customList`.
     * It will be updated only if tha vlue actually change.
     *
     * @param shape AMF shape or range property.
     */
    _shapeChanged(shape: object|null): void;

    /**
     * Hiddes/shows the element depending on the state
     *
     * @param has True if has ay property
     */
    _hasCustomChanged(has: Boolean|null): void;
    _computeName(item: any): any;

    /**
     * Tests if custom propery can have value.
     *
     * @param item AMF custom property definition
     */
    _hasValue(item: object|null): Boolean|null;

    /**
     * Tests if value is a scalar value
     *
     * @param item AMF custom property definition
     */
    _isScalar(item: object|null): Boolean|null;

    /**
     * Computes scalar value for the item.
     *
     * @param item AMF custom property definition
     */
    _scalarValue(item: object|null): String|null;

    /**
     * Computes complex (object) value for the custom property
     *
     * @param item AMF custom property definition
     */
    _complexValue(item: object|null): object|null;
    _renderItemValue(item: any): any;
    _renderItemComplexValue(item: any): any;
    _renderItem(item: any): any;
    render(): any;
  }
}

declare global {

  interface HTMLElementTagNameMap {
    "api-annotation-document": ApiElements.ApiAnnotationDocument;
  }
}
