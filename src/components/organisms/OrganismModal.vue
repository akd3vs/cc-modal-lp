<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'OrganismModal',
  props: {
    id: {
      type: String,
      required: true
    },
    show: {
      type: Boolean
    },
    title: {
      type: String,
      required: true
    },
    size: {
      type: String,
      required: false,
      default: 'sm'
    }
  },
  setup(props, { emit }) {
    function onModalClose() {
      emit('onModalClose')
    }

    return {
      onModalClose
    }
  }
})
</script>

<template>
  <div class="overlay" :class="{ 'd-flex': show }">
    <!-- modal -->
    <div :id="id" :class="{ [`modal modal-${size}`]: true, 'd-block': show }">
      <div class="ly-row ly-spacebetween-center mb-1">
        <h3 class="m-0">{{ title }}</h3>
        <button
          @click="onModalClose"
          class="btn btn-noborder btn-icon"
          data-testid="organism-modal-close-button"
        >
          <i class="lpi-close"></i><span>Close</span>
        </button>
      </div>
      <slot></slot>
    </div>
    <!-- end modal -->
  </div>
</template>
