const { createApp } = Vue;

const app = createApp({
  // all the data for the app
  data: function () {
    return {

      // holds stage data from stages.json after fetch
      stageData: {},
      selectedCountry: null,
      selectedStage: null,

      // holds data for accordion blocks with event data
      events: [
        {
          name: "Career Rallycross",
          rank: "Clubman",
          car: "Ford Fiesta OMSE Supercar Lites",
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
          rank: "Weekly Leaderboard",
          car: "Ford Focus RS Rally 2001",
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
        pb: false
      },

      // data for events modal
      eventForm: {
        date: null,
        rank: null,
        car: null,
        type: null,
        stageCount: null
      }

    };
  },

  // runs once when the app mounts to fetch country and stage data from stages.json
  async created() {
    try {
      const response = await fetch("data/stages.json");
      if (!response.ok) {
        throw new Error("Failed to load stage data: " + response.status);
      }
      this.stageData = await response.json();
    } catch (error) {
      console.error("Error loading stage data:", error);
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
    }
  },

  // usually event triggered by v-on
  methods: {
    deleteEvent(index) {
      this.events.splice(index, 1);
    },

    addEvent() {
      this.events.push({
        name: this.eventForm.type,
        rank: this.eventForm.rank,
        car: this.eventForm.car,
        place: "—",
        nextStage: "—",
        progress: 0,
        results: []
      });
      this.eventForm = { date: null, rank: null, car: null, type: null, stageCount: null };
    },

    addResult() {
      const entry = {
        country: this.selectedCountry,
        stage: this.resultForm.stage,
        time: this.resultForm.time,
        conditions: this.resultForm.weather,
        pb: this.resultForm.pb
      };
      this.results.push(entry);
      this.resultForm = { stage: null, position: null, date: null, weather: null, time: null, notes: "", pb: false };
    },

    prefillResultForEvent(event) {
      this.selectedCountry = event.country;
      this.resultForm.stage = event.nextStage;
    }
  },



}).mount("#app")

