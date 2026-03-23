<template>
  <div class="pt-6 h-100">
    <Title :title="'Vår historie'" :show-header-lines="true" />

    <div class="about-container" style="padding: 4rem 1.5rem">
      <div v-if="settingsStore.siteSettings" class="about-content">
        <!-- About text sections -->
        <div class="text-section">
          <div
            v-if="settingsStore.siteSettings.ourStory"
            class="about-text story-content"
            v-html="renderedStory"
          />
        </div>

        <!-- About image -->
        <div
          v-if="settingsStore.siteSettings.aboutUsImageUrl"
          class="image-section"
        >
          <img
            :src="settingsStore.siteSettings.aboutUsImageUrl"
            alt="About us"
            class="about-image"
          />
        </div>
      </div>

      <div v-else class="loading-placeholder">
        <LoadingOverlay v-if="settingsStore.loading" />
        <p v-else>No about information available</p>
      </div>
    </div>

    <div v-if="employees.length > 0" class="employees-section">
      <div class="employees-grid">
        <div
          v-for="employee in employees"
          :key="employee._id"
          class="employee-card"
        >
          <div v-if="employee.imageUrl" class="employee-image-wrapper">
            <img
              :src="employee.imageUrl"
              :alt="employee.name"
              class="employee-image"
            />
          </div>
          <div v-else class="employee-placeholder">
            <span class="employee-initials">{{
              getInitials(employee.name)
            }}</span>
          </div>
          <div class="employee-info">
            <h3 class="employee-name">{{ employee.name }}</h3>
            <p class="employee-title">{{ employee.title }}</p>
            <p v-if="employee.bio" class="employee-bio">{{ employee.bio }}</p>
            <div class="employee-contact">
              <a
                v-if="employee.email"
                :href="`mailto:${employee.email}`"
                class="contact-link"
              >
                {{ employee.email }}
              </a>
              <span v-if="employee.phone" class="contact-link">
                {{ employee.phone }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Process Section -->
    <div v-if="settingsStore.siteSettings?.process" class="process-section">
      <Title :title="settingsStore.siteSettings.process.title" color="white" />
      <p
        v-if="settingsStore.siteSettings.process.subtitle"
        class="process-subtitle"
      >
        {{ settingsStore.siteSettings.process.subtitle }}
      </p>
      <p
        v-if="settingsStore.siteSettings.process.description"
        class="process-description"
      >
        {{ settingsStore.siteSettings.process.description }}
      </p>
      <div class="timeline-container">
        <v-timeline class="w-75">
          <v-timeline-item
            :dot-color="'oak'"
            :line-color="'oak'"
            :fill-dot="true"
            :size="'x-small'"
            :side="timelineSide"
            v-for="(item, index) in processItems"
            :key="index"
          >
            <v-card class="step-content elevation-0">
              <div
                :class="[
                  'step-label',
                  !timelineSide && index % 2 && 'step-label-right',
                ]"
              >
                {{ "Steg" + " " + item.step }}
              </div>
              <h3
                :class="[
                  'step-title',
                  !timelineSide && index % 2 && 'step-title-right',
                ]"
              >
                {{ item.title }}
              </h3>
              <div
                :class="[
                  'step-description',
                  !timelineSide && index % 2 && 'step-description-right',
                ]"
              >
                {{ item.description }}
              </div>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </div>
      <div class="final-remark-wrapper">
        <p
          v-if="settingsStore.siteSettings.process.finalRemark"
          class="process-final-remark"
        >
          {{ settingsStore.siteSettings.process.finalRemark }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from "vue";
  import { useDisplay } from "vuetify";
  import { useSettingsStore } from "~/stores/settings.store";
  import { sanityService } from "~/services/sanityService";
  import type { Employee } from "~/models/employee.interface";
  import type { ProcessStep } from "~/models/process.interface";
  import Title from "~/components/Title.vue";
  import LoadingOverlay from "~/components/LoadingOverlay.vue";

  const settingsStore = useSettingsStore();
  const employees = ref<Employee[]>([]);
  const { renderBlocks } = usePortableText();
  const { smAndDown } = useDisplay();

  const timelineSide = computed(() => (smAndDown.value ? "end" : undefined));

  const renderedStory = computed(() =>
    renderBlocks(settingsStore.siteSettings?.ourStory),
  );

  const processItems = computed(() => {
    if (!settingsStore.siteSettings?.process?.steps) return [];
    return settingsStore.siteSettings.process.steps.map(
      (step: ProcessStep, index: number) => ({
        title: step.title,
        step: `${index + 1}`,
        description: step.description,
      }),
    );
  });

  // SEO
  useSeo({
    title: "Om oss - Villheva",
    description:
      "Lær om Villhevas historie, verdier og dedikasjon til tradisjonell baking.",
    type: "website",
  });

  // Fetch settings on mount
  if (!settingsStore.siteSettings) {
    await settingsStore.fetchSiteSettings();
  }

  // Fetch employees
  try {
    employees.value = await sanityService.getEmployees();
  } catch (error) {
    console.error("Failed to fetch employees:", error);
  }

  // Helper function to get initials from name
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
</script>

<style scoped>
  .about-container {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
  }

  .about-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
  }

  .text-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .about-text {
    font-size: 1rem;
    line-height: 1.6;
    color: #333;
    margin: 0;
  }

  .story-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .story-content :deep(p) {
    margin-bottom: 1rem;
    line-height: 1.6;
    color: #333;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .story-content :deep(h1),
  .story-content :deep(h2),
  .story-content :deep(h3) {
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    font-weight: 600;
    color: #333;
  }

  .story-content :deep(h1) {
    font-size: 1.875rem;
  }

  .story-content :deep(h2) {
    font-size: 1.5rem;
  }

  .story-content :deep(h3) {
    font-size: 1.25rem;
  }

  .story-content :deep(strong) {
    font-weight: 600;
  }

  .story-content :deep(em) {
    font-style: italic;
  }

  .story-content :deep(u) {
    text-decoration: underline;
  }

  .story-content :deep(code) {
    background-color: #f3f4f6;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-family: monospace;
  }

  .image-section {
    display: flex;
    justify-content: center;
  }

  .about-image {
    width: 100%;
    max-width: 500px;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .loading-placeholder {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
  }

  /* Employees Section */
  .employees-section {
    max-width: 1200px;
    margin: 4rem auto 2rem;
    padding: 0 1rem;
  }

  .employees-title {
    font-size: 2rem;
    font-weight: 600;
    text-align: center;
    margin-bottom: 3rem;
    color: #333;
  }

  .employees-grid {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 2rem;
  }

  .employee-card {
    width: 100%;
    max-width: 180px;
    min-height: 320px;
    background: #fff;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .employee-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  .employee-image-wrapper {
    width: 120px;
    height: 120px;
    overflow: hidden;
    background: #f5f5f5;
    border-radius: 50%;
    margin-bottom: 0.75rem;
  }

  .employee-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .employee-placeholder {
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    margin-bottom: 0.75rem;
  }

  .employee-initials {
    font-size: 2rem;
    font-weight: 700;
    color: white;
  }

  .employee-info {
    text-align: center;
  }

  .employee-name {
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0 0 0.25rem 0;
    color: #333;
  }

  .employee-title {
    font-size: 0.75rem;
    color: #666;
    margin: 0 0 0.5rem 0;
  }

  .employee-bio {
    font-size: 0.7rem;
    line-height: 1.3;
    color: #555;
    margin: 0 0 0.5rem 0;
  }

  .employee-contact {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    font-size: 0.7rem;
  }

  .contact-link {
    color: #667eea;
    text-decoration: none;
  }

  .contact-link:hover {
    text-decoration: underline;
  }

  /* Process Section Timeline */
  .process-section {
    width: 100%;

    padding: 2rem 1rem;
    background-color: #4d4738;
  }

  .process-title {
    font-size: 2rem;
    font-weight: 600;
    text-align: center;
    margin-bottom: 1rem;
    color: white;
  }

  .process-subtitle {
    font-size: 1rem;
    text-align: center;
    font-style: italic;
    font-weight: 200;
    margin-bottom: 2rem;
    color: #f0f0f0;
    line-height: 1.6;
    max-width: 500px;
    margin: 0 auto;
    padding-bottom: 2rem;
  }

  .process-description {
    font-size: 0.95rem;
    text-align: center;
    margin-bottom: 3rem;
    color: #f0f0f0;
    line-height: 1.8;
    max-width: 600px;
    margin: 0 auto;
    padding-bottom: 3rem;
  }

  .timeline-container {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
  }

  .step-content {
    min-height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: white;
    background-color: transparent !important;
    max-width: 300px;
  }

  .step-label {
    color: #c0ae94;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .step-label-right {
    display: flex;
    justify-content: flex-end;
    text-align: right;
  }

  .step-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: white;
    margin: 0 0 0.75rem 0;
  }

  .step-title-right {
    display: flex;
    justify-content: flex-end;
    text-align: right;
  }

  .step-description {
    font-size: 0.95rem;
    color: #f0f0f0;
    line-height: 1.6;
  }

  .step-description-right {
    display: flex;
    justify-content: flex-end;
    text-align: right;
  }

  .final-remark-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }

  .process-final-remark {
    display: inline-block;
    border: 1px solid #c0ae94;
    border-radius: 1rem;
    padding: 1.5rem 2rem;
    max-width: 42rem;
    font-size: 0.95rem;
    text-align: center;
    color: #c0ae94;
    line-height: 1.6;
    font-style: italic;
    margin: 0;
  }

  /* Reduce timeline dot size */
  .process-section :deep(.v-timeline-divider__dot) {
    width: 16px !important;
    height: 16px !important;
    min-width: 16px !important;
    background-color: #c0ae94 !important;
  }
  .process-section :deep(.v-timeline-divider__after) {
    background-color: #c0ae94 !important;
  }
  .process-section :deep(.v-timeline-divider__before) {
    background-color: #c0ae94 !important;
  }

  .process-section :deep(.v-timeline-divider__line) {
    border-color: #c0ae94 !important;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .about-content {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .about-image {
      max-width: 100%;
    }

    .employees-grid {
      grid-template-columns: 1fr;
    }

    .employees-title {
      font-size: 1.5rem;
    }

    .process-section {
      max-width: 100%;
      margin: 4rem 0;
      padding: 2rem 1rem;
    }

    .timeline-container {
      width: 100%;
    }
  }
</style>
