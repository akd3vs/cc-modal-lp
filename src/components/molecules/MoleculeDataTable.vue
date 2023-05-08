<template>
  <table class="datatable" data-testid="datatable">
    <thead>
      <tr>
        <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in data" :key="item.id" data-testid="datatable-tr">
        <td v-for="column in columns" :key="column.key" data-testid="datatable-td">
          <p v-if="column.render" data-testid="datatable-td-value">
            {{ column.render(item[column.key]) }}
          </p>
          <p v-if="!column.render" data-testid="datatable-td-value">
            {{ item[column.key] }}
          </p>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export interface TableColumn {
  key: string
  label: string
  render?: (row: any) => string | number
}

export interface TableProps {
  data: any
  columns: TableColumn[]
}

export default defineComponent({
  name: 'MoleculeDataTable',
  props: {
    data: {
      type: Array as () => TableProps['data'],
      required: true
    },
    columns: {
      type: Array as () => TableColumn[],
      required: true
    }
  }
})
</script>
