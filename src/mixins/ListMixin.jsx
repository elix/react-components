import React from 'react';
import ReactDOM from 'react-dom';


export default function ListMixin(Base) {

  return class List extends Base {

    get defaults() {
      return Object.assign({}, super.defaults, {
        orientation: 'both'
      });
    }

    /**
     * Return the index of the list child that is, or contains, the indicated target
     * node. Return -1 if not found.
     */
    indexOfTarget(target) {
      const children = this.root.children;
      for (let index = 0; index < children.length; index++) {
        const child = children[index];
        if (child.contains(target)) {
          return index;
        }
      }
      return -1;
    }
    
    get items() {
      return this.props.children;
    }

    // Default orientation is both horizontal and vertical. Override with
    // "horizontal" or "vertical" if you only want a specific orientation.
    orientation() {
      return this.props.orientation || this.defaults.orientation;
    }

    /**
     * Render the list and its items.
     */
    render() {

      const rootProps = this.rootProps();
      // Merge style set on this component on top of default style.
      Object.assign(
        rootProps.style,
        this.props.style
      );

      const items = this.items.map((item, index) => {
        const itemProps = this.itemProps(item, index);
        itemProps.key = index;
        return React.cloneElement(item, itemProps);
      });

      return (
        <div ref={el => this.root = el} {...rootProps}>
          {items}
        </div>
      );
    }

  };
}