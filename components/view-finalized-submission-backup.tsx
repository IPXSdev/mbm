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

interface FinalizedSubmission {
  trackId: string
  firstName: string
  middleName?: string
  lastName: string
  email: string
  contactNumber: string
  proPlan: string
  proNumber: string
  publisherName: string
  publisherPRO: string
  publisherNumber: string
  copyrightOwner: string
  masterOwner: string
  isrc?: string
  upc?: string
  territoryRights: string
  duration: string
  bpm?: string
  key?: string
  lyrics?: string
  instrumentalAvailable: boolean
  additionalNotes?: string
  contributors: Array<{
    id: string
    name: string
    role: string
    percentage: number
    proPlan: string
  }>
  submittedAt: string
}

interface ViewFinalizedSubmissionProps {
  track: SubmittedTrack
  onClose: () => void
}

export default function ViewFinalizedSubmission({ track, onClose }: ViewFinalizedSubmissionProps) {
  const [loading, setLoading] = useState(true)
  const [syncData, setSyncData] = useState<FinalizedSubmission | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSyncData = async () => {
      try {
        setLoading(true)
        const data = await getSyncFinalization(track.id)
        if (data) {
          // Convert database format to component format
          const formattedData: FinalizedSubmission = {
            trackId: data.track_id,
            firstName: data.first_name,
            middleName: data.middle_name,
            lastName: data.last_name,
            email: data.email,
            contactNumber: data.contact_number,
            proPlan: data.pro_plan,
            proNumber: data.pro_number,
            publisherName: data.publisher_name,
            publisherPRO: data.publisher_pro,
            publisherNumber: data.publisher_number,
            copyrightOwner: data.copyright_owner,
            masterOwner: data.master_owner,
            isrc: data.isrc,
            upc: data.upc,
            territoryRights: data.territory_rights,
            duration: data.duration,
            bpm: data.bpm,
            key: data.key,
            lyrics: data.lyrics,
            instrumentalAvailable: data.instrumental_available,
            additionalNotes: data.additional_notes,
            contributors: data.contributors || []
          }
          setSyncData(formattedData)
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
  const [loading, setLoading] = useState(false)
  
  // Mock data - replace with actual API call
  const finalizedData: FinalizedSubmission = {
    trackId: track.id,
    firstName: "John",
    middleName: "Michael",
    lastName: "Smith",
    email: "john.smith@example.com",
    contactNumber: "(555) 123-4567",
    proPlan: "ASCAP",
    proNumber: "123456789",
    publisherName: "Smith Music Publishing",
    publisherPRO: "ASCAP",
    publisherNumber: "987654321",
    copyrightOwner: "John Smith",
    masterOwner: "John Smith",
    isrc: "USRC17607839",
    upc: "123456789012",
    territoryRights: "Worldwide",
    duration: "3:45",
    bpm: "120",
    key: "C Major",
    lyrics: "Sample lyrics content...",
    instrumentalAvailable: true,
    additionalNotes: "Additional notes about the track...",
    contributors: [
      {
        id: "1",
        name: "John Smith",
        role: "Producer",
        percentage: 50,
        proPlan: "ASCAP"
      },
      {
        id: "2", 
        name: "Jane Doe",
        role: "Songwriter",
        percentage: 50,
        proPlan: "BMI"
      }
    ],
    submittedAt: "2024-01-15T10:30:00Z"
  }

  const fullName = [syncData.firstName, syncData.middleName, syncData.lastName]
    .filter(Boolean)
    .join(" ")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-blue-900">Finalized Submission Details</h2>
            <p className="text-blue-700 mt-1">"{track.title}" by {track.artist}</p>
            <p className="text-sm text-gray-600">
              Submitted: {new Date(finalizedData.submittedAt).toLocaleDateString()}
            </p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-blue-800">Full Name</Label>
                <p className="text-gray-900 font-medium">{fullName}</p>
              </div>
              <div>
                <Label className="text-blue-800">Email Address</Label>
                <p className="text-gray-900">{finalizedData.email}</p>
              </div>
              <div>
                <Label className="text-blue-800">Contact Number</Label>
                <p className="text-gray-900">{finalizedData.contactNumber}</p>
              </div>
            </div>
          </div>

          {/* PRO Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-900 border-b pb-2">
              Performance Rights Organization (PRO)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-blue-800">PRO</Label>
                <p className="text-gray-900">{finalizedData.proPlan}</p>
              </div>
              <div>
                <Label className="text-blue-800">PRO Member Number</Label>
                <p className="text-gray-900">{finalizedData.proNumber}</p>
              </div>
            </div>
          </div>

          {/* Publisher Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-900 border-b pb-2">
              Publisher Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-blue-800">Publisher Name</Label>
                <p className="text-gray-900">{finalizedData.publisherName}</p>
              </div>
              <div>
                <Label className="text-blue-800">Publisher PRO</Label>
                <p className="text-gray-900">{finalizedData.publisherPRO}</p>
              </div>
              <div>
                <Label className="text-blue-800">Publisher PRO Number</Label>
                <p className="text-gray-900">{finalizedData.publisherNumber}</p>
              </div>
            </div>
          </div>

          {/* Rights & Ownership */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-900 border-b pb-2">
              Rights & Ownership
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-blue-800">Copyright Owner</Label>
                <p className="text-gray-900">{finalizedData.copyrightOwner}</p>
              </div>
              <div>
                <Label className="text-blue-800">Master Recording Owner</Label>
                <p className="text-gray-900">{finalizedData.masterOwner}</p>
              </div>
              <div>
                <Label className="text-blue-800">Territory Rights</Label>
                <p className="text-gray-900">{finalizedData.territoryRights}</p>
              </div>
            </div>
          </div>

          {/* Track Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-900 border-b pb-2">
              Track Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label className="text-blue-800">Duration</Label>
                <p className="text-gray-900">{finalizedData.duration}</p>
              </div>
              <div>
                <Label className="text-blue-800">BPM</Label>
                <p className="text-gray-900">{finalizedData.bpm || "Not specified"}</p>
              </div>
              <div>
                <Label className="text-blue-800">Key</Label>
                <p className="text-gray-900">{finalizedData.key || "Not specified"}</p>
              </div>
              <div>
                <Label className="text-blue-800">ISRC</Label>
                <p className="text-gray-900">{finalizedData.isrc || "Not provided"}</p>
              </div>
              <div>
                <Label className="text-blue-800">UPC/EAN</Label>
                <p className="text-gray-900">{finalizedData.upc || "Not provided"}</p>
              </div>
              <div>
                <Label className="text-blue-800">Instrumental Available</Label>
                <Badge variant={finalizedData.instrumentalAvailable ? "default" : "secondary"}>
                  {finalizedData.instrumentalAvailable ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Contributors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-900 border-b pb-2">
              Contributors & Credits
            </h3>
            <div className="space-y-3">
              {finalizedData.contributors.map((contributor, index) => (
                <div key={contributor.id} className="border rounded-lg p-4 bg-gray-50">
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
                      <Label className="text-blue-800">PRO</Label>
                      <p className="text-gray-900">{contributor.proPlan}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lyrics & Notes */}
          {(finalizedData.lyrics || finalizedData.additionalNotes) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-900 border-b pb-2">
                Additional Information
              </h3>
              {finalizedData.lyrics && (
                <div>
                  <Label className="text-blue-800">Lyrics</Label>
                  <div className="bg-gray-50 p-4 rounded-lg mt-2">
                    <p className="text-gray-900 whitespace-pre-line">{finalizedData.lyrics}</p>
                  </div>
                </div>
              )}
              {finalizedData.additionalNotes && (
                <div>
                  <Label className="text-blue-800">Additional Notes</Label>
                  <div className="bg-gray-50 p-4 rounded-lg mt-2">
                    <p className="text-gray-900">{finalizedData.additionalNotes}</p>
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
