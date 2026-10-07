const { createApp } = Vue;

const app = createApp({
  // all the data for the app
  data: function () {
    return {

      // holds stage data from stages.json after fetch
      stageData: {},
      carsData: [],
      selectedCountry: null,
      selectedStage: null,
      editingIndex: null,
      eventBeingEdited: null,
      showEventModal: false,
      showResultModal: false,

      // holds data for accordion blocks with event data
      events: [
        {
          name: "Career Rallycross",
          rank: "Clubman",
          car: "Ford Fiesta R5",
          place: "12th Place",
          country: "Belgium",
          nextStage: "Mettet Circuit",
          stageCount: 6,
          progress: 0,
          results: []
        },
        {
          name: "Career Rally",
          rank: "Semi-Pro",
          car: "Subaru Impreza 1995",
          place: "4th Place",
          country: "Australia",
          nextStage: "Mount Kaye Pass",
          stageCount: 6,
          progress: 17,
          results: [
            { stage: "Mount Kaye Pass", position: 4, time: "3:58.223", conditions: "Clear", pb: true }
          ]
        },
        {
          name: "Weekly Challenge",
          rank: "Pro",
          car: "Ford Escort Mk II",
          place: "321st Place",
          country: "Argentina",
          nextStage: "La Merced",
          stageCount: 6,
          progress: 0,
          results: []
        }
      ],

      // logged stage results - separate from events and feeds stage times table
      results: [
        { country: "Belgium", stage: "Mettet Circuit", time: "1:24.634", conditions: "Clear", pb: true }
      ],

      resultDefaults: {},
      lockResultContext: false,
      activeEventIndex: null,
    };
  },

  // runs once when the app mounts to fetch country and stage data from stages.json
  async created() {
    try {
      const [stagesResponse, carsResponse] = await Promise.all([
        fetch("data/stages.json"),
        fetch("data/cars.json")
      ]);

      if (!stagesResponse.ok) {
        throw new Error("Failed to load stage data: " + stagesResponse.status);
      }

      if (!carsResponse.ok) {
        throw new Error("Failed to load car data: " + carsResponse.status);
      }

      this.stageData = await stagesResponse.json();
      this.carsData = await carsResponse.json();
    } catch (error) {
      console.error("Error loading reference data:", error);
    }
  },

  // values that are updated and cached if dependencies change
  computed: {
    countries() {
      return Object.keys(this.stageData);
    },

    filteredStages() {
      return this.stageData[this.selectedCountry] || [];
    },

    stageResults() {
      return this.results.filter(r => r.country === this.selectedCountry)
    },

    carGroups() {
      const groups = [];
      for (const car of this.carsData) {
        let group = groups.find(g => g.name === car.group);
        if (!group) {
          group = { name: car.group, cars: [] };
          groups.push(group);
        }
        group.cars.push(car);
      }

      return groups;
    },

  },

  // usually event triggered by v-on/@click
  methods: {
    deleteEvent(index) {
      this.events.splice(index, 1);
    },

    deleteResult(result) {
      const index = this.results.indexOf(result);
      if (index !== -1) {
        this.results.splice(index, 1);
      }
    },

    startAddEvent() {
      this.eventBeingEdited = null;
      this.editingIndex = null;
      this.showEventModal = true;
    },

    startAddResult() {
      this.resultDefaults = { country: this.selectedCountry };
      this.lockResultContext = false;
      this.activeEventIndex = null;
      this.showResultModal = true;
    },

    saveEvent(formData) {
      const fields = {
        name: formData.type,
        rank: formData.rank,
        car: formData.car,
        country: formData.country,
        nextStage: formData.stage,
        date: formData.date,
        stageCount: formData.stageCount
      };

      if (this.editingIndex !== null) {
        this.events[this.editingIndex] = { ...this.events[this.editingIndex], ...fields };
      } else {
        this.events.push({ ...fields, place: "1st Place", progress: 0, results: [] });
      }

      this.eventBeingEdited = null;
      this.editingIndex = null;
      this.showEventModal = false;
    },

    addResult(formData) {
      const entry = {
        country: formData.country,
        stage: formData.stage,
        car: formData.car,
        time: formData.time,
        conditions: formData.conditions,
        pb: formData.pb,
        date: formData.date,
        position: formData.position,
        notes: formData.notes
      };

      if (this.activeEventIndex !== null) {
        const event = this.events[this.activeEventIndex];
        event.results.push(entry);
        if (event.stageCount) {
          event.progress = Math.min(100, (event.results.length / event.stageCount) * 100);
        }
      }

      this.results.push(entry);
      this.lockResultContext = false;
      this.activeEventIndex = null;
      this.showResultModal = false;
    },

    editEvent(index) {
      this.eventBeingEdited = this.events[index];
      this.editingIndex = index;
      this.showEventModal = true;
    },

    prefillResultForEvent(event, index) {
      this.resultDefaults = {
        country: event.country,
        stage: event.nextStage,
        car: event.car
      };
      this.selectedCountry = event.country;
      this.lockResultContext = true;
      this.activeEventIndex = index;
      this.showResultModal = true;
    },
  },
});

// Components here
app.component("country-select", CountrySelect);
app.component("stage-select", StageSelect);
app.component("car-select", CarSelect);
app.component("base-modal", BaseModal);
app.component("event-form-modal", EventFormModal);
app.component("result-form", ResultForm);

app.mount("#app");

