<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 500 500"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xml:space="preserve"
    xmlns:serif="http://www.serif.com/"
    style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"
  >
    <g id="ToRotate" :transform="direction">
      <path
        id="Arrow"
        d="M426.977,494.467C448.984,507.024 460.431,490.641 450.786,467.211L265.668,16.436C261.571,6.495 259.892,0.016 249.134,0L249.118,0C238.361,0 236.682,6.495 232.569,16.436L47.311,467.219C37.66,490.646 49.1,507.036 71.111,494.486L249.119,393.546L249.135,393.563L426.977,494.467Z"
        style="fill:rgb(0,0,255);fill-rule:nonzero;"
      />
    </g>
  </svg>
</template>
<script>
export default {
  name: "navigation-arrow",
  props: ["size", "angle"],
  computed: {
    direction() {
      console.log(this.angle);
      return "rotate(" + this.angle + " 250 250)";
    }
  }
};
</script>