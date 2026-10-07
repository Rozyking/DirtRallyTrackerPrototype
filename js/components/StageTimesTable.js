const StageTimesTable = {
  props: {
    results: { type: Array, required: true },
    selectedCountry: { type: String, default: null },
    selectedStage: { type: String, default: null }
  },
  emits: ["select-stage", "delete-result"],
  methods: {
    select(stage) {
      // clicking the active stage again clears the selection
      this.$emit("select-stage", stage === this.selectedStage ? null : stage);
    }
  },
  template: `
    <div>
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th scope="col">Stage</th>
            <th scope="col">Time</th>
            <th scope="col">Conditions</th>
            <th scope="col">PB</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(result, index) in results" :key="index"
            :class="{ 'table-active': result.stage === selectedStage }"
            style="cursor: pointer;" tabindex="0"
            @click="select(result.stage)"
            @keydown.enter="select(result.stage)"
            @keydown.space.prevent="select(result.stage)">
            <td>{{ result.stage }}</td>
            <td>{{ result.time }}</td>
            <td>{{ result.conditions }}</td>
            <td>{{ result.pb ? "⭐" : "" }}</td>
            <td>
              <i class="bi bi-trash" role="button" aria-label="Delete result"
                @click.stop="$emit('delete-result', result)"></i>
            </td>
          </tr>
          <tr v-if="!selectedCountry">
            <td colspan="5" class="text-center text-muted">Choose a country to see stage times</td>
          </tr>
          <tr v-else-if="results.length === 0">
            <td colspan="5" class="text-center text-muted">No data available</td>
          </tr>
        </tbody>
      </table>
      <p v-if="results.length" class="small text-muted">Select a stage to view it on the chart.</p>
    </div>
  `
};