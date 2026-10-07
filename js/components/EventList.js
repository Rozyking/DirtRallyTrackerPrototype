const EventList = {
  props: {
    events: { type: Array, required: true }
  },
  emits: ["edit", "delete", "add-result"],
  data() {
    return {
      openId: null
    };
  },
  methods: {
    toggle(id) {
      // clicking the open item closes it, clicking another opens that one and closes the rest
      this.openId = this.openId === id ? null : id;
    }
  },
  template: `
    <div class="accordion">
      <event-item v-for="(event, index) in events" :key="event.id"
        :event="event" :is-open="openId === event.id"
        @toggle="toggle(event.id)"
        @edit="$emit('edit', index)"
        @delete="$emit('delete', index)"
        @add-result="$emit('add-result', event, index)">
      </event-item>
      <p v-if="events.length === 0" class="text-center text-muted p-4 mb-0">
        No events yet. Add one to get started.
      </p>
    </div>
  `
};