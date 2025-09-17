<template>
  <Fluid>
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Left Content -->
      <div class="md:w-2/3">
        <div class="card flex flex-col gap-6 w-full">
          <!-- Header -->
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-800">{{ event.title }}</h1><br>
            <p class="text-gray-700 leading-relaxed mt-2">{{ event.desc }}</p>
            <Tag :value="event.status === 1 ? 'Active' : 'Inactive'" :severity="event.status === 1 ? 'success' : 'danger'" />
          </div>

          <!-- Event Images -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <img :src="event.image1URL" alt="Event Image 1" class="rounded-xl shadow-sm object-cover w-full h-40" />
            <img :src="event.image2URL" alt="Event Image 2" class="rounded-xl shadow-sm object-cover w-full h-40" />
            <img :src="event.image3URL" alt="Event Image 3" class="rounded-xl shadow-sm object-cover w-full h-40" />
          </div>

          <!-- Event Info -->
          <div class="mt-6">
            <h2 class="font-semibold text-xl text-gray-800 border-b pb-2">📍 Event Details</h2>
            <div class="flex flex-col md:flex-row gap-4 mt-3">
              <div class="w-full">
                <span class="block text-sm text-gray-500">Location</span>
                <p class="text-lg font-medium">{{ event.location }}</p>
              </div>
              <div class="w-full">
                <span class="block text-sm text-gray-500">Audience</span>
                <p class="text-lg font-medium">{{ event.audience }}</p>
              </div>
            </div>

            <div class="flex flex-col md:flex-row gap-4 mt-3">
              <div class="w-full">
                <span class="block text-sm text-gray-500">Start Date</span>
                <p class="text-lg font-medium">{{ event.startDate }}</p>
              </div>
              <div class="w-full">
                <span class="block text-sm text-gray-500">End Date</span>
                <p class="text-lg font-medium">{{ event.endDate }}</p>
              </div>
              <div class="w-full">
                <span class="block text-sm text-gray-500">Published</span>
                <p class="text-lg font-medium">{{ event.publishDate }}</p>
              </div>
            </div>
          </div>

          <!-- Engagement -->
          <div class="mt-6">
            <h2 class="font-semibold text-xl text-gray-800 border-b pb-2">📊 Engagement</h2>
            <div class="flex flex-col md:flex-row gap-4 mt-3">
              <div class="w-full">
                <span class="block text-sm text-gray-500">Point 1</span>
                <p class="text-lg font-medium">{{ event.point1 }}</p>
              </div>
              <div class="w-full">
                <span class="block text-sm text-gray-500">Point 2</span>
                <p class="text-lg font-medium">{{ event.point2 }}</p>
              </div>
              <div class="w-full">
                <span class="block text-sm text-gray-500">Point 3</span>
                <p class="text-lg font-medium">{{ event.point3 }}</p>
              </div>
            </div>
            <div class="mt-3">
              <span class="block text-sm text-gray-500">Total Views</span>
              <p class="text-lg font-medium">{{ event.view }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Sidebar -->
      <div class="md:w-1/3 flex flex-col gap-6">
        <!-- Quick Info -->
        <div class="card p-4">
          <h2 class="text-xl font-bold text-gray-800 border-b pb-2 mb-4">ℹ️ Quick Info</h2>
          <ul class="space-y-2 text-sm text-gray-700">
            <li><strong>ID:</strong> {{ event.id }}</li>
            <li><strong>Survey:</strong> {{ event.isSurvey ? 'Yes' : 'No' }}</li>
            <li><strong>Created:</strong> {{ event.created }}</li>
            <li><strong>Deleted:</strong> {{ event.deleted || '-' }}</li>
          </ul>
        </div>

        <!-- Actions -->
        <div class="card p-4">
          <h2 class="text-xl font-bold text-gray-800 border-b pb-2 mb-4">⚙️ Actions</h2>
          <div class="flex flex-col gap-3">
            <Button label="Edit Event" icon="pi pi-pencil" class="p-button-info w-full" />
            <Button label="Delete Event" icon="pi pi-trash" class="p-button-danger w-full" />
          </div>
        </div>
      </div>
    </div>
  </Fluid>
</template>

<script setup>
import { ref } from "vue";

const event = ref({
  id: 1,
  audience: "Public",
  isSurvey: false,
  point1: 85,
  point2: 90,
  point3: 95,
  title: "Toyo Tires Drift Challenge 2025",
  image1URL: "/demo/images/event-toyo-1.jpg",
  image2URL: "/demo/images/event-toyo-2.jpg",
  image3URL: "/demo/images/event-toyo-3.jpg",
  desc: "Experience the thrill of high-speed drifting powered by Toyo Tires. Join us for a weekend of motorsport excitement!",
  location: "Sepang International Circuit, Malaysia",
  publishDate: "2025-01-10",
  startDate: "2025-02-15",
  endDate: "2025-02-16",
  view: 542,
  status: 1,
  created: "2025-01-05",
  deleted: null,
});
</script>
