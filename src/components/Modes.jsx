import React from 'react';
import ReactDOM from 'react-dom';

import ListMixin from '../mixins/ListMixin';
import SingleSelectionMixin from '../mixins/SingleSelectionMixin';


const Base =
  ListMixin(
  SingleSelectionMixin(
    React.Component
  ));


export default class Modes extends Base {

  constructor(props) {
    super(props);
    if (this.state.selectedIndex == null || this.state.selectedIndex === -1) {
      this.state = Object.assign({}, this.state, {
        selectedIndex: 0
      });
    }
  }

  itemProps(item, index) {
    const base = super.itemProps ? super.itemProps(item, index) : {};
    const display = index === this.state.selectedIndex ? '' : 'none';
    const style = Object.assign({}, base.style, { display }, item.props.style);
    return Object.assign({}, base, { style });
  }

  rootProps() {
    const base = super.rootProps ? super.rootProps() : {};
    const style = Object.assign({}, base.style, {
      'display': 'inline-block',
      'position': 'relative'
    });
    return Object.assign({}, base, { style });
  }

}
