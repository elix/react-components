import React from 'react';
import ReactDOM from 'react-dom';

import Tabs from '../../../src/components/Tabs';
import SereneTabButton from './SereneTabButton';


export default function SereneTabs(props) {

  const tabStripStyle = {
    'background': '#222',
    'color': 'white',
    'fontFamily': 'Gentium Basic',
    'padding': '0 33px'
  };

  const tabsStyle = {
    'display': 'flex'
  };

  const tabPanelsContainerStyle = {
    'display': 'block',
    'position': 'relative'
  };

  return (
    <Tabs
      style={tabsStyle}
      tabButtonClass={SereneTabButton}
      tabPanelsContainerStyle={tabPanelsContainerStyle}
      tabStripStyle={tabStripStyle}
      >
      {props.children}
    </Tabs>
  );
}
