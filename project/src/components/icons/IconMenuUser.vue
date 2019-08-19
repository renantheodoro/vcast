<template>
  <svg v-if="color == 'white'"
   xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45">
    <g fill="none" fill-rule="evenodd" stroke="#FFF" stroke-width="2.5">
      <g stroke-linecap="round" stroke-linejoin="round">
        <path
          d="M24 6.962c2.43-3.484 7.119-4.946 11.27-3.264 4.743 1.922 6.988 7.222 5.013 11.838-1.29 3.01-4.055 4.988-7.14 5.464M32 8v8M36 12h-8"
        ></path>
      </g>
      <ellipse cx="19" cy="21.5" rx="9" ry="8.5"></ellipse>
      <path stroke-linecap="round" d="M5 43c.385-5.333 4.808-8 13.268-8C30.913 35 32 40.882 32 43"></path>
    </g>
  </svg>

  <svg 
  v-else-if="color == 'black'"
  xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45">
    <g fill="none" fill-rule="evenodd" stroke="#000" stroke-width="2.5">
      <g stroke-linecap="round" stroke-linejoin="round">
        <path
          d="M24 6.962c2.43-3.484 7.119-4.946 11.27-3.264 4.743 1.922 6.988 7.222 5.013 11.838-1.29 3.01-4.055 4.988-7.14 5.464M32 8v8M36 12h-8"
        ></path>
      </g>
      <ellipse cx="19" cy="21.5" rx="9" ry="8.5"></ellipse>
      <path stroke-linecap="round" d="M5 43c.385-5.333 4.808-8 13.268-8C30.913 35 32 40.882 32 43"></path>
    </g>
  </svg>
</template>

<script>
export default {
  name: "IconMenuUser",
   props: {
    color: {
      type: String,
      default: "white"
    }
  }
};
</script>