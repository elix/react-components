/**
 * Mixin which maps a click (actually, a mousedown) to an item selection.
 */
export default function ClickSelectionMixin(Base) {
  return class ClickSelection extends Base {

    click(event) {
      const targetIndex = this.indexOfTarget(event.target);
      const selectionRequired = this.props.selectionRequired || this.defaults.selectionRequired;
      if (targetIndex >= 0 || !selectionRequired) {
        this.selectedIndexChanged(targetIndex);
      }
    }

    listProps() {
      const base = super.listProps ? super.listProps() : {};
      return Object.assign(base, {
        onMouseDown: this.click.bind(this)
      });
    }
    
  };
}
