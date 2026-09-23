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
            { stage: "Mount Kaye Pass", position: 4, time: "3:58.223", weather: "Clear", pb: true }
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
        { country: "Belgium", stage: "Mettet Circuit", time: "1:24.6", conditions: "Dry", pb: true }
      ],

      // data for result modal
      resultForm: {
        stage: null,
        position: null,
        date: null,
        weather: null,
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
    },

    startAddResult() {
      this.resultForm = { stage: null, position: null, date: null, weather: null, time: null, notes: "", pb: false, country: this.selectedCountry, car: null };
      this.lockResultContext = false;
      this.activeEventIndex = null;
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
          nextStage: this.eventForm.stage
        };
      } else {
        this.events.push({
          name: this.eventForm.type,
          rank: this.eventForm.rank,
          car: this.eventForm.car,
          place: "1st Place",
          country: this.eventForm.country,
          nextStage: this.eventForm.stage,
          progress: 0,
          results: []
        });
      }
      this.eventForm = { date: null, rank: null, car: null, type: null, stageCount: null, country: null, stage: null };
      this.editingIndex = null;
    },

    addResult() {
      const entry = {
        country: this.selectedCountry,
        stage: this.resultForm.stage,
        car: this.resultForm.car,
        time: this.resultForm.time,
        conditions: this.resultForm.weather,
        pb: this.resultForm.pb
      };

      if (this.activeEventIndex !== null) {
        const event = this.events[this.activeEventIndex];
        event.results.push(entry);
        event.progress = Math.min(100, event.progress + 10);
      }

      this.results.push(entry);
      this.resultForm = { stage: null, position: null, date: null, weather: null, time: null, notes: "", pb: false, country: null, car: null };
      this.lockResultContext = false;
      this.activeEventIndex = null;
    },

    editEvent(index) {
      const event = this.events[index];
      this.eventForm = {
        date: null,
        rank: event.rank,
        car: event.car,
        type: event.name,
        stageCount: null,
        country: event.country,
        stage: event.nextStage
      };
      this.editingIndex = index;
    },

    prefillResultForEvent(event, index) {
      this.selectedCountry = event.country;
      this.resultForm.stage = event.nextStage;
      this.resultForm.car = event.car;
      this.lockResultContext = true;
      this.activeEventIndex = index;
    }
  },



}).mount("#app")

