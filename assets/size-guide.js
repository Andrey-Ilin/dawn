/*
 * <size-guide-modal>
 * Wraps the size-guide trigger. On first open it builds the modal's two tables
 * from the inches table embedded in the product description
 * (`<table id="size-guide">`): an Inches tab (the source) and a cm tab generated
 * client-side. The modal markup is a sibling `<modal-dialog>` (Dawn relocates it
 * to <body>), found here via `data-modal`.
 */
if (!customElements.get('size-guide-modal')) {
  customElements.define(
    'size-guide-modal',
    class SizeGuideModal extends HTMLElement {
      connectedCallback() {
        const button = this.querySelector('button');
        if (!button) return;
        // Build lazily on first open so the description table + modal are in the
        // DOM regardless of block order. The fill is synchronous (before paint).
        button.addEventListener('click', () => this.build());
      }

      build() {
        if (this.built) return;

        const modal = document.querySelector(this.dataset.modal);
        const scope = this.closest('.product') || document;
        const source = scope.querySelector('.product__description #size-guide');
        if (!modal || !source) return;

        const inchesPanel = modal.querySelector('.size-guide-modal__panel[data-unit="in"]');
        const cmPanel = modal.querySelector('.size-guide-modal__panel[data-unit="cm"]');
        if (!inchesPanel || !cmPanel) return;

        inchesPanel.appendChild(this.cloneTable(source));
        cmPanel.appendChild(this.toMetric(this.cloneTable(source)));
        this.bindTabs(modal);
        this.built = true;
      }

      // Clone the source table without its id (avoids duplicate ids) and strip
      // the merchant's inline styles so the modal's own CSS controls layout
      // (the source uses `word-break: break-word`, which mangles labels).
      cloneTable(source) {
        const table = source.cloneNode(true);
        table.removeAttribute('id');
        table.removeAttribute('style');
        table.querySelectorAll('[style]').forEach((el) => el.removeAttribute('style'));
        return table;
      }

      // Convert an inches table (in place) to centimetres.
      toMetric(table) {
        Array.from(table.rows).forEach((row, rowIndex) => {
          const isHeaderRow = row.parentNode.tagName === 'THEAD' || rowIndex === 0;
          if (isHeaderRow) return; // keep size labels (XS…XL)

          Array.from(row.cells).forEach((cell, cellIndex) => {
            if (cellIndex === 0) {
              // first column = row label: rewrite the unit word only
              cell.innerHTML = cell.innerHTML.replace(/\bin\b/g, 'cm');
            } else {
              cell.textContent = cell.textContent.replace(/\d+(\.\d+)?/g, (n) =>
                this.inchToCm(parseFloat(n))
              );
            }
          });
        });
        return table;
      }

      // Smart-snap rounding: snap to a whole cm when the inch value is a clean
      // conversion, otherwise keep two decimals (e.g. 1" tolerance -> 2.54).
      inchToCm(inch) {
        const cm = inch * 2.54;
        const rounded = Math.round(cm);
        return (Math.abs(cm - rounded) <= 0.05 ? rounded : cm).toFixed(2);
      }

      bindTabs(modal) {
        const tabs = Array.from(modal.querySelectorAll('[role="tab"]'));
        tabs.forEach((tab) => {
          tab.addEventListener('click', () => this.selectUnit(modal, tab.dataset.unit, tabs));
        });
      }

      selectUnit(modal, unit, tabs) {
        tabs.forEach((tab) => tab.setAttribute('aria-selected', tab.dataset.unit === unit));
        modal.querySelectorAll('.size-guide-modal__panel').forEach((panel) => {
          panel.hidden = panel.dataset.unit !== unit;
        });
      }
    }
  );
}
