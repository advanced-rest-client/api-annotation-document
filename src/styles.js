import { css } from 'lit-element';

export default css`
:host {
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
}
`;
