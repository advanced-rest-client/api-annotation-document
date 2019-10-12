import { fixture, assert, nextFrame, html } from '@open-wc/testing';
import { AmfLoader } from './amf-loader.js';
import '../api-annotation-document.js';

describe('<api-annotation-document>', () => {
  async function basicFixture(amf) {
    return (await fixture(html`
      <api-annotation-document .amf="${amf}"></api-annotation-document>`));
  }

  function getType(element, name) {
    const declares = element._computeDeclares(element.amf);
    for (let i = 0, len = declares.length; i < len; i++) {
      const typeName = element._getValue(declares[i], element.ns.w3.shacl.name);
      if (typeName && name === typeName) {
        return declares[i];
      }
    }
  }

  describe('a11y', () => {
    let element;
    let amf;
    before(async () => {
      amf = await AmfLoader.load();
    });

    beforeEach(async () => {
      element = await basicFixture();
      element.amf = amf;
      element.shape = getType(element, 'ComplexAnnotations');
      await nextFrame();
    });

    it('is accessible', async () => {
      await assert.isAccessible(element);
    });
  });

  [
    ['Full data model', false],
    ['Compact model', true]
  ].forEach((item) => {
    describe(item[0], () => {
      describe('Model computations', () => {
        let amfModel;
        before(async () => {
          amfModel = await AmfLoader.load(item[1]);
        });

        let element;
        beforeEach(async () => {
          element = await basicFixture(amfModel);
        });

        it('Computes hasCustomProperties when no annotations', () => {
          element.shape = getType(element, 'NoAnnotations');
          assert.isFalse(element.hasCustomProperties);
        });

        it('Computes hasCustomProperties when has annotations', () => {
          element.shape = getType(element, 'ComboType');
          assert.isTrue(element.hasCustomProperties);
        });

        it('Computes customList', () => {
          element.shape = getType(element, 'ComboType');
          assert.typeOf(element.customList, 'array');
          assert.lengthOf(element.customList, 3);
        });

        // APIMF-1710
        it.skip('Renders nil annotation', async () => {
          element.shape = getType(element, 'notRequiredRepeatable');
          await nextFrame();
          const node = element.shadowRoot.querySelectorAll('.custom-property')[0];
          assert.ok(node, 'Annotation container is rendered');
          const label = node.querySelector('.name');
          assert.ok(label, 'Annotation label is rendered');
          const labelValue = label.innerText.toLowerCase();
          assert.equal(labelValue, 'annotationtest');
        });

        // APIMF-1710
        it('ignores annotation that has no name and value', async () => {
          element.shape = getType(element, 'notRequiredRepeatable');
          await nextFrame();
          const node = element.shadowRoot.querySelectorAll('.custom-property')[0];
          assert.notOk(node);
        });
        // APIMF-1710
        it.skip('Nil annotation does not have value', async () => {
          element.shape = getType(element, 'notRequiredRepeatable');
          await nextFrame();
          const node = element.shadowRoot.querySelector('.custom-property');
          assert.ok(node, 'Annotation container is rendered');
          const value = node.querySelector('.value');
          assert.notOk(value, 'Annotation value is not rendered');
        });

        it('Renders scalar annotation', async () => {
          element.shape = getType(element, 'ErrorResource');
          await nextFrame();
          const node = element.shadowRoot.querySelector('.custom-property');
          assert.ok(node, 'Annotation container is rendered');
          // APIMF-1710
          // const label = node.querySelector('.name');
          // assert.ok(label, 'Annotation label is rendered');
          // const labelValue = label.innerText.toLowerCase();
          // assert.equal(labelValue, 'deprecated');
          const value = node.querySelector('.value');
          assert.ok(value, 'Annotation value is rendered');
          const scalarList = node.querySelectorAll('.scalar-value');
          assert.equal(scalarList.length, 1, 'Scalar value is rendered');
        });

        it('Renders complex annotation', async () => {
          element.shape = getType(element, 'ComplexAnnotations');
          await nextFrame();
          const node = element.shadowRoot.querySelector('.custom-property');
          assert.ok(node, 'Annotation container is rendered');
          // APIMF-1710
          // const label = node.querySelector('.name');
          // assert.ok(label, 'Annotation label is rendered');
          // const labelValue = label.innerText.toLowerCase();
          // assert.equal(labelValue, 'clearancelevel');
          const value = node.querySelector('.value');
          assert.ok(value, 'Annotation value is rendered');
          const scalarList = node.querySelectorAll('.scalar-value');
          assert.equal(scalarList.length, 2, 'Scalar values list is rendered');
        });
      });
    });
  });

  describe('_hasCustomChanged()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Sets aria-hidden attribute when no custom properties', () => {
      element._hasCustomChanged(false);
      assert.equal(element.getAttribute('aria-hidden'), 'true');
    });

    it('Sets aria-hidden attribute when no custom properties', () => {
      element._hasCustomChanged(true);
      assert.equal(element.getAttribute('aria-hidden'), 'false');
    });

    it('Removes hidden attribute', () => {
      element.setAttribute('hidden', '');
      element._hasCustomChanged(true);
      assert.isFalse(element.hasAttribute('hidden'));
    });

    it('Sets hidden attribute', () => {
      element._hasCustomChanged(false);
      assert.isTrue(element.hasAttribute('hidden'));
    });
  });
});
