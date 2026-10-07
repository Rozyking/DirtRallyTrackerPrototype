const ResultForm = {
    props: {
        initialValues: { type: Object, default: () => ({}) },
        countries: { type: Array, required: true },
        stageData: { type: Object, required: true },
        carGroups: { type: Array, required: true },
        lockContext: { type: Boolean, default: false },
        idPrefix: { type: String, default: "result" }           // keeps IDs unique
    },
    emits: ["save", "cancel"],
    data() {
        const start = this.initialValues;
        return {
            form: {
                country: start.country ?? null,
                stage: start.stage ?? null,
                car: start.car ?? null,
                position: null,
                date: null,
                time: null,
                conditions: null,
                notes: "",
                pb: false
            },
            errors: {},
            conditionOptions: [
                { value: "Clear", label: "Clear/Sunny" },
                { value: "Cloudy", label: "Cloudy" },
                { value: "Drizzle", label: "Drizzle/Light rain" },
                { value: "Heavy", label: "Heavy rain" },
                { value: "Night", label: "Night" }
            ]
        };
    },
    computed: {
        stages() {
            return this.stageData[this.form.country] || [];
        }
    },
    methods: {
        fid(name) {
            return this.idPrefix + "-" + name;
        },
        validate() {
            const errors = {};
            const time = (this.form.time || "").trim();

            if (!this.form.country) errors.country = "Choose a country.";
            if (!this.form.stage) errors.stage = "Choose a stage.";
            if (!this.form.car) errors.car = "Choose a car.";
            if (!this.form.date) errors.date = "Enter the result date.";
            if (!this.form.conditions) errors.conditions = "Choose conditions.";

            if (!time) {
                errors.time = "Enter your time.";
            } else if (!/^\d{1,2}:[0-5]\d\.\d{1,3}$/.test(time)) {
                errors.time = "Use mm:ss.fff, like 3:58.223.";
            }

            // Position optional, but must be a whole number >= 1.
            const pos = this.form.position;
            if (pos !== null && pos !== "" && (!Number.isInteger(pos) || pos < 1)) {
                errors.position = "Enter 1 or higher.";
            }

            this.errors = errors;
            return Object.keys(errors).length === 0;
        },
        save() {
            if (!this.validate()) return;
            this.$emit("save", {
                ...this.form,
                time: this.form.time.trim(),
                position: Number.isInteger(this.form.position) ? this.form.position : null
            });
        }
    },
    template: `
        <form @submit.prevent="save" novalidate>
      <country-select :id="fid('country')" v-model="form.country"
        @update:model-value="form.stage = null" :countries="countries"
        :error="errors.country" label="Country" placeholder="Choose a country" class="mb-3">
      </country-select>

      <stage-select :id="fid('stage')" v-model="form.stage" :stages="stages"
        :disabled="!form.country" :error="errors.stage" class="mb-3">
      </stage-select>

      <car-select :id="fid('car')" v-model="form.car" :car-groups="carGroups"
        :disabled="lockContext" :error="errors.car" class="mb-3">
      </car-select>

      <div class="row mb-3">
        <div class="form-floating col-4">
          <input type="number" class="form-control" :id="fid('position')" min="1"
            :class="{ 'is-invalid': errors.position }" v-model.number="form.position">
          <label :for="fid('position')" class="ms-2">Position</label>
          <div class="invalid-feedback">{{ errors.position }}</div>
        </div>
        <div class="form-floating col-8">
          <input type="date" class="form-control" :id="fid('date')"
            :class="{ 'is-invalid': errors.date }" v-model="form.date">
          <label :for="fid('date')" class="ms-2">Result Date</label>
          <div class="invalid-feedback">{{ errors.date }}</div>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-6">
          <div class="form-floating">
            <select class="form-select form-select-sm h-100 fs-6" :id="fid('conditions')"
              :class="{ 'is-invalid': errors.conditions }" v-model="form.conditions">
              <option :value="null" disabled>Choose conditions</option>
              <option v-for="c in conditionOptions" :key="c.value" :value="c.value">{{ c.label }}</option>
            </select>
            <label :for="fid('conditions')">Conditions</label>
            <div class="invalid-feedback">{{ errors.conditions }}</div>
          </div>
        </div>
        <div class="form-floating col-6">
          <input type="text" class="form-control" :id="fid('time')" placeholder="3:58.223"
            :class="{ 'is-invalid': errors.time }" v-model="form.time">
          <label :for="fid('time')" class="ms-2">Time (mm:ss.fff)</label>
          <div class="invalid-feedback">{{ errors.time }}</div>
        </div>
      </div>

      <div class="form-floating mb-3">
        <textarea class="form-control" placeholder="Race notes" :id="fid('notes')"
          v-model="form.notes"></textarea>
        <label :for="fid('notes')">Notes</label>
      </div>

      <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" :id="fid('pb')" v-model="form.pb">
        <label class="form-check-label" :for="fid('pb')">Personal best</label>
      </div>

      <div class="d-flex justify-content-end gap-2">
        <button type="button" class="btn btn-secondary" @click="$emit('cancel')">Cancel</button>
        <button type="button" class="btn btn-custom" @click="save">Save results</button>
      </div>
    </form>
    `
}