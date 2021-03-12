import { LitElement, TemplateResult, CSSResult } from 'lit-element';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
import '@advanced-rest-client/arc-icons/arc-icon.js';

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
 * @fires has-custom-properties-changed
 */
export class ApiAnnotationDocumentElement extends AmfHelperMixin(LitElement) {
  get styles(): CSSResult;

  /**
   * A property shape definition of AMF.
   * The element looks for `http://raml.org/vocabularies/document#customDomainProperties`
   * key in the property and renders custom properties view if any
   * property is defined.
   */
  shape: any;
  /**
   * Computed value, true if any custom property has been found.
   */
  get hasCustomProperties(): boolean;

  _hasCustomProperties: boolean;

  /**
   * List of custom properties in the shape.
   */
  get customList(): any[];

  _customList: any;

  connectedCallback(): void;

  ensureObject(value: any): any;

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
  _shapeChanged(shape: any): void;

  /**
   * Hides/shows the element depending on the state
   *
   * @param has True if has ay property
   */
  _hasCustomChanged(has: boolean): void;

  _computeName(item: any): string|undefined;

  /**
   * Tests if custom property can have value.
   *
   * @param item AMF custom property definition
   */
  _hasValue(item: any): boolean;

  /**
   * Tests if value is a scalar value
   *
   * @param item AMF custom property definition
   */
  _isScalar(item: any): boolean;

  /**
   * Computes scalar value for the item.
   *
   * @param item AMF custom property definition
   */
  _scalarValue(item: any): string;

  /**
   * Computes complex (object) value for the custom property
   *
   * @param item AMF custom property definition
   */
  _complexValue(item: any): any[];

  _renderItemValue(item: any): TemplateResult|string;

  _renderItemComplexValue(item: any): TemplateResult|string;

  _renderItem(item: any): TemplateResult;

  render(): TemplateResult;
}
