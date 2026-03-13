<div x-data="{ isOpen: true, isConnected: false, endpoint: '', secret: '', apiVersion: '', region: '' }"
    x-init="$watch('isOpen', value => window.dispatchEvent(new CustomEvent('credential-dropdown:toggle', { detail: { isOpen: value } }))); window.dispatchEvent(new CustomEvent('credential-dropdown:toggle', { detail: { isOpen: isOpen } }));"
    class="relative inline-block text-left">
    <!-- Trigger / small window -->
        <button type="button"
            @click.stop="isOpen = !isOpen"
            class="inline-flex items-center justify-between w-full max-w-xs px-4 py-2 bg-white text-gray-700 font-medium rounded-md border border-gray-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-300 transition">
        <div class="flex items-center space-x-3 truncate">
            <template x-if="!isConnected">
                <svg class="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0-1.1.9-2 2-2s2 .9 2 2M6 8v8"/></svg>
                <span class="truncate">Configure Credentials</span>
            </template>

            <template x-if="isConnected">
                <div class="flex items-center space-x-2 truncate">
                    <span class="px-2 py-1 text-xs font-semibold text-white bg-gradient-to-r from-teal-400 to-teal-500 rounded">Connected</span>
                    <span class="text-sm text-gray-700 truncate" x-text="endpoint"></span>
                </div>
            </template>
        </div>
        <svg :class="{ 'rotate-180 transform': isOpen }" class="ml-3 h-4 w-4 text-gray-400 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 111.14.98l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>
    </button>

    <!-- Dropdown panel (in-flow so it pushes siblings) -->
    <div
         @click.away="isOpen = false"
         class="w-full max-w-2xl overflow-hidden transition-all duration-200"
         :style="isOpen ? 'max-height:520px; opacity:1; padding-top:1rem; padding-bottom:1rem' : 'max-height:0; opacity:0; padding-top:0; padding-bottom:0'">
        <div class="bg-white rounded-lg shadow-inner ring-1 ring-black ring-opacity-5">
            <div class="p-4">
                <h3 class="text-sm font-semibold text-gray-700 mb-2">Connect API</h3>
                <form @submit.prevent="isConnected = true; isOpen = false" class="space-y-3">
                    <div>
                        <label for="credential-endpoint" class="sr-only">API Endpoint</label>
                        <input id="credential-endpoint" type="text" x-model="endpoint" placeholder="https://api.example.com" required
                               class="block w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-300 text-gray-700" />
                    </div>

                    <div>
                        <label for="credential-secret" class="sr-only">Secret Key</label>
                        <input id="credential-secret" type="password" x-model="secret" placeholder="Secret key" required
                               class="block w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-300 text-gray-700" />
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label for="credential-version" class="sr-only">API Version</label>
                            <input id="credential-version" type="text" x-model="apiVersion" placeholder="v1"
                                   class="block w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-300 text-gray-700" />
                        </div>
                        <div>
                            <label for="credential-region" class="sr-only">Region</label>
                            <input id="credential-region" type="text" x-model="region" placeholder="us-west-1"
                                   class="block w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-300 text-gray-700" />
                        </div>
                    </div>

                    <div class="flex items-center justify-between">
                        <small class="text-xs text-gray-500">Credentials stored locally during session only</small>
                        <div class="flex items-center space-x-2">
                            <button type="button" @click="endpoint=''; secret=''; apiVersion=''; region=''; isConnected=false" class="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200">Reset</button>
                            <button type="submit" class="ml-3 inline-flex items-center px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-300 transition">Start</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
