<template>
  <svg
    width="220"
    height="180"
    viewBox="0 0 220 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Steam (3 Lines) -->
    <g opacity="0.8">
      <!-- Left Steam -->
      <path
        d="M80 55 C70 40, 90 30, 80 15"
        stroke="#755f4a"
        stroke-width="4"
        stroke-linecap="round"
        fill="none"
      >
        <animate
          attributeName="opacity"
          values="0;1;0"
          dur="2s"
          repeatCount="indefinite"
        />
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 10;0 -10"
          dur="2s"
          repeatCount="indefinite"
        />
      </path>

      <!-- Center Steam -->
      <path
        d="M110 55 C100 40, 120 30, 110 15"
        stroke="#755f4a"
        stroke-width="4"
        stroke-linecap="round"
        fill="none"
      >
        <animate
          attributeName="opacity"
          values="0;1;0"
          dur="2.2s"
          repeatCount="indefinite"
        />
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 8;0 -12"
          dur="2.2s"
          repeatCount="indefinite"
        />
      </path>

      <!-- Right Steam -->
      <path
        d="M140 55 C130 40, 150 30, 140 15"
        stroke="#755f4a"
        stroke-width="4"
        stroke-linecap="round"
        fill="none"
      >
        <animate
          attributeName="opacity"
          values="0;1;0"
          dur="2.5s"
          repeatCount="indefinite"
        />
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 12;0 -12"
          dur="2.5s"
          repeatCount="indefinite"
        />
      </path>
    </g>

    <!-- Bread Loaf -->
    <g>
      <path
        d="M55 120
         C55 85, 165 85, 165 120
         C165 150, 55 150, 55 120Z"
        fill="none"
        stroke="#755f4a"
        stroke-width="4"
      >
        <!-- Rising animation -->
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 4;0 -2;0 4"
          dur="2s"
          repeatCount="indefinite"
        />
      </path>

      <!-- Bread Cuts -->
      <path
        d="M85 95 C80 115, 80 130, 85 145"
        stroke="#755f4a"
        stroke-width="4"
        stroke-linecap="round"
      />
      <path
        d="M110 92 C105 115, 105 132, 110 145"
        stroke="#755f4a"
        stroke-width="4"
        stroke-linecap="round"
      />
      <path
        d="M135 95 C130 115, 130 130, 135 145"
        stroke="#755f4a"
        stroke-width="4"
        stroke-linecap="round"
      />
    </g>

    <!-- Baking Text -->
    <text
      x="110"
      y="172"
      text-anchor="middle"
      font-size="18"
      font-family="Georgia, serif"
      fill="#755f4a"
    >
      Baker
    </text>

    <!-- Animated Dots -->
    <circle cx="145" cy="166" r="3" fill="#755f4a">
      <animate
        attributeName="opacity"
        values="0;1;0"
        dur="1s"
        repeatCount="indefinite"
      />
    </circle>

    <circle cx="155" cy="166" r="3" fill="#755f4a">
      <animate
        attributeName="opacity"
        values="0;1;0"
        dur="1s"
        begin="0.3s"
        repeatCount="indefinite"
      />
    </circle>

    <circle cx="165" cy="166" r="3" fill="#755f4a">
      <animate
        attributeName="opacity"
        values="0;1;0"
        dur="1s"
        begin="0.6s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
</template>

<script setup lang="ts"></script>

<style scoped></style>
