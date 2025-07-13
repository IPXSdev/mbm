"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { getSyncFinalization } from "@/lib/db"

interface SubmittedTrack {
  id: string
  title: string
  artist: string
  genre: string
  status: "pending" | "approved" | "rejected" | "under_review"
  created_at: string
  image_url?: string
  file_url?: string
  description?: string
  admin_notes?: string
  email?: string
  file_count?: number
  image_count?: number
}

interface ViewFinalizedSubmissionProps {
  track: SubmittedTrack
  onClose: () => void
}

export default function ViewFinalizedSubmission({ track, onClose }: ViewFinalizedSubmissionProps) {
  const [loading, setLoading] = useState(true)
  const [syncData, setSyncData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSyncData = async () => {
      try {
        setLoading(true)
        const data = await getSyncFinalization(track.id)
        if (data) {
          setSyncData(data)
        } else {
          setError("No sync finalization data found for this track.")
        }
      } catch (err: any) {
        console.error("Error loading sync data:", err)
        setError("Failed to load sync finalization data.")
      } finally {
        setLoading(false)
      }
    }

    loadSyncData()
  }, [track.id])

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sync finalization details...</p>
        </div>
      </div>
    )
  }

  if (error || !syncData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Data Not Available</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    )
  }

  const fullName = [syncData.first_name, syncData.middle_name, syncData.last_name]
    .filter(Boolean)
    .join(" ")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-blue-900">Sync Finalization Details</h2>
            <p className="text-blue-700 mt-1">"{track.title}" by {track.artist}</p>
            <Badge variant="outline" className="mt-2 bg-green-100 text-green-800">
              Finalized for Sync Licensing
            </Badge>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-900 border-b pb-2">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-blue-800">Full Name</Label>
                <p className="text-gray-900">{fullName}</p>
              </div>
              <div>
                <Label className="text-blue-800">Email</Label>
                <p className="text-gray-900">{syncData.email}</p>
              </div>
              <div>
                <Label className="text-blue-800">Contact Number</Label>
                <p className="text-gray-900">{syncData.contact_number}</p>
              </div>
            </div>
          </div>

          {/* PRO Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-900 border-b pb-2">
              PRO Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-blue-800">PRO Plan</Label>
                <p className="text-gray-900">{syncData.pro_plan}</p>
              </div>
              <div>
                <Label className="text-blue-800">PRO Number</Label>
                <p className="text-gray-900">{syncData.pro_number}</p>
              </div>
            </div>
          </div>

          {/* Publisher Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-900 border-b pb-2">
              Publisher Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-blue-800">Publisher Name</Label>
                <p className="text-gray-900">{syncData.publisher_name}</p>
              </div>
              <div>
                <Label className="text-blue-800">Publisher PRO</Label>
                <p className="text-gray-900">{syncData.publisher_pro}</p>
              </div>
              <div>
                <Label className="text-blue-800">Publisher Number</Label>
                <p className="text-gray-900">{syncData.publisher_number}</p>
              </div>
            </div>
          </div>

          {/* Rights and Ownership */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-900 border-b pb-2">
              Rights and Ownership
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-blue-800">Copyright Owner</Label>
                <p className="text-gray-900">{syncData.copyright_owner}</p>
              </div>
              <div>
                <Label className="text-blue-800">Master Owner</Label>
                <p className="text-gray-900">{syncData.master_owner}</p>
              </div>
              <div>
                <Label className="text-blue-800">Territory Rights</Label>
                <p className="text-gray-900">{syncData.territory_rights}</p>
              </div>
            </div>
          </div>

          {/* Track Metadata */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-900 border-b pb-2">
              Track Metadata
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div>
                <Label className="text-blue-800">Duration</Label>
                <p className="text-gray-900">{syncData.duration}</p>
              </div>
              <div>
                <Label className="text-blue-800">BPM</Label>
                <p className="text-gray-900">{syncData.bpm || "Not specified"}</p>
              </div>
              <div>
                <Label className="text-blue-800">Key</Label>
                <p className="text-gray-900">{syncData.key || "Not specified"}</p>
              </div>
              <div>
                <Label className="text-blue-800">ISRC</Label>
                <p className="text-gray-900">{syncData.isrc || "Not provided"}</p>
              </div>
              <div>
                <Label className="text-blue-800">UPC</Label>
                <p className="text-gray-900">{syncData.upc || "Not provided"}</p>
              </div>
              <div>
                <Label className="text-blue-800">Instrumental Available</Label>
                <Badge variant={syncData.instrumental_available ? "default" : "secondary"}>
                  {syncData.instrumental_available ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Contributors */}
          {syncData.contributors && syncData.contributors.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-900 border-b pb-2">
                Contributors ({syncData.contributors.length})
              </h3>
              <div className="space-y-3">
                {syncData.contributors.map((contributor: any, index: number) => (
                  <div key={contributor.id || index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-blue-800">Name</Label>
                        <p className="text-gray-900">{contributor.name}</p>
                      </div>
                      <div>
                        <Label className="text-blue-800">Role</Label>
                        <p className="text-gray-900">{contributor.role}</p>
                      </div>
                      <div>
                        <Label className="text-blue-800">Percentage</Label>
                        <p className="text-gray-900">{contributor.percentage}%</p>
                      </div>
                      <div>
                        <Label className="text-blue-800">PRO Plan</Label>
                        <p className="text-gray-900">{contributor.proPlan}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Information */}
          {(syncData.lyrics || syncData.additional_notes) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-900 border-b pb-2">
                Additional Information
              </h3>
              {syncData.lyrics && (
                <div>
                  <Label className="text-blue-800">Lyrics</Label>
                  <div className="bg-gray-50 p-4 rounded-lg mt-2">
                    <p className="text-gray-900 whitespace-pre-line">{syncData.lyrics}</p>
                  </div>
                </div>
              )}
              {syncData.additional_notes && (
                <div>
                  <Label className="text-blue-800">Additional Notes</Label>
                  <div className="bg-gray-50 p-4 rounded-lg mt-2">
                    <p className="text-gray-900">{syncData.additional_notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end pt-6 border-t">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
