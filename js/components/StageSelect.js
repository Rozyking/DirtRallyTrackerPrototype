const StageSelect = {
    props: {
        modelValue: { type: String, default: null },
        stages: { type: Array, required: true },
        label: { type: String, default: "Stage" },
        placeholder: { type: String, default: "Choose a stage" },
        disabled: { type: Boolean, default: false },
        id: { type: String, required: true },
        error: { type: String, default: "" }
    },
    emits: ["update:modelValue"],
    computed: {
        value: {
            get() {
                return this.modelValue;
            },
            set(newValue) {
                this.$emit("update:modelValue", newValue);
            }
        }
    },
    template: `
    <div class="form-floating">
      <select class="form-select form-select-lg h-100 fs-6"
        :class="{ 'is-invalid': error }"
        :id="id" v-model="value" :disabled="disabled">
        <option :value="null" disabled>{{ placeholder }}</option>
        <option v-for="stage in stages" :key="stage" :value="stage">{{ stage }}</option>
      </select>
      <label :for="id">{{ label }}</label>
      <div class="invalid-feedback">{{ error }}</div>
    </div>
    `
}