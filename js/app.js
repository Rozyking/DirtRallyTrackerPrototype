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
          progress: 65,
          results: []
        },
        {
          name: "Career Rally",
          rank: "Semi-Pro",
          car: "Subaru Impreza 1995",
          place: "4th Place",
          country: "Australia",
          nextStage: "Mount Kaye Pass",
          progress: 40,
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
          progress: 80,
          results: []
        }
      ],

      // logged stage results - separate from events and feeds stage times table
      results: [
        { country: "Belgium", stage: "Mettet Circuit", time: "1:24.634", conditions: "Clear", pb: true }
      ],

      // data for result modal
      resultForm: {
        stage: null,
        position: null,
        date: null,
        conditions: null,
        time: null,
        notes: "",
        pb: false,
        country: null,
        car: null
      },
      lockResultContext: false,
      activeEventIndex: null,

      // data for events modal
      eventForm: {
        date: null,
        rank: null,
        car: null,
        type: null,
        stageCount: null,
        country: null,
        stage: null
      }

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

    eventCountryStages() {
      return this.stageData[this.eventForm.country] || [];
    },

    resultModalStages() {
      return this.stageData[this.resultForm.country] || [];
    }
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
      this.eventForm = { date: null, rank: null, car: null, type: null, stageCount: null, country: null, stage: null };
      this.editingIndex = null;
      this.showEventModal = true;
    },

    startAddResult() {
      this.resultForm = { stage: null, position: null, date: null, conditions: null, time: null, notes: "", pb: false, country: this.selectedCountry, car: null };
      this.lockResultContext = false;
      this.activeEventIndex = null;
      this.showResultModal = true;
    },

    saveEvent() {
      if (this.editingIndex !== null) {
        const existing = this.events[this.editingIndex];
        this.events[this.editingIndex] = {
          ...existing,
          name: this.eventForm.type,
          rank: this.eventForm.rank,
          car: this.eventForm.car,
          country: this.eventForm.country,
          nextStage: this.eventForm.stage,
          date: this.eventForm.date,
          stageCount: this.eventForm.stageCount
        };
      } else {
        this.events.push({
          name: this.eventForm.type,
          rank: this.eventForm.rank,
          car: this.eventForm.car,
          place: "1st Place",
          country: this.eventForm.country,
          nextStage: this.eventForm.stage,
          date: this.eventForm.date,
          stageCount: this.eventForm.stageCount,
          progress: 0,
          results: []
        });
      }
      this.eventForm = { date: null, rank: null, car: null, type: null, stageCount: null, country: null, stage: null };
      this.editingIndex = null;
      this.showEventModal = false;
    },

    addResult() {
      const entry = {
        country: this.resultForm.country,
        stage: this.resultForm.stage,
        car: this.resultForm.car,
        time: this.resultForm.time,
        conditions: this.resultForm.conditions,
        pb: this.resultForm.pb,
        date: this.resultForm.date,
        position: this.resultForm.position
      };

      if (this.activeEventIndex !== null) {
        const event = this.events[this.activeEventIndex];
        event.results.push(entry);
        if (event.stageCount) {
          event.progress = Math.min(100, (event.results.length / event.stageCount) * 100);
        }
      }

      this.results.push(entry);
      this.resultForm = { stage: null, position: null, date: null, conditions: null, time: null, notes: "", pb: false, country: null, car: null };
      this.lockResultContext = false;
      this.activeEventIndex = null;
      this.showResultModal = false;
    },

    editEvent(index) {
      const event = this.events[index];
      this.eventForm = {
        date: event.date ?? null,
        rank: event.rank,
        car: event.car,
        type: event.name,
        stageCount: event.stageCount ?? null,
        country: event.country,
        stage: event.nextStage
      };
      this.editingIndex = index;
      this.showEventModal = true;
    },

    prefillResultForEvent(event, index) {
      this.resultForm = {
        stage: event.nextStage,
        position: null,
        date: null,
        conditions: null,
        time: null,
        notes: "",
        pb: false,
        country: event.country,
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

app.mount("#app");

