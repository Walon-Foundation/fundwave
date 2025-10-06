"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Edit, Trash2, Calendar,  MessageCircle, Loader2, X, Save } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Updates } from "@/types/api"
import { api } from "@/lib/api/api"
import { toast, Toaster } from "react-hot-toast"


export default function CampaignUpdatesPage() {
  const param = useParams<{id:string}>()
  const [updates, setUpdates] = useState<Updates[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newUpdate, setNewUpdate] = useState({
    title: "",
    message: "",
    image: null as File | null,
    imagePreview: null as string | null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [editingUpdateId, setEditingUpdateId] = useState<string | null>(null)
  const [editUpdate, setEditUpdate] = useState({
    title: "",
    message: "",
    image: null as File | null,
    imagePreview: null as string | null,
    existingImage: null as string | null,
  })

  useEffect(() => {
    async function getData(){
      try {
        setIsFetching(true)
        const response = await api.getUpdate(param.id)
        setUpdates(response as Updates[])
      } catch (error) {
        console.error("Failed to fetch updates:", error)
        toast.error("Failed to load updates. Please try again.")
      } finally {
        setIsFetching(false)
      }
    }

    getData()
  }, [param.id])


  const handleCreateUpdate = async() => {
    if (!newUpdate.title.trim() || !newUpdate.message.trim()) return
    
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("title", newUpdate.title)
      formData.append("content", newUpdate.message)
      
      if (newUpdate.image) {
        formData.append("image", newUpdate.image)
      }

      const response = await api.createUpdate(formData, param.id)
      if (response.data) {
        setUpdates([response.data, ...updates])
      } 
      else {
        setUpdates([response, ...updates])
      }
      
      toast.success("updated created")
      setNewUpdate({ title: "", message: "", image: null, imagePreview: null })
      setShowCreateForm(false)
    } catch (error) {
      console.error("Failed to create update:", error)
      toast.error("Failed to create update. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUpdate = async(updateId: string) => {
    if (!confirm("Are you sure you want to delete this update?"))return

    try{
      await api.deleteUpdate(param.id, updateId)
      setUpdates(updates.filter((u) => u.id !== updateId))
      toast.success("update deleted")
    }catch(err){
      console.log(err)
      toast.error("failed to delete update")
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      setNewUpdate((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }))
    }
  }

  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      setEditUpdate((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }))
    }
  }

  const handleStartEdit = (update: Updates) => {
    setEditingUpdateId(update.id)
    setEditUpdate({
      title: update.title,
      message: update.message,
      image: null,
      imagePreview: null,
      existingImage: update.image || null
    })
  }

  const handleCancelEdit = () => {
    setEditingUpdateId(null)
    setEditUpdate({
      title: "",
      message: "",
      image: null,
      imagePreview: null,
      existingImage: null
    })
  }

  const handleSaveEdit = async(updateId: string) => {
    if (!editUpdate.title.trim() || !editUpdate.message.trim()) return
    
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("title", editUpdate.title)
      formData.append("content", editUpdate.message)
      
      if (editUpdate.image) {
        formData.append("image", editUpdate.image)
      }

      const response = await api.updateUpdate(formData, param.id, updateId)
      
      // Update the local state with the edited update
      setUpdates(updates.map(update => 
        update.id === updateId ? response : update
      ))
      
      setEditingUpdateId(null)
      setEditUpdate({
        title: "",
        message: "",
        image: null,
        imagePreview: null,
        existingImage: null
      })
      toast.success("Update edited successfully")
    } catch (error) {
      console.error("Failed to edit update:", error)
      toast.error("Failed to edit update. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const removeImageFromEdit = () => {
    setEditUpdate(prev => ({
      ...prev,
      image: null,
      imagePreview: null,
      existingImage: null
    }))
  }

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="ml-2 text-slate-700">Loading updates...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/campaigns/${param.id}`}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Campaign
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Campaign Updates</h1>
              <p className="text-xl text-slate-600">Keep your supporters informed about your progress</p>
            </div>
            <button onClick={() => setShowCreateForm(true)} className="btn-primary flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              New Update
            </button>
          </div>
        </div>

        {/* Create Update Form */}
        {showCreateForm && (
          <div className="card mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Create New Update</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Update Title</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter update title"
                  value={newUpdate.title}
                  onChange={(e) => setNewUpdate({ ...newUpdate, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Update Content</label>
                <textarea
                  rows={6}
                  className="input"
                  placeholder="Share your progress, challenges, or achievements..."
                  value={newUpdate.message}
                  onChange={(e) => setNewUpdate({ ...newUpdate, message: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Image (Optional)</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="input" 
                />
                {newUpdate.imagePreview && (
                  <div className="mt-4 relative">
                    <Image
                      src={newUpdate.imagePreview}
                      alt="Update image preview"
                      width={200}
                      height={150}
                      className="rounded-lg object-cover w-full h-48"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button 
                  onClick={() => setShowCreateForm(false)} 
                  className="btn-outline"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateUpdate} 
                  className="btn-primary flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    "Publish Update"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Updates List */}
        <div className="space-y-6">
          {updates.map((update) => (
            <div key={update.id} className="card">
              {editingUpdateId === update.id ? (
                // Edit Form
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-slate-900">Edit Update</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSaveEdit(update.id)}
                        className="text-green-600 hover:text-green-800 p-2"
                        title="Save Changes"
                        disabled={isLoading}
                      >
                        <Save className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-slate-500 hover:text-slate-700 p-2"
                        title="Cancel Edit"
                        disabled={isLoading}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Update Title</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Enter update title"
                      value={editUpdate.title}
                      onChange={(e) => setEditUpdate({ ...editUpdate, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Update Content</label>
                    <textarea
                      rows={6}
                      className="input"
                      placeholder="Share your progress, challenges, or achievements..."
                      value={editUpdate.message}
                      onChange={(e) => setEditUpdate({ ...editUpdate, message: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Image (Optional)</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleEditImageUpload} 
                      className="input" 
                    />
                    
                    {(editUpdate.imagePreview || editUpdate.existingImage) && (
                      <div className="mt-4 relative">
                        <Image
                          src={editUpdate.imagePreview as string || editUpdate.existingImage as string}
                          alt="Update image"
                          width={300}
                          height={200}
                          className="rounded-lg object-cover w-full h-48"
                        />
                        <button
                          onClick={removeImageFromEdit}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          title="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Display Update
                <>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-semibold text-slate-900">{update.title}</h3>
                      </div>
                      <div className="flex items-center text-sm text-slate-600 mb-4">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{new Date(update.createdAt).toLocaleDateString()}</span>
                        {update.updatedAt !== update.createdAt && (
                          <span className="ml-2 text-xs text-slate-500">(edited)</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleStartEdit(update)}
                        className="text-indigo-600 hover:text-indigo-800 p-2"
                        title="Edit Update"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUpdate(update.id)}
                        className="text-red-600 hover:text-red-800 p-2"
                        title="Delete Update"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="prose max-w-none mb-4">
                    <p className="text-slate-700 whitespace-pre-line">{update.message}</p>
                  </div>

                  {update.image && (
                    <div className="mt-4">
                      <Image
                        src={update.image}
                        alt="Update image"
                        width={300}
                        height={200}
                        className="rounded-lg object-cover w-full h-48"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          {updates.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No updates yet</h3>
              <p className="text-slate-600 mb-4">
                Keep your supporters engaged by sharing regular updates about your campaign progress.
              </p>
              <button onClick={() => setShowCreateForm(true)} className="btn-primary">
                Create Your First Update
              </button>
            </div>
          )}
        </div>
      </div>
      <Toaster
      position="top-center"
      toastOptions={{
        duration:3000
      }}
      />
    </div>
  )
}