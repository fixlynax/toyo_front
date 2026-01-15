<template>
    <Fluid>
        <div class="flex flex-col gap-6">
            <!-- Terms & Conditions Section -->
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="flex items-center pb-2 border-b">
                    <div>
                        <div class="text-2xl font-bold text-gray-800">Terms & Conditions</div>
                    </div>
                </div>

                <!-- Language Tabs -->
                <TabView v-model:activeIndex="activeTncTab">
                    <TabPanel header="English">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <!-- T-Care English -->
                            <div class="md:col-span-2 flex flex-col gap-1">
                                <label class="block text-xm font-bold text-gray-700 mb-1 flex items-center gap-2">
                                    T-Care
                                </label>
                                <div class="flex items-start gap-2">
                                    <div class="flex-1">
                                        <TipTapEditor 
                                            v-model="form.careTnc.en" 
                                            :placeholder="'Enter Care Terms & Conditions (English)'" 
                                            :disabled="loading"
                                        />
                                    </div>
                                    <Button 
                                        icon="pi pi-history" 
                                        class="p-button-sm p-button-secondary h-fit" 
                                        @click="showLog.careTnc = true" 
                                        tooltip="View Log History" 
                                        :disabled="loading" 
                                    />
                                </div>
                            </div>

                            <!-- eTEN English -->
                            <div class="md:col-span-2 flex flex-col gap-1">
                                <label class="block text-xm font-bold text-gray-700 mb-1 flex items-center gap-2">
                                    eTEN
                                </label>
                                <div class="flex items-start gap-2">
                                    <div class="flex-1">
                                        <TipTapEditor 
                                            v-model="form.etenTnc.en" 
                                            :placeholder="'Enter ETEN Terms & Conditions (English)'" 
                                            :disabled="loading"
                                        />
                                    </div>
                                    <Button 
                                        icon="pi pi-history" 
                                        class="p-button-sm p-button-secondary h-fit" 
                                        @click="showLog.etenTnc = true" 
                                        tooltip="View Log History" 
                                        :disabled="loading" 
                                    />
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                    
                    <TabPanel header="Bahasa Malaysia">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <!-- T-Care Malay -->
                            <div class="md:col-span-2 flex flex-col gap-1">
                                <label class="block text-xm font-bold text-gray-700 mb-1 flex items-center gap-2">
                                    T-Care
                                </label>
                                <div class="flex items-start gap-2">
                                    <div class="flex-1">
                                        <TipTapEditor 
                                            v-model="form.careTnc.bm" 
                                            :placeholder="'Masukkan Terma & Syarat Care (Bahasa Malaysia)'" 
                                            :disabled="loading"
                                        />
                                    </div>
                                    <Button 
                                        icon="pi pi-history" 
                                        class="p-button-sm p-button-secondary h-fit" 
                                        @click="showLog.careTnc = true" 
                                        tooltip="View Log History" 
                                        :disabled="loading" 
                                    />
                                </div>
                            </div>

                            <!-- eTEN Malay -->
                            <div class="md:col-span-2 flex flex-col gap-1">
                                <label class="block text-xm font-bold text-gray-700 mb-1 flex items-center gap-2">
                                    eTEN
                                </label>
                                <div class="flex items-start gap-2">
                                    <div class="flex-1">
                                        <TipTapEditor 
                                            v-model="form.etenTnc.bm" 
                                            :placeholder="'Masukkan Terma & Syarat ETEN (Bahasa Malaysia)'" 
                                            :disabled="loading"
                                        />
                                    </div>
                                    <Button 
                                        icon="pi pi-history" 
                                        class="p-button-sm p-button-secondary h-fit" 
                                        @click="showLog.etenTnc = true" 
                                        tooltip="View Log History" 
                                        :disabled="loading" 
                                    />
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                    
                    <TabPanel header="中文">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <!-- T-Care Chinese -->
                            <div class="md:col-span-2 flex flex-col gap-1">
                                <label class="block text-xm font-bold text-gray-700 mb-1 flex items-center gap-2">
                                    T-Care
                                </label>
                                <div class="flex items-start gap-2">
                                    <div class="flex-1">
                                        <TipTapEditor 
                                            v-model="form.careTnc.cn" 
                                            :placeholder="'输入Care条款与条件 (中文)'" 
                                            :disabled="loading"
                                        />
                                    </div>
                                    <Button 
                                        icon="pi pi-history" 
                                        class="p-button-sm p-button-secondary h-fit" 
                                        @click="showLog.careTnc = true" 
                                        tooltip="View Log History" 
                                        :disabled="loading" 
                                    />
                                </div>
                            </div>

                            <!-- eTEN Chinese -->
                            <div class="md:col-span-2 flex flex-col gap-1">
                                <label class="block text-xm font-bold text-gray-700 mb-1 flex items-center gap-2">
                                    eTEN
                                </label>
                                <div class="flex items-start gap-2">
                                    <div class="flex-1">
                                        <TipTapEditor 
                                            v-model="form.etenTnc.cn" 
                                            :placeholder="'输入ETEN条款与条件 (中文)'" 
                                            :disabled="loading"
                                        />
                                    </div>
                                    <Button 
                                        icon="pi pi-history" 
                                        class="p-button-sm p-button-secondary h-fit" 
                                        @click="showLog.etenTnc = true" 
                                        tooltip="View Log History" 
                                        :disabled="loading" 
                                    />
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                </TabView>

                <!-- Action Buttons for T&C -->
                <div class="flex justify-end gap-4 pt-4">
                    <div class="w-32">
                        <Button label="Cancel" class="w-full p-button-secondary" @click="cancel" :disabled="loading" />
                    </div>
                    <div class="w-40">
                        <Button label="Update T&C" class="w-full p-button-warning" @click="submitTncForm" :loading="loading" />
                    </div>
                </div>
            </div>

            <!-- Privacy Policy Section -->
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="flex items-center pb-2 border-b">
                    <div>
                        <div class="text-2xl font-bold text-gray-800">Privacy Policy</div>
                    </div>
                </div>

                <!-- Language Tabs -->
                <TabView v-model:activeIndex="activePolicyTab">
                    <TabPanel header="English">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <!-- Care Policy English -->
                            <div class="md:col-span-2 flex flex-col gap-1">
                                <label class="block text-xm font-bold text-gray-700 mb-1 flex items-center gap-2">
                                    T-Care
                                </label>
                                <div class="flex items-start gap-2">
                                    <div class="flex-1">
                                        <TipTapEditor 
                                            v-model="form.carePolicy.en" 
                                            :placeholder="'Enter T-Care (English)'" 
                                            :disabled="loadingPolicy"
                                        />
                                    </div>
                                    <Button 
                                        icon="pi pi-history" 
                                        class="p-button-sm p-button-secondary h-fit" 
                                        @click="showPolicyLog.carePolicy = true" 
                                        tooltip="View Log History" 
                                        :disabled="loadingPolicy" 
                                    />
                                </div>
                            </div>

                            <!-- ETEN Policy English -->
                            <div class="md:col-span-2 flex flex-col gap-1">
                                <label class="block text-xm font-bold text-gray-700 mb-1 flex items-center gap-2">
                                    eTEN
                                </label>
                                <div class="flex items-start gap-2">
                                    <div class="flex-1">
                                        <TipTapEditor 
                                            v-model="form.etenPolicy.en" 
                                            :placeholder="'Enter eTEN (English)'" 
                                            :disabled="loadingPolicy"
                                        />
                                    </div>
                                    <Button 
                                        icon="pi pi-history" 
                                        class="p-button-sm p-button-secondary h-fit" 
                                        @click="showPolicyLog.etenPolicy = true" 
                                        tooltip="View Log History" 
                                        :disabled="loadingPolicy" 
                                    />
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                    
                    <TabPanel header="Bahasa Malaysia">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <!-- Care Policy Malay -->
                            <div class="md:col-span-2 flex flex-col gap-1">
                                <label class="block text-xm font-bold text-gray-700 mb-1 flex items-center gap-2">
                                    T-Care
                                </label>
                                <div class="flex items-start gap-2">
                                    <div class="flex-1">
                                        <TipTapEditor 
                                            v-model="form.carePolicy.bm" 
                                            :placeholder="'Masukkan Dasar Privasi Care (Bahasa Malaysia)'" 
                                            :disabled="loadingPolicy"
                                        />
                                    </div>
                                    <Button 
                                        icon="pi pi-history" 
                                        class="p-button-sm p-button-secondary h-fit" 
                                        @click="showPolicyLog.carePolicy = true" 
                                        tooltip="View Log History" 
                                        :disabled="loadingPolicy" 
                                    />
                                </div>
                            </div>

                            <!-- ETEN Policy Malay -->
                            <div class="md:col-span-2 flex flex-col gap-1">
                                <label class="block text-xm font-bold text-gray-700 mb-1 flex items-center gap-2">
                                    eTEN
                                </label>
                                <div class="flex items-start gap-2">
                                    <div class="flex-1">
                                        <TipTapEditor 
                                            v-model="form.etenPolicy.bm" 
                                            :placeholder="'Masukkan Dasar Privasi ETEN (Bahasa Malaysia)'" 
                                            :disabled="loadingPolicy"
                                        />
                                    </div>
                                    <Button 
                                        icon="pi pi-history" 
                                        class="p-button-sm p-button-secondary h-fit" 
                                        @click="showPolicyLog.etenPolicy = true" 
                                        tooltip="View Log History" 
                                        :disabled="loadingPolicy" 
                                    />
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                    
                    <TabPanel header="中文">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <!-- Care Policy Chinese -->
                            <div class="md:col-span-2 flex flex-col gap-1">
                                <label class="block text-xm font-bold text-gray-700 mb-1 flex items-center gap-2">
                                    T-Care
                                </label>
                                <div class="flex items-start gap-2">
                                    <div class="flex-1">
                                        <TipTapEditor 
                                            v-model="form.carePolicy.cn" 
                                            :placeholder="'输入Care隐私政策 (中文)'" 
                                            :disabled="loadingPolicy"
                                        />
                                    </div>
                                    <Button 
                                        icon="pi pi-history" 
                                        class="p-button-sm p-button-secondary h-fit" 
                                        @click="showPolicyLog.carePolicy = true" 
                                        tooltip="View Log History" 
                                        :disabled="loadingPolicy" 
                                    />
                                </div>
                            </div>

                            <!-- ETEN Policy Chinese -->
                            <div class="md:col-span-2 flex flex-col gap-1">
                                <label class="block text-xm font-bold text-gray-700 mb-1 flex items-center gap-2">
                                    eTEN
                                </label>
                                <div class="flex items-start gap-2">
                                    <div class="flex-1">
                                        <TipTapEditor 
                                            v-model="form.etenPolicy.cn" 
                                            :placeholder="'输入ETEN隐私政策 (中文)'" 
                                            :disabled="loadingPolicy"
                                        />
                                    </div>
                                    <Button 
                                        icon="pi pi-history" 
                                        class="p-button-sm p-button-secondary h-fit" 
                                        @click="showPolicyLog.etenPolicy = true" 
                                        tooltip="View Log History" 
                                        :disabled="loadingPolicy" 
                                    />
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                </TabView>

                <!-- Action Buttons for Policy -->
                <div class="flex justify-end gap-4 pt-4">
                    <div class="w-32">
                        <Button label="Cancel" class="w-full p-button-secondary" @click="cancel" :disabled="loadingPolicy" />
                    </div>
                    <div class="w-40">
                        <Button label="Update Policy" class="w-full p-button-warning" @click="submitPolicyForm" :loading="loadingPolicy" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Log History Modal for T-Care -->
        <Dialog header="T-Care Log History" v-model:visible="showLog.careTnc" :modal="true" :closable="true" :style="{ width: '700px', 'max-width': '90vw' }">
            <TabView>
                <TabPanel header="English">
                    <div class="flex flex-col gap-3">
                        <div v-if="logHistory.careTnc.length === 0" class="p-3 text-center text-gray-500">No log history available</div>
                        <div v-for="(log, index) in logHistory.careTnc" :key="index" class="p-4 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div class="flex justify-between items-start mb-2">
                                <div class="text-sm text-gray-600">
                                    <i class="pi pi-calendar mr-2"></i>{{ formatDate(log.created) }}
                                    <span v-if="log.deleted" class="text-red-500 ml-2">(Deleted)</span>
                                </div>
                                <div class="text-sm text-gray-600">
                                    <i class="pi pi-user mr-2"></i>{{ log.updatedByName }}
                                </div>
                            </div>
                            <div class="text-sm text-gray-700 p-3 bg-white rounded border">
                                <div v-html="log.tnc" class="tiptap-content"></div>
                            </div>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel header="Bahasa Malaysia">
                    <div class="flex flex-col gap-3">
                        <div v-if="logHistory.careTnc.length === 0" class="p-3 text-center text-gray-500">Tiada sejarah log tersedia</div>
                        <div v-for="(log, index) in logHistory.careTnc" :key="index" class="p-4 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div class="flex justify-between items-start mb-2">
                                <div class="text-sm text-gray-600">
                                    <i class="pi pi-calendar mr-2"></i>{{ formatDate(log.created) }}
                                    <span v-if="log.deleted" class="text-red-500 ml-2">(Dihapus)</span>
                                </div>
                                <div class="text-sm text-gray-600">
                                    <i class="pi pi-user mr-2"></i>{{ log.updatedByName }}
                                </div>
                            </div>
                            <div class="text-sm text-gray-700 p-3 bg-white rounded border">
                                <div v-html="log.tnc_bm" class="tiptap-content"></div>
                            </div>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel header="中文">
                    <div class="flex flex-col gap-3">
                        <div v-if="logHistory.careTnc.length === 0" class="p-3 text-center text-gray-500">没有可用的历史记录</div>
                        <div v-for="(log, index) in logHistory.careTnc" :key="index" class="p-4 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div class="flex justify-between items-start mb-2">
                                <div class="text-sm text-gray-600">
                                    <i class="pi pi-calendar mr-2"></i>{{ formatDate(log.created) }}
                                    <span v-if="log.deleted" class="text-red-500 ml-2">(已删除)</span>
                                </div>
                                <div class="text-sm text-gray-600">
                                    <i class="pi pi-user mr-2"></i>{{ log.updatedByName }}
                                </div>
                            </div>
                            <div class="text-sm text-gray-700 p-3 bg-white rounded border">
                                <div v-html="log.tnc_cn" class="tiptap-content"></div>
                            </div>
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </Dialog>

        <!-- Log History Modal for eTEN -->
        <Dialog header="eTEN Log History" v-model:visible="showLog.etenTnc" :modal="true" :closable="true" :style="{ width: '700px', 'max-width': '90vw' }">
            <TabView>
                <TabPanel header="English">
                    <div class="flex flex-col gap-3">
                        <div v-if="logHistory.etenTnc.length === 0" class="p-3 text-center text-gray-500">No log history available</div>
                        <div v-for="(log, index) in logHistory.etenTnc" :key="index" class="p-4 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div class="flex justify-between items-start mb-2">
                                <div class="text-sm text-gray-600">
                                    <i class="pi pi-calendar mr-2"></i>{{ formatDate(log.created) }}
                                    <span v-if="log.deleted" class="text-red-500 ml-2">(Deleted)</span>
                                </div>
                                <div class="text-sm text-gray-600">
                                    <i class="pi pi-user mr-2"></i>{{ log.updatedByName }}
                                </div>
                            </div>
                            <div class="text-sm text-gray-700 p-3 bg-white rounded border">
                                <div v-html="log.tnc" class="tiptap-content"></div>
                            </div>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel header="Bahasa Malaysia">
                    <div class="flex flex-col gap-3">
                        <div v-if="logHistory.etenTnc.length === 0" class="p-3 text-center text-gray-500">Tiada sejarah log tersedia</div>
                        <div v-for="(log, index) in logHistory.etenTnc" :key="index" class="p-4 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div class="flex justify-between items-start mb-2">
                                <div class="text-sm text-gray-600">
                                    <i class="pi pi-calendar mr-2"></i>{{ formatDate(log.created) }}
                                    <span v-if="log.deleted" class="text-red-500 ml-2">(Dihapus)</span>
                                </div>
                                <div class="text-sm text-gray-600">
                                    <i class="pi pi-user mr-2"></i>{{ log.updatedByName }}
                                </div>
                            </div>
                            <div class="text-sm text-gray-700 p-3 bg-white rounded border">
                                <div v-html="log.tnc_bm" class="tiptap-content"></div>
                            </div>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel header="中文">
                    <div class="flex flex-col gap-3">
                        <div v-if="logHistory.etenTnc.length === 0" class="p-3 text-center text-gray-500">没有可用的历史记录</div>
                        <div v-for="(log, index) in logHistory.etenTnc" :key="index" class="p-4 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div class="flex justify-between items-start mb-2">
                                <div class="text-sm text-gray-600">
                                    <i class="pi pi-calendar mr-2"></i>{{ formatDate(log.created) }}
                                    <span v-if="log.deleted" class="text-red-500 ml-2">(已删除)</span>
                                </div>
                                <div class="text-sm text-gray-600">
                                    <i class="pi pi-user mr-2"></i>{{ log.updatedByName }}
                                </div>
                            </div>
                            <div class="text-sm text-gray-700 p-3 bg-white rounded border">
                                <div v-html="log.tnc_cn" class="tiptap-content"></div>
                            </div>
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </Dialog>

        <!-- Log History Modal for Care Policy -->
        <Dialog header="T-Care Log History" v-model:visible="showPolicyLog.carePolicy" :modal="true" :closable="true" :style="{ width: '700px', 'max-width': '90vw' }">
            <TabView>
                <TabPanel header="English">
                    <div class="flex flex-col gap-3">
                        <div v-if="policyHistory.carePolicy.length === 0" class="p-3 text-center text-gray-500">No log history available</div>
                        <div v-for="(log, index) in policyHistory.carePolicy" :key="index" class="p-4 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div class="flex justify-between items-start mb-2">
                                <div class="text-sm text-gray-600">
                                    <i class="pi pi-calendar mr-2"></i>{{ formatDate(log.created) }}
                                    <span v-if="log.deleted" class="text-red-500 ml-2">(Deleted)</span>
                                </div>
                                <div class="text-sm text-gray-600">
                                    <i class="pi pi-user mr-2"></i>{{ log.updatedByName }}
                                </div>
                            </div>
                            <div class="text-sm text-gray-700 p-3 bg-white rounded border">
                                <div v-html="log.policy" class="tiptap-content"></div>
                            </div>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel header="Bahasa Malaysia">
                    <div class="flex flex-col gap-3">
                        <div v-if="policyHistory.carePolicy.length === 0" class="p-3 text-center text-gray-500">Tiada sejarah log tersedia</div>
                        <div v-for="(log, index) in policyHistory.carePolicy" :key="index" class="p-4 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div class="flex justify-between items-start mb-2">
                                <div class="text-sm text-gray-600">
                                    <i class="pi pi-calendar mr-2"></i>{{ formatDate(log.created) }}
                                    <span v-if="log.deleted" class="text-red-500 ml-2">(Dihapus)</span>
                                </div>
                                <div class="text-sm text-gray-600">
                                    <i class="pi pi-user mr-2"></i>{{ log.updatedByName }}
                                </div>
                            </div>
                            <div class="text-sm text-gray-700 p-3 bg-white rounded border">
                                <div v-html="log.policy_bm" class="tiptap-content"></div>
                            </div>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel header="中文">
                    <div class="flex flex-col gap-3">
                        <div v-if="policyHistory.carePolicy.length === 0" class="p-3 text-center text-gray-500">没有可用的历史记录</div>
                        <div v-for="(log, index) in policyHistory.carePolicy" :key="index" class="p-4 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div class="flex justify-between items-start mb-2">
                                <div class="text-sm text-gray-600">
                                    <i class="pi pi-calendar mr-2"></i>{{ formatDate(log.created) }}
                                    <span v-if="log.deleted" class="text-red-500 ml-2">(已删除)</span>
                                </div>
                                <div class="text-sm text-gray-600">
                                    <i class="pi pi-user mr-2"></i>{{ log.updatedByName }}
                                </div>
                            </div>
                            <div class="text-sm text-gray-700 p-3 bg-white rounded border">
                                <div v-html="log.policy_cn" class="tiptap-content"></div>
                            </div>
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </Dialog>

        <!-- Log History Modal for ETEN Policy -->
        <Dialog header="eTEN Log History" v-model:visible="showPolicyLog.etenPolicy" :modal="true" :closable="true" :style="{ width: '700px', 'max-width': '90vw' }">
            <TabView>
                <TabPanel header="English">
                    <div class="flex flex-col gap-3">
                        <div v-if="policyHistory.etenPolicy.length === 0" class="p-3 text-center text-gray-500">No log history available</div>
                        <div v-for="(log, index) in policyHistory.etenPolicy" :key="index" class="p-4 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div class="flex justify-between items-start mb-2">
                                <div class="text-sm text-gray-600">
                                    <i class="pi pi-calendar mr-2"></i>{{ formatDate(log.created) }}
                                    <span v-if="log.deleted" class="text-red-500 ml-2">(Deleted)</span>
                                </div>
                                <div class="text-sm text-gray-600">
                                    <i class="pi pi-user mr-2"></i>{{ log.updatedByName }}
                                </div>
                            </div>
                            <div class="text-sm text-gray-700 p-3 bg-white rounded border">
                                <div v-html="log.policy" class="tiptap-content"></div>
                            </div>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel header="Bahasa Malaysia">
                    <div class="flex flex-col gap-3">
                        <div v-if="policyHistory.etenPolicy.length === 0" class="p-3 text-center text-gray-500">Tiada sejarah log tersedia</div>
                        <div v-for="(log, index) in policyHistory.etenPolicy" :key="index" class="p-4 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div class="flex justify-between items-start mb-2">
                                <div class="text-sm text-gray-600">
                                    <i class="pi pi-calendar mr-2"></i>{{ formatDate(log.created) }}
                                    <span v-if="log.deleted" class="text-red-500 ml-2">(Dihapus)</span>
                                </div>
                                <div class="text-sm text-gray-600">
                                    <i class="pi pi-user mr-2"></i>{{ log.updatedByName }}
                                </div>
                            </div>
                            <div class="text-sm text-gray-700 p-3 bg-white rounded border">
                                <div v-html="log.policy_bm" class="tiptap-content"></div>
                            </div>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel header="中文">
                    <div class="flex flex-col gap-3">
                        <div v-if="policyHistory.etenPolicy.length === 0" class="p-3 text-center text-gray-500">没有可用的历史记录</div>
                        <div v-for="(log, index) in policyHistory.etenPolicy" :key="index" class="p-4 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div class="flex justify-between items-start mb-2">
                                <div class="text-sm text-gray-600">
                                    <i class="pi pi-calendar mr-2"></i>{{ formatDate(log.created) }}
                                    <span v-if="log.deleted" class="text-red-500 ml-2">(已删除)</span>
                                </div>
                                <div class="text-sm text-gray-600">
                                    <i class="pi pi-user mr-2"></i>{{ log.updatedByName }}
                                </div>
                            </div>
                            <div class="text-sm text-gray-700 p-3 bg-white rounded border">
                                <div v-html="log.policy_cn" class="tiptap-content"></div>
                            </div>
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import TipTapEditor from '@/components/TipTapEditor.vue';
import api from '@/service/api';

const router = useRouter();
const toast = useToast();

// Add active tab indices
const activeTncTab = ref(0);
const activePolicyTab = ref(0);

// Update form structure to support multiple languages
const form = ref({
    careTnc: {
        en: '',
        bm: '',
        cn: ''
    },
    etenTnc: {
        en: '',
        bm: '',
        cn: ''
    },
    carePolicy: {
        en: '',
        bm: '',
        cn: ''
    },
    etenPolicy: {
        en: '',
        bm: '',
        cn: ''
    }
});

const loading = ref(false);
const loadingPolicy = ref(false);

const showLog = ref({
    careTnc: false,
    etenTnc: false
});

const showPolicyLog = ref({
    carePolicy: false,
    etenPolicy: false
});

const logHistory = ref({
    careTnc: [],
    etenTnc: []
});

const policyHistory = ref({
    carePolicy: [],
    etenPolicy: []
});

const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    
    let formatted = date.toLocaleString('en-MY', options);
    
    // Convert AM/PM to uppercase regardless of case
    return formatted.replace(/\b(am|pm)\b/gi, (match) => match.toUpperCase());
};

onMounted(async () => {
    await Promise.all([fetchTncData(), fetchPolicyData()]);
});

const fetchTncData = async () => {
    loading.value = true;
    try {
        const response = await api.get('admin/getTNC');

        if (response.data.history_eten) {
            logHistory.value.etenTnc = response.data.history_eten;
            const lastEtenTnc = response.data.last_eten_tnc;
            if (lastEtenTnc) {
                form.value.etenTnc.en = lastEtenTnc.tnc || '';
                form.value.etenTnc.bm = lastEtenTnc.tnc_bm || '';
                form.value.etenTnc.cn = lastEtenTnc.tnc_cn || '';
            }
        }

        if (response.data.history_care) {
            logHistory.value.careTnc = response.data.history_care;
            const lastCareTnc = response.data.last_care_tnc;
            if (lastCareTnc) {
                form.value.careTnc.en = lastCareTnc.tnc || '';
                form.value.careTnc.bm = lastCareTnc.tnc_bm || '';
                form.value.careTnc.cn = lastCareTnc.tnc_cn || '';
            }
        }

        // Check if all fields are empty
        const allTncEmpty = 
            (!form.value.careTnc.en || form.value.careTnc.en.trim() === '') &&
            (!form.value.careTnc.bm || form.value.careTnc.bm.trim() === '') &&
            (!form.value.careTnc.cn || form.value.careTnc.cn.trim() === '') &&
            (!form.value.etenTnc.en || form.value.etenTnc.en.trim() === '') &&
            (!form.value.etenTnc.bm || form.value.etenTnc.bm.trim() === '') &&
            (!form.value.etenTnc.cn || form.value.etenTnc.cn.trim() === '');

        if (allTncEmpty) {
            toast.add({
                severity: 'info',
                summary: 'Info',
                detail: 'Enter T&C in at least one language and click Update',
                life: 3000
            });
        }

        toast.add({
            severity: 'success',
            summary: 'Loaded',
            detail: 'T&C data loaded successfully',
            life: 2000
        });
    } catch (error) {
        console.error('Error fetching T&C data:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load Terms & Conditions',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};

const fetchPolicyData = async () => {
    loadingPolicy.value = true;
    try {
        const response = await api.get('admin/getPolicy');

        if (response.data.history_eten) {
            policyHistory.value.etenPolicy = response.data.history_eten;
            const lastEtenPolicy = response.data.last_eten_policy;
            if (lastEtenPolicy) {
                form.value.etenPolicy.en = lastEtenPolicy.policy || '';
                form.value.etenPolicy.bm = lastEtenPolicy.policy_bm || '';
                form.value.etenPolicy.cn = lastEtenPolicy.policy_cn || '';
            }
        }

        if (response.data.history_care) {
            policyHistory.value.carePolicy = response.data.history_care;
            const lastCarePolicy = response.data.last_care_policy;
            if (lastCarePolicy) {
                form.value.carePolicy.en = lastCarePolicy.policy || '';
                form.value.carePolicy.bm = lastCarePolicy.policy_bm || '';
                form.value.carePolicy.cn = lastCarePolicy.policy_cn || '';
            }
        }

        toast.add({
            severity: 'success',
            summary: 'Loaded',
            detail: 'Privacy Policy data loaded successfully',
            life: 2000
        });
    } catch (error) {
        console.error('Error fetching Policy data:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load Privacy Policy',
            life: 3000
        });
    } finally {
        loadingPolicy.value = false;
    }
};

const cancel = () => {
    toast.add({
        severity: 'warn',
        summary: 'Cancelled',
        detail: 'No changes were saved',
        life: 2000
    });
    router.push('/it/dashboard');
};

const submitTncForm = async () => {
    // Check if any content exists in any language for either app
    const isEmptyHtmlContent = (html) => {
        if (!html) return true;
        const text = html.replace(/<[^>]*>/g, '').trim();
        return text === '';
    };

    const careTncEmpty = 
        isEmptyHtmlContent(form.value.careTnc.en) && 
        isEmptyHtmlContent(form.value.careTnc.bm) && 
        isEmptyHtmlContent(form.value.careTnc.cn);
    
    const etenTncEmpty = 
        isEmptyHtmlContent(form.value.etenTnc.en) && 
        isEmptyHtmlContent(form.value.etenTnc.bm) && 
        isEmptyHtmlContent(form.value.etenTnc.cn);

    if (careTncEmpty && etenTncEmpty) {
        toast.add({
            severity: 'warn',
            summary: 'Required',
            detail: 'At least one T&C must be filled in any language',
            life: 3000
        });
        return;
    }

    loading.value = true;
    toast.add({
        severity: 'info',
        summary: 'Saving',
        detail: 'Updating Terms & Conditions...',
        life: 2000
    });

    try {
        const response = await api.post('admin/updateTNC', {
            eten_tnc_text: form.value.etenTnc.en || null,
            eten_tnc_text_bm: form.value.etenTnc.bm || null,
            eten_tnc_text_cn: form.value.etenTnc.cn || null,
            care_tnc_text: form.value.careTnc.en || null,
            care_tnc_text_bm: form.value.careTnc.bm || null,
            care_tnc_text_cn: form.value.careTnc.cn || null
        });

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Updated',
                detail: response.data.message || 'Terms & Conditions updated successfully',
                life: 3000
            });

            await fetchTncData();
        } else {
            throw new Error(response.data.error || 'Update failed');
        }
    } catch (error) {
        console.error('Error updating T&C:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data?.error || error.message || 'Failed to update T&C',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};

const submitPolicyForm = async () => {
    // Check if any content exists in any language for either app
    const isEmptyHtmlContent = (html) => {
        if (!html) return true;
        const text = html.replace(/<[^>]*>/g, '').trim();
        return text === '';
    };

    const carePolicyEmpty = 
        isEmptyHtmlContent(form.value.carePolicy.en) && 
        isEmptyHtmlContent(form.value.carePolicy.bm) && 
        isEmptyHtmlContent(form.value.carePolicy.cn);
    
    const etenPolicyEmpty = 
        isEmptyHtmlContent(form.value.etenPolicy.en) && 
        isEmptyHtmlContent(form.value.etenPolicy.bm) && 
        isEmptyHtmlContent(form.value.etenPolicy.cn);

    if (carePolicyEmpty && etenPolicyEmpty) {
        toast.add({
            severity: 'warn',
            summary: 'Required',
            detail: 'At least one Privacy Policy must be filled in any language',
            life: 3000
        });
        return;
    }

    loadingPolicy.value = true;
    toast.add({
        severity: 'info',
        summary: 'Saving',
        detail: 'Updating Privacy Policy...',
        life: 2000
    });

    try {
        const response = await api.post('admin/updatePolicy', {
            eten_policy_text: form.value.etenPolicy.en || null,
            eten_policy_text_bm: form.value.etenPolicy.bm || null,
            eten_policy_text_cn: form.value.etenPolicy.cn || null,
            care_policy_text: form.value.carePolicy.en || null,
            care_policy_text_bm: form.value.carePolicy.bm || null,
            care_policy_text_cn: form.value.carePolicy.cn || null
        });

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Updated',
                detail: response.data.message || 'Privacy Policy updated successfully',
                life: 3000
            });

            await fetchPolicyData();
        } else {
            throw new Error(response.data.error || 'Update failed');
        }
    } catch (error) {
        console.error('Error updating Policy:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data?.error || error.message || 'Failed to update Privacy Policy',
            life: 3000
        });
    } finally {
        loadingPolicy.value = false;
    }
};
</script>

<style scoped>
.card {
    @apply bg-white rounded-lg shadow-sm p-6;
}

/* Additional styles for the tiptap content display */
.tiptap-content {
    line-height: 1.6;
}

.tiptap-content p {
    margin-bottom: 1em;
}

.tiptap-content h1,
.tiptap-content h2,
.tiptap-content h3 {
    margin: 1em 0 0.5em 0;
    font-weight: bold;
}

.tiptap-content h1 { font-size: 1.5em; }
.tiptap-content h2 { font-size: 1.25em; }
.tiptap-content h3 { font-size: 1.1em; }

.tiptap-content ul,
.tiptap-content ol {
    padding-left: 1.5em;
    margin: 0.5em 0;
}

.tiptap-content li {
    margin: 0.25em 0;
}

/* Style for PrimeVue tabs */
.p-tabview-panels {
    padding: 1rem 0 0 0;
}
</style>