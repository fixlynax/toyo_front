<template>
    <div class="tiptap-editor-desc" :class="{ disabled: disabledDesc }">
        <div v-if="editorDesc" class="toolbar-desc">
            <!-- Bullet List -->
            <button type="button" @click="editorDesc.chain().focus().toggleBulletList().run()" :class="{ active: editorDesc.isActive('bulletList') }" :disabled="disabledDesc" :title="'Bullet List'">
                <svg v-if="showIconsDesc" xmlns="http://www.w3.org/2000/svg" class="icon-desc" viewBox="0 0 24 24">
                    <path d="M11 4H21V6H11V4ZM11 8H21V10H11V8ZM11 12H21V14H11V12ZM3 4H9V10H3V4ZM5 6V8H7V6H5ZM3 14H9V20H3V14ZM5 16V18H7V16H5Z"></path>
                </svg>
                <span v-else>•</span>
            </button>

            <!-- Numbered List -->
            <button type="button" @click="editorDesc.chain().focus().toggleOrderedList().run()" :class="{ active: editorDesc.isActive('orderedList') }" :disabled="disabledDesc" :title="'Numbered List'">
                <svg v-if="showIconsDesc" xmlns="http://www.w3.org/2000/svg" class="icon-desc" viewBox="0 0 24 24">
                    <path d="M8 4H21V6H8V4ZM5 3V6H6V7H3V6H4V4H3V3H5ZM3 14V11.5H5V11H3V10H6V12.5H4V13H6V14H3ZM5 19.5H3V18.5H5V18H3V17H6V21H3V20H5V19.5ZM8 11H21V13H8V11ZM8 18H21V20H8V18Z"></path>
                </svg>
                <span v-else>1.</span>
            </button>

            <div class="separator-desc"></div>

            <!-- Undo -->
            <button type="button" @click="editorDesc.chain().focus().undo().run()" :disabled="disabledDesc || !editorDesc.can().chain().focus().undo().run()" :title="'Undo (Ctrl+Z)'">
                <svg v-if="showIconsDesc" xmlns="http://www.w3.org/2000/svg" class="icon-desc" viewBox="0 0 24 24">
                    <path d="M8 7V11L2 6L8 1V5H13C17.4183 5 21 8.58172 21 13C21 17.4183 17.4183 21 13 21H4V19H13C16.3137 19 19 16.3137 19 13C19 9.68629 16.3137 7 13 7H8Z"></path>
                </svg>
                <span v-else>↶</span>
            </button>

            <!-- Redo -->
            <button type="button" @click="editorDesc.chain().focus().redo().run()" :disabled="disabledDesc || !editorDesc.can().chain().focus().redo().run()" :title="'Redo (Ctrl+Y)'">
                <svg v-if="showIconsDesc" xmlns="http://www.w3.org/2000/svg" class="icon-desc" viewBox="0 0 24 24">
                    <path d="M16 7H11C7.68629 7 5 9.68629 5 13C5 16.3137 7.68629 19 11 19H20V17H11C8.79086 17 7 15.2091 7 13C7 10.7909 8.79086 9 11 9H16V5L22 10L16 15V7Z"></path>
                </svg>
                <span v-else>↷</span>
            </button>

            <div class="separator-desc"></div>

            <!-- Clear Format -->
            <button type="button" @click="clearFormattingDesc" :disabled="disabledDesc" :title="'Clear Formatting'">Clear</button>
        </div>

        <div class="editor-content-desc" @click="editorDesc?.chain().focus().run()">
            <EditorContent :editor="editorDesc" />
        </div>

        <div v-if="showCharacterCountDesc" class="character-count-desc">{{ characterCountDesc }} characters</div>
    </div>
</template>

<script>
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { watch, onBeforeUnmount, computed } from 'vue';

export default {
    name: 'TipTapEditorDesc',
    components: {
        EditorContent
    },
    props: {
        modelValue: {
            type: String,
            default: ''
        },
        placeholderDesc: {
            type: String,
            default: 'Start typing...'
        },
        disabledDesc: {
            type: Boolean,
            default: false
        },
        showCharacterCountDesc: {
            type: Boolean,
            default: true
        },
        showIconsDesc: {
            type: Boolean,
            default: true
        }
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const editorDesc = useEditor({
            extensions: [
                StarterKit.configure({
                    heading: false,
                    bold: false,
                    italic: false,
                    strike: false,
                    code: false,
                    blockquote: false,
                    horizontalRule: false,
                    codeBlock: false
                }),
                Placeholder.configure({
                    placeholder: props.placeholderDesc
                })
            ],
            content: props.modelValue,
            editable: !props.disabledDesc,
            onUpdate: () => {
                const html = editorDesc.value.getHTML();
                emit('update:modelValue', html === '<p></p>' ? '' : html);
            },
            editorProps: {
                attributes: {
                    class: 'tiptap-prose-desc',
                    spellcheck: 'false'
                }
            },
            immediatelyRender: false
        });

        watch(
            () => props.modelValue,
            (value) => {
                const isSame = editorDesc.value.getHTML() === value;
                if (!isSame) {
                    setTimeout(() => {
                        editorDesc.value.commands.setContent(value || '', false);
                    }, 0);
                }
            }
        );

        watch(
            () => props.disabledDesc,
            (value) => {
                editorDesc.value.setEditable(!value);
            }
        );

        const clearFormattingDesc = () => {
            editorDesc.value.chain().focus().clearNodes().unsetAllMarks().run();
        };

        onBeforeUnmount(() => {
            editorDesc.value?.destroy();
        });

        const characterCountDesc = computed(() => {
            if (!editorDesc.value) return 0;
            const text = editorDesc.value.getText();
            return text.length;
        });

        return {
            editorDesc,
            clearFormattingDesc,
            characterCountDesc
        };
    }
};
</script>

<style scoped>
.tiptap-editor-desc {
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    background: white;
    transition: all 0.3s;
}

.tiptap-editor-desc.disabled {
    background: #f9fafb;
    opacity: 0.7;
}

.tiptap-editor-desc:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
}

.toolbar-desc {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 8px;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
    border-radius: 6px 6px 0 0;
}

.toolbar-desc button {
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

.toolbar-desc button:hover:not(:disabled) {
    background: #f3f4f6;
    border-color: #9ca3af;
}

.toolbar-desc button.active {
    background: #3b82f6;
    color: white;
    border-color: #2563eb;
}

.toolbar-desc button.active svg {
    fill: white;
}

.toolbar-desc button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.toolbar-desc .separator-desc {
    width: 1px;
    background: #d1d5db;
    margin: 0 4px;
}

.icon-desc {
    width: 16px;
    height: 16px;
    fill: #374151;
}

.toolbar-desc button.active .icon-desc {
    fill: white;
}

.editor-content-desc {
    min-height: 100px;
    max-height: 300px;
    overflow-y: auto;
    padding: 12px;
    cursor: text;
}

.editor-content-desc :deep(.tiptap-prose-desc) {
    outline: none;
    min-height: 80px;
    font-size: 14px;
    line-height: 1.6;
}

.editor-content-desc :deep(.tiptap-prose-desc p) {
    margin: 0 0 0.75em 0;
}

.editor-content-desc :deep(.tiptap-prose-desc ul) {
    list-style-type: disc !important;
    padding-left: 1.5em !important;
    margin: 0.5em 0 !important;
}

.editor-content-desc :deep(.tiptap-prose-desc ol) {
    list-style-type: decimal !important;
    padding-left: 1.5em !important;
    margin: 0.5em 0 !important;
}

.editor-content-desc :deep(.tiptap-prose-desc li) {
    margin: 0.25em 0 !important;
}

.editor-content-desc :deep(.tiptap-prose-desc li > p) {
    margin: 0 !important;
}

.editor-content-desc :deep(.tiptap-prose-desc p.is-empty:first-child::before) {
    content: attr(data-placeholder);
    float: left;
    color: #adb5bd;
    pointer-events: none;
    height: 0;
}

.character-count-desc {
    padding: 8px 12px;
    border-top: 1px solid #e5e7eb;
    font-size: 12px;
    color: #6b7280;
    text-align: right;
    background: #f9fafb;
    border-radius: 0 0 6px 6px;
}
</style>
