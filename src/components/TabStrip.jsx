import classnames from 'classnames';
import React from 'react';
import ReactDOM from 'react-dom';

import ClickSelectionMixin from '../mixins/ClickSelectionMixin';
import DirectionSelectionMixin from '../mixins/DirectionSelectionMixin';
import KeyboardDirectionMixin from '../mixins/KeyboardDirectionMixin';
import KeyboardMixin from '../mixins/KeyboardMixin';
import LanguageDirectionMixin from '../mixins/LanguageDirectionMixin';
import ListMixin from '../mixins/ListMixin';
import SingleSelectionMixin from '../mixins/SingleSelectionMixin';


const Base =
  ClickSelectionMixin(
  DirectionSelectionMixin(
  KeyboardMixin(
  KeyboardDirectionMixin(
  LanguageDirectionMixin(
  ListMixin(
  SingleSelectionMixin(
    React.Component
  )))))));


export default class TabStrip extends Base {

  componentDidUpdate() {
    if (super.componentDidUpdate) { super.componentDidUpdate(); }

    // If the selectedIndex changes due to keyboard action within this
    // component, the old tab button might still have focus. Ensure the new
    // selected tab button has the focus.
    // REVIEW: Feels weird to be using both this.root.children and this.items.
    const selectedChild = this.root.children[this.state.selectedIndex];
    if (selectedChild &&
        this.root.contains(document.activeElement) &&
        selectedChild !== document.activeElement) {
      selectedChild.focus();
    }
  }

  get defaults() {
    return Object.assign({}, super.defaults, {
      orientation: 'horizontal',
      selectionRequired: true,
      tabAlign: 'start',
      tabIndex: null,
      tabPosition: 'top'
    });
  }

  keydown(event) {

    let handled;

    // Let user select a tab button with Enter or Space.
    switch (event.keyCode) {
      case 13: /* Enter */
      case 32: /* Space */
        const index = this.indexOfTarget(event.target);
        if (index !== this.selectedIndex) {
          this.updateSelectedIndex(index);
          handled = true;
        }
        break;
    }

    // Prefer mixin result if it's defined, otherwise use base result.
    return handled || (super.keydown && super.keydown(event)) || false;
  }

  itemProps(item, index) {
    const base = super.itemProps ? super.itemProps(item, index) : {};

    const role = this.props.tabButtonRole || 'tab';

    const itemStyle = {
      'cursor': 'pointer',
      'fontFamily': 'inherit',
      'fontSize': 'inherit',
      // 'outline': 'none',
      // 'position': 'relative',
      'WebkitTapHighlightColor': 'transparent',
    };

    const tabAlign = this.props.tabAlign || this.defaults.tabAlign;
    const tabPosition = this.props.tabPosition || this.defaults.tabPosition;

    const selected = index === this.state.selectedIndex;

    const className = classnames(
      item.props.className,
      base.className,
      {
        selected
      }
    );

    const style = Object.assign(
      {},
      base.style,
      itemStyle
    );

    const isComponent = typeof item.type === 'function';
    const componentProps = {
      index,
      selected,
      tabAlign,
      tabPosition
    };

    return Object.assign(
      {},
      base,
      {
        'aria-selected': selected,
        className,
        role,
        style
      },
      isComponent && componentProps
    );
  }

  // TabStrip orientation depends on tabPosition property.
  get orientation() {
    const tabPosition = this.props.tabPosition || this.defaults.tabPosition;
    return tabPosition === 'top' || tabPosition === 'bottom' ?
      'horizontal' :
      'vertical';
  }

  rootProps() {
    const base = super.rootProps ? super.rootProps() : {};
    
    const tabPosition = this.props.tabPosition || this.defaults.tabPosition;
    const lateralPosition = tabPosition === 'left' || tabPosition === 'right';
    const lateralStyle = {
      'flexDirection': 'column'
    };

    const tabAlign = this.props.tabAlign || this.defaults.tabAlign;
    const alignStyles = {
      'center': {
        'justifyContent': 'center'
      },
      'end': {
        'justifyContent': 'flex-end'
      },
      'start': {
        'justifyContent': 'flex-start'
      }
      // No style needed for "stretch"
    };
    const alignStyle = alignStyles[tabAlign];

    const style = Object.assign(
      {},
      base.style,
      {
        'display': 'flex',
      },
      lateralPosition && lateralStyle,
      alignStyle
    );
    const role = 'tablist';
    return Object.assign({}, base, {
      role,
      style
    });
  }

}
