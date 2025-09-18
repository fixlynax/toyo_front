<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- Event Create Card -->
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="flex items-center justify-between border-b pb-2">
                    <div class="text-2xl font-bold text-gray-800">Create Event</div>
                </div>

                <!-- Event Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-600">Audience</label>
                        <Dropdown v-model="event.audience" :options="audienceOptions" optionLabel="label" optionValue="value" class="w-full" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600">Survey</label>
                        <Dropdown v-model="event.isSurvey" :options="surveyOptions" optionLabel="label" optionValue="value" class="w-full" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600">Silver Point</label>
                        <InputNumber v-model="event.point1" class="w-full" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600">Gold Point</label>
                        <InputNumber v-model="event.point2" class="w-full" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600">Platinum Point</label>
                        <InputNumber v-model="event.point3" class="w-full" />
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-600">Title</label>
                        <InputText v-model="event.title" class="w-full" />
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-600">Description</label>
                        <Textarea v-model="event.desc" rows="3" class="w-full" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600">Location</label>
                        <InputText v-model="event.location" class="w-full" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600">Publish Date</label>
                        <Calendar v-model="event.publishDate" dateFormat="yy-mm-dd" class="w-full" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600">Start Date</label>
                        <Calendar v-model="event.startDate" dateFormat="yy-mm-dd" class="w-full" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600">End Date</label>
                        <Calendar v-model="event.endDate" dateFormat="yy-mm-dd" class="w-full" />
                    </div>
                </div>

                <!-- Survey Section -->
                <div v-if="event.isSurvey === 1" class="mt-8">
                    <!-- Header with Add Button -->
                    <div class="flex items-center justify-between border-b pb-2 mb-4">
                        <div class="text-xl font-bold text-gray-800">Survey Questions</div>
                        <Button 
                            icon="pi pi-plus" 
                            label="Add Question" 
                            class="p-button-success p-button-sm"
                            :disabled="questions.length >= 10"
                            @click="addQuestion" />
                    </div>

                    <!-- Questions List -->
                    <div v-if="questions.length > 0" class="space-y-4">
                        <div v-for="(q, index) in questions" :key="index" class="border rounded-lg p-4 shadow-sm bg-gray-50">
                            <div class="flex items-center justify-between mb-2">
                                <label class="font-semibold">Question {{ index + 1 }}</label>
                                <Button 
                                    icon="pi pi-trash" 
                                    class="p-button-danger p-button-text p-button-sm" 
                                    @click="removeQuestion(index)" />
                            </div>
                            <InputText v-model="q.text" placeholder="Enter your question" class="w-full mb-2" />

                            <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <InputText v-for="(ans, i) in q.options" :key="i" v-model="q.options[i]" placeholder="Answer" />
                            </div>
                        </div>
                    </div>

                    <div v-else class="text-gray-500 italic">No questions added yet.</div>
                </div>

                <!-- No Survey Message -->
                <div v-else class="mt-8 text-gray-500 italic">
                    This event does not have a survey.
                </div>
            </div>
        </div>
    </Fluid>
</template>