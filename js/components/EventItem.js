const EventItem = {
    props: {
        event: { type: Object, required: true },
        isOpen: { type: Boolean, default: false }
    },
    emits: ["toggle", "edit", "delete", "add-result"],
    template: `
        <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button" :class="{ collapsed: !isOpen }" type="button"
          :aria-expanded="isOpen" :aria-controls="'event-' + event.id"
          @click="$emit('toggle')">
          {{ event.name }}
        </button>
      </h2>
      <div class="progress rounded-0">
        <div class="progress-bar" role="progressbar" :style="{ width: event.progress + '%' }"
          :aria-valuenow="event.progress" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
      <div :id="'event-' + event.id" class="accordion-collapse collapse" :class="{ show: isOpen }">
        <div class="accordion-body">
          <div class="row align-items-center">
            <div class="col-10">
              <p class="mb-1"><strong>{{ event.place }}</strong> — {{ event.car }}</p>
              <p class="mb-1">Rank: {{ event.rank }}</p>
              <p class="mb-3">Next Stage: {{ event.nextStage }}, {{ event.country }}</p>
            </div>
            <div class="col-1">
              <i class="bi bi-pencil fs-3" role="button" aria-label="Edit event" @click="$emit('edit')"></i>
            </div>
            <div class="col-1">
              <i class="bi bi-trash fs-3" role="button" aria-label="Delete event" @click="$emit('delete')"></i>
            </div>
          </div>
          <button type="button" class="btn btn-custom w-100" @click="$emit('add-result')">
            + Add Result
          </button>
        </div>
      </div>
    </div>
    `
}