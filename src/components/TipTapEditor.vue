<template>
    <div class="tiptap-editor" :class="{ disabled: disabled }">
        <div v-if="editor" class="toolbar">
            <!-- Bold -->
            <button type="button" @click="editor.chain().focus().toggleBold().run()" :class="{ active: editor.isActive('bold') }" :disabled="disabled || !editor.can().chain().focus().toggleBold().run()" :title="'Bold (Ctrl+B)'">
                <svg v-if="showIcons" xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24">
                    <path
                        d="M8 11H12.5C13.8807 11 15 9.88071 15 8.5C15 7.11929 13.8807 6 12.5 6H8V11ZM18 15.5C18 17.9853 15.9853 20 13.5 20H6V4H12.5C14.9853 4 17 6.01472 17 8.5C17 9.70431 16.5289 10.7981 15.7564 11.6058C17.0979 12.3847 18 13.837 18 15.5ZM8 13V18H13.5C14.8807 18 16 16.8807 16 15.5C16 14.1193 14.8807 13 13.5 13H8Z"
                    ></path>
                </svg>
                <span v-else>B</span>
            </button>

            <!-- Italic -->
            <button type="button" @click="editor.chain().focus().toggleItalic().run()" :class="{ active: editor.isActive('italic') }" :disabled="disabled || !editor.can().chain().focus().toggleItalic().run()" :title="'Italic (Ctrl+I)'">
                <svg v-if="showIcons" xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24">
                    <path d="M15 20H7V18H9.92661L12.0425 6H9V4H17V6H14.0734L11.9575 18H15V20Z"></path>
                </svg>
                <span v-else>I</span>
            </button>

            <!-- Underline -->
            <button type="button" @click="editor.chain().focus().toggleUnderline().run()" :class="{ active: editor.isActive('underline') }" :disabled="disabled || !editor.can().chain().focus().toggleUnderline().run()" :title="'Underline (Ctrl+U)'">
                <svg v-if="showIcons" xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24">
                    <path d="M8 3V12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12V3H18V12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12V3H8ZM4 20H20V22H4V20Z"></path>
                </svg>
                <span v-else>U</span>
            </button>

            <!-- Strike -->
            <button type="button" @click="editor.chain().focus().toggleStrike().run()" :class="{ active: editor.isActive('strike') }" :disabled="disabled || !editor.can().chain().focus().toggleStrike().run()" :title="'Strikethrough'">
                <svg v-if="showIcons" xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24">
                    <path
                        d="M17.1538 14C17.3846 14.5161 17.5 15.0893 17.5 15.7196C17.5 17.0625 16.9762 18.1116 15.9286 18.867C14.8809 19.6223 13.4335 20 11.5862 20C9.94674 20 8.32335 19.6185 6.71592 18.8555V16.6009C8.23538 17.4783 9.7908 17.917 11.3822 17.917C13.9333 17.917 15.2128 17.1846 15.2208 15.7196C15.2208 15.0939 15.0049 14.5598 14.5731 14.1173C14.5339 14.0772 14.4939 14.0381 14.4531 14H3V12H21V14H17.1538ZM13.076 11H7.62908C7.4566 10.8433 7.29616 10.6692 7.14776 10.4778C6.71592 9.92028 6.5 9.24559 6.5 8.45373C6.5 7.0842 7.19889 6.02576 8.59667 5.2784C9.99444 4.53104 11.6606 4.15737 13.5952 4.15737C15.4548 4.15737 17.1019 4.62452 18.5365 5.55883V7.75257C17.116 6.61336 15.5866 6.03325 13.9481 6.01226C12.3097 5.99127 11.0974 6.38468 10.3112 7.1925C9.525 8.00031 9.1319 8.98612 9.1319 10.1499C9.1319 10.4391 9.16686 10.7208 9.23678 10.995C9.30669 11.2692 9.41156 11.5055 9.55138 11.7038C9.66725 11.8611 9.79516 12 9.9351 12H13.076V11Z"
                    ></path>
                </svg>
                <span v-else>S</span>
            </button>

            <div class="separator"></div>

            <!-- H1 -->
            <button type="button" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ active: editor.isActive('heading', { level: 1 }) }" :disabled="disabled" :title="'Heading 1'">H1</button>

            <!-- H2 -->
            <button type="button" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ active: editor.isActive('heading', { level: 2 }) }" :disabled="disabled" :title="'Heading 2'">H2</button>

            <!-- H3 -->
            <button type="button" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ active: editor.isActive('heading', { level: 3 }) }" :disabled="disabled" :title="'Heading 3'">H3</button>

            <div class="separator"></div>

            <!-- Bullet List -->
            <button type="button" @click="editor.chain().focus().toggleBulletList().run()" :class="{ active: editor.isActive('bulletList') }" :disabled="disabled" :title="'Bullet List'">
                <svg v-if="showIcons" xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24">
                    <path d="M11 4H21V6H11V4ZM11 8H21V10H11V8ZM11 12H21V14H11V12ZM3 4H9V10H3V4ZM5 6V8H7V6H5ZM3 14H9V20H3V14ZM5 16V18H7V16H5Z"></path>
                </svg>
                <span v-else>•</span>
            </button>

            <!-- Numbered List -->
            <button type="button" @click="editor.chain().focus().toggleOrderedList().run()" :class="{ active: editor.isActive('orderedList') }" :disabled="disabled" :title="'Numbered List'">
                <svg v-if="showIcons" xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24">
                    <path d="M8 4H21V6H8V4ZM5 3V6H6V7H3V6H4V4H3V3H5ZM3 14V11.5H5V11H3V10H6V12.5H4V13H6V14H3ZM5 19.5H3V18.5H5V18H3V17H6V21H3V20H5V19.5ZM8 11H21V13H8V11ZM8 18H21V20H8V18Z"></path>
                </svg>
                <span v-else>1.</span>
            </button>

            <div class="separator"></div>

            <!-- Undo -->
            <button type="button" @click="editor.chain().focus().undo().run()" :disabled="disabled || !editor.can().chain().focus().undo().run()" :title="'Undo (Ctrl+Z)'">
                <svg v-if="showIcons" xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24">
                    <path d="M8 7V11L2 6L8 1V5H13C17.4183 5 21 8.58172 21 13C21 17.4183 17.4183 21 13 21H4V19H13C16.3137 19 19 16.3137 19 13C19 9.68629 16.3137 7 13 7H8Z"></path>
                </svg>
                <span v-else>↶</span>
            </button>

            <!-- Redo -->
            <button type="button" @click="editor.chain().focus().redo().run()" :disabled="disabled || !editor.can().chain().focus().redo().run()" :title="'Redo (Ctrl+Y)'">
                <svg v-if="showIcons" xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24">
                    <path d="M16 7H11C7.68629 7 5 9.68629 5 13C5 16.3137 7.68629 19 11 19H20V17H11C8.79086 17 7 15.2091 7 13C7 10.7909 8.79086 9 11 9H16V5L22 10L16 15V7Z"></path>
                </svg>
                <span v-else>↷</span>
            </button>

            <div class="separator"></div>

            <!-- Clear Format -->
            <button type="button" @click="clearFormatting" :disabled="disabled" :title="'Clear Formatting'">
                <!-- <svg v-if="showIcons" xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24">
                    <path
                        d="M12.651 14.065L11.605 20H9.574l1.35-7.661-7.41-7.41L4.929 3.929l16.97 16.97-1.414 1.415-6.834-6.835v-.002zM14.802 11.355l1.442-8.18L16.457 2H18v2h-1.256l-1.389 7.878-5.928-5.929L9.038 4.408l5.764 5.764v.183zm2.085 2.086l-1.414-1.414L17.656 12l-1.414-1.414L19.07 9.172l1.414 1.414L20.485 12l1.414 1.414-1.414 1.414-1.415-1.414-1.414 1.414-1.414-1.414 1.414-1.414-1.414-1.415z"
                    ></path>
                </svg> -->
                Clear
            </button>
        </div>

        <div class="editor-content" @click="editor?.chain().focus().run()">
            <editor-content :editor="editor" />
        </div>

        <div v-if="showCharacterCount" class="character-count">{{ characterCount }} characters</div>
    </div>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { watch, onBeforeUnmount, computed, ref } from 'vue';

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: 'Start typing...'
    },
    disabled: {
        type: Boolean,
        default: false
    },
    showCharacterCount: {
        type: Boolean,
        default: true
    },
    showIcons: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits(['update:modelValue']);

const editor = useEditor({
    extensions: [
        StarterKit.configure({
            heading: {
                levels: [1, 2, 3]
            }
        }),
        Underline,
        Placeholder.configure({
            placeholder: props.placeholder
        })
    ],
    content: props.modelValue,
    editable: !props.disabled,
    onUpdate: () => {
        const html = editor.value.getHTML();
        emit('update:modelValue', html === '<p></p>' ? '' : html);
    },
    editorProps: {
        attributes: {
            class: 'tiptap-prose',
            spellcheck: 'false'
        }
    }
});

watch(
    () => props.modelValue,
    (value) => {
        const isSame = editor.value.getHTML() === value;
        if (!isSame) {
            editor.value.commands.setContent(value || '');
        }
    }
);

watch(
    () => props.disabled,
    (value) => {
        editor.value.setEditable(!value);
    }
);

const clearFormatting = () => {
    editor.value.chain().focus().clearNodes().unsetAllMarks().run();
};

onBeforeUnmount(() => {
    editor.value?.destroy();
});
const characterCount = computed(() => {
    if (!editor.value) return 0;
    const text = editor.value.getText();
    return text.length;
});
</script>

<style scoped>
.tiptap-editor {
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    background: white;
    transition: all 0.3s;
}

.tiptap-editor.disabled {
    background: #f9fafb;
    opacity: 0.7;
}

.tiptap-editor:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
}

.toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 8px;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
    border-radius: 6px 6px 0 0;
}

.toolbar button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px 8px;
    border: 1px solid #d1d5db;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    min-width: 36px;
    height: 32px;
    transition: all 0.2s;
}

.toolbar button:hover:not(:disabled) {
    background: #f3f4f6;
    border-color: #9ca3af;
}

.toolbar button.active {
    background: #3b82f6;
    color: white;
    border-color: #2563eb;
}

.toolbar button.active svg {
    fill: white;
}

.toolbar button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.toolbar .separator {
    width: 1px;
    background: #d1d5db;
    margin: 0 4px;
}

.icon {
    width: 16px;
    height: 16px;
    fill: #374151;
}

.toolbar button.active .icon {
    fill: white;
}

.editor-content {
    min-height: 150px;
    max-height: 400px;
    overflow-y: auto;
    padding: 16px;
    cursor: text;
}

.editor-content:deep(.tiptap-prose) {
    outline: none;
    min-height: 120px;
}

.editor-content:deep(.tiptap-prose p) {
    margin: 0 0 0.75em 0;
}

.editor-content:deep(.tiptap-prose h1) {
    font-size: 1.5em;
    font-weight: bold;
    margin: 1em 0 0.5em 0;
}

.editor-content:deep(.tiptap-prose h2) {
    font-size: 1.25em;
    font-weight: bold;
    margin: 1em 0 0.5em 0;
}

.editor-content:deep(.tiptap-prose h3) {
    font-size: 1.1em;
    font-weight: bold;
    margin: 1em 0 0.5em 0;
}

.editor-content:deep(.tiptap-prose ul),
.editor-content:deep(.tiptap-prose ol) {
    padding-left: 1.5em;
    margin: 0.5em 0;
}

.editor-content:deep(.tiptap-prose li) {
    margin: 0.25em 0;
}

.character-count {
    padding: 8px 16px;
    border-top: 1px solid #e5e7eb;
    font-size: 12px;
    color: #6b7280;
    text-align: right;
    background: #f9fafb;
    border-radius: 0 0 6px 6px;
}
</style>
