<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 35 35"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <g
      id="ICON---MENU-BRANCO"
      stroke="none"
      stroke-width="1"
      fill="none"
      fill-rule="evenodd"
      stroke-linecap="round"
    >
      <path d="M3.60416667,4.5 L31.3958333,4.5" id="Line" stroke="#FFFFFF" stroke-width="4"></path>
      <path d="M3.60416667,18 L31.3958333,18" id="Line-Copy" stroke="#FFFFFF" stroke-width="4"></path>
      <path
        d="M3.60416667,31.5 L31.3958333,31.5"
        id="Line-Copy-2"
        stroke="#FFFFFF"
        stroke-width="4"
      ></path>
    </g>
  </svg>
</template>

<script>
export default {
  name: "IconMenu",

  props: {
    size: {
      type: String,
      default: "35px",
      required: false
    }
  }
};
</script>