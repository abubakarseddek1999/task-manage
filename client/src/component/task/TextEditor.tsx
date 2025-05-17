"use client"

import React from "react"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import TextAlign from "@tiptap/extension-text-align"
import { useState, useRef } from "react"

// Ensure setIsUploading is declared as part of useState
import LinkExtension from "@tiptap/extension-link"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ImageIcon,
  Link,
  Heading2,
  Code,
  Paperclip,
  Loader2,
} from "lucide-react"

interface TextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function TextEditor({ content, onChange, placeholder = "Enter task..." }: TextEditorProps) {
  const [isLinkInputVisible, setIsLinkInputVisible] = useState(false)
  const [isUploading, setIsUploading] = useState(false) // Declare state for upload status
  const [linkUrl, setLinkUrl] = useState("") // Declare state for link URL
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      LinkExtension.configure({
        openOnClick: true,
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          "w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none mb-2 min-h-[120px] prose prose-sm max-w-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  const addImage = (url: string) => {
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const uploadToImageBB = async (file: File) => {
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("image", file)

      // Using your ImageBB API key
      const response = await fetch("https://api.imgbb.com/1/upload?key=8c95c1dfdebd1604b24b162d5154275c", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        // Return the direct image URL from ImageBB
        return data.data.url
      } else {
        console.error("Image upload failed:", data)
        throw new Error("Image upload failed")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0]

      try {
        // Upload to ImageBB and get URL
        const imageUrl = await uploadToImageBB(file)

        // Add the image URL to the editor
        addImage(imageUrl)

        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } catch (error) {
        alert("Failed to upload image. Please try again.")
      }
    }
  }

  const setLink = () => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()
      setLinkUrl("")
      setIsLinkInputVisible(false)
    }
  }

  return (
    <div className="text-editor">
      <div className="flex flex-wrap items-center gap-1 mb-2 border border-gray-300 rounded-md p-1 bg-gray-50">
        <div
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive("bold") ? "bg-gray-200" : ""}`}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </div>
        <div
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive("italic") ? "bg-gray-200" : ""}`}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </div>

        <div className="h-4 w-px bg-gray-300 mx-1" />

        <div
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""}`}
          title="Heading"
        >
          <Heading2 className="h-4 w-4" />
        </div>

        <div
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive("codeBlock") ? "bg-gray-200" : ""}`}
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </div>

        <div className="h-4 w-px bg-gray-300 mx-1" />

        <div
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive("bulletList") ? "bg-gray-200" : ""}`}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </div>
        <div
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive("orderedList") ? "bg-gray-200" : ""}`}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </div>

        <div className="h-4 w-px bg-gray-300 mx-1" />

        <div
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""}`}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </div>
        <div
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""}`}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </div>
        <div
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""}`}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </div>

        <div className="h-4 w-px bg-gray-300 mx-1" />

        {/* Image Upload div */}
        <div
          onClick={!isUploading ? () => fileInputRef.current?.click() : undefined}
          className={`p-1 rounded hover:bg-gray-200 relative ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
          title="Upload Image"
        >
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
          disabled={isUploading}
        />

        {/* Link div */}
        <div className="relative">
          <div
            onClick={() => setIsLinkInputVisible(!isLinkInputVisible)}
            className={`p-1 rounded hover:bg-gray-200 ${editor.isActive("link") ? "bg-gray-200" : ""}`}
            title="Add Link"
          >
            <Link className="h-4 w-4" />
          </div>

          {isLinkInputVisible && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-2 flex">
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="text-sm border border-gray-300 rounded-l-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <div onClick={setLink} className="bg-blue-500 text-white px-2 py-1 rounded-r-md text-sm">
                Add
              </div>
            </div>
          )}
        </div>

        {/* Attachment div (for future implementation) */}
        <div className="p-1 rounded hover:bg-gray-200" title="Add Attachment">
          <Paperclip className="h-4 w-4" />
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
