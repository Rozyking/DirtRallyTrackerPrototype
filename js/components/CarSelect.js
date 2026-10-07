const CarSelect = {
    props: {
        modelValue: { type: String, default: null },
        carGroups: { type: Array, required: true },
        label: { type: String, default: "Car" },
        placeholder: { type: String, default: "Choose a car" },
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
        <optgroup v-for="group in carGroups" :key="group.name" :label="group.name">
          <option v-for="car in group.cars" :key="car.name" :value="car.name">{{ car.name }}</option>
        </optgroup>
      </select>
      <label :for="id">{{ label }}</label>
      <div class="invalid-feedback">{{ error }}</div>
    </div>
    `
}