const CountrySelect = {
  props: {
    modelValue: { type: String, default: null },
    countries: { type: Array, required: true },
    label: { type: String, default: "Country" },
    placeholder: { type: String, default: "Choose a country" },
    allowClear: { type: Boolean, default: false },
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
        this.$emit("update:modelValue", newValue)
      }
    }
  },
  template: `
    <div class="form-floating">
      <select class="form-select form-select-lg h-100 fs-6"
        :class="{ 'is-invalid': error }"
        :id="id" v-model="value" :disabled="disabled">
        <option :value="null" :disabled="!allowClear">{{ placeholder }}</option>
        <option v-for="country in countries" :key="country" :value="country">{{ country }}</option>
      </select>
      <label :for="id">{{ label }}</label>
      <div class="invalid-feedback">{{ error }}</div>
    </div>
  `
};