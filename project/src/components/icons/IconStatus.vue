<template>
  <svg v-if="status == 'not-sent'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 15">
    <g fill="none" fill-rule="evenodd" stroke="#A6A6A6" stroke-width="1.5">
      <circle cx="21.5" cy="7.5" r="6.5"></circle>
      <path stroke-linecap="round" stroke-linejoin="round" d="M21 5v3h3"></path>
    </g>
  </svg>

  <svg v-else-if="status == 'sent'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 15">
    <path
      fill="none"
      fill-rule="evenodd"
      stroke="#A6A6A6"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M16 7.912L19.064 11 27 3"
    ></path>
  </svg>

  <svg v-else-if="status == 'delivered'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 15">
    <g
      fill="none"
      fill-rule="evenodd"
      stroke="#A6A6A6"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    >
      <path d="M5 7.912L8.064 11 16 3M16 7.912L19.064 11 27 3"></path>
    </g>
  </svg>

  <svg v-else-if="status == 'read'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 15">
    <g
      fill="none"
      fill-rule="evenodd"
      stroke="#26C400"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    >
      <path d="M5 7.912L8.064 11 16 3M16 7.912L19.064 11 27 3"></path>
    </g>
  </svg>
</template>

<script>
export default {
  name: "IconStatus",

  props: {
    status: String
  }
};
</script>