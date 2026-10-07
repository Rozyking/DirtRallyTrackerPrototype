const BaseModal = {
    props: {
        show: { type: Boolean, default: false },
        title: { type: String, required: true }
    },
    emits: ["close"],
    watch: {
        // move focus into the modal when it opens so you can escape right away
        show(isOpen) {
            if (isOpen) {
                this.$nextTick(() => this.$refs.modal.focus());
            }
        }
    },
    template: `
        <div v-if="show">
      <div class="modal d-block" tabindex="-1" role="dialog" aria-modal="true"
        :aria-label="title" ref="modal" style="outline: none;"
        @click.self="$emit('close')" @keydown.esc="$emit('close')">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ title }}</h5>
              <button type="button" class="btn-close" aria-label="Close"
                @click="$emit('close')"></button>
            </div>
            <div class="modal-body">
              <slot></slot>
            </div>
            <div class="modal-footer" v-if="$slots.footer">
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop show"></div>
    </div>
    `
};