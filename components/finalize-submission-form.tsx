"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"

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

interface Contributor {
  id: string
  name: string
  role: string
  percentage: number
  proPlan: string
}

interface FinalizeSubmissionFormProps {
  track: SubmittedTrack
  onClose: () => void
}

export default function FinalizeSubmissionForm({ track, onClose }: FinalizeSubmissionFormProps) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  
  // Main submission info
  const [proPlan, setProPlan] = useState("")
  const [proNumber, setProNumber] = useState("")
  const [publisherName, setPublisherName] = useState("")
  const [publisherPRO, setPublisherPRO] = useState("")
  const [publisherNumber, setPublisherNumber] = useState("")
  const [copyrightOwner, setCopyrightOwner] = useState("")
  const [masterOwner, setMasterOwner] = useState("")
  const [isrc, setIsrc] = useState("")
  const [upc, setUpc] = useState("")
  const [territoryRights, setTerritoryRights] = useState("")
  const [duration, setDuration] = useState("")
  const [bpm, setBpm] = useState("")
  const [key, setKey] = useState("")
  const [lyrics, setLyrics] = useState("")
  const [instrumentalAvailable, setInstrumentalAvailable] = useState(false)
  const [additionalNotes, setAdditionalNotes] = useState("")

  // Contributors
  const [contributors, setContributors] = useState<Contributor[]>([
    { id: "1", name: "", role: "Producer", percentage: 0, proPlan: "" }
  ])

  const addContributor = () => {
    const newContributor: Contributor = {
      id: Date.now().toString(),
      name: "",
      role: "Producer",
      percentage: 0,
      proPlan: ""
    }
    setContributors([...contributors, newContributor])
  }

  const removeContributor = (id: string) => {
    setContributors(contributors.filter(c => c.id !== id))
  }

  const updateContributor = (id: string, field: keyof Contributor, value: string | number) => {
    setContributors(contributors.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      // TODO: Submit to your API endpoint
      const submissionData = {
        trackId: track.id,
        proPlan,
        proNumber,
        publisherName,
        publisherPRO,
        publisherNumber,
        copyrightOwner,
        masterOwner,
        isrc,
        upc,
        territoryRights,
        duration,
        bpm,
        key,
        lyrics,
        instrumentalAvailable,
        additionalNotes,
        contributors
      }

      console.log("Finalizing submission:", submissionData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setStatus("✅ Submission finalized successfully! Your track is now ready for sync licensing.")
      
      // Auto-close after success
      setTimeout(() => {
        onClose()
      }, 3000)
      
    } catch (error) {
      setStatus("❌ Failed to finalize submission. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const proOptions = ["ASCAP", "BMI", "SESAC", "Other", "None"]
  const roleOptions = ["Producer", "Songwriter", "Vocalist", "Rapper", "Musician", "Engineer", "Other"]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Finalize Submission</h2>
            <p className="text-gray-600 mt-1">"{track.title}" by {track.artist}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* PRO Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Performance Rights Organization (PRO)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="proPlan">Your PRO</Label>
                <Select value={proPlan} onValueChange={setProPlan}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your PRO" />
                  </SelectTrigger>
                  <SelectContent>
                    {proOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="proNumber">PRO Member Number</Label>
                <Input
                  id="proNumber"
                  value={proNumber}
                  onChange={e => setProNumber(e.target.value)}
                  placeholder="Your PRO member number"
                />
              </div>
            </div>
          </div>

          {/* Publisher Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Publisher Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="publisherName">Publisher Name</Label>
                <Input
                  id="publisherName"
                  value={publisherName}
                  onChange={e => setPublisherName(e.target.value)}
                  placeholder="Publishing company name"
                />
              </div>
              <div>
                <Label htmlFor="publisherPRO">Publisher PRO</Label>
                <Select value={publisherPRO} onValueChange={setPublisherPRO}>
                  <SelectTrigger>
                    <SelectValue placeholder="Publisher's PRO" />
                  </SelectTrigger>
                  <SelectContent>
                    {proOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="publisherNumber">Publisher PRO Number</Label>
                <Input
                  id="publisherNumber"
                  value={publisherNumber}
                  onChange={e => setPublisherNumber(e.target.value)}
                  placeholder="Publisher PRO number"
                />
              </div>
            </div>
          </div>

          {/* Rights & Ownership */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Rights & Ownership
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="copyrightOwner">Copyright Owner</Label>
                <Input
                  id="copyrightOwner"
                  value={copyrightOwner}
                  onChange={e => setCopyrightOwner(e.target.value)}
                  placeholder="Who owns the composition"
                  required
                />
              </div>
              <div>
                <Label htmlFor="masterOwner">Master Recording Owner</Label>
                <Input
                  id="masterOwner"
                  value={masterOwner}
                  onChange={e => setMasterOwner(e.target.value)}
                  placeholder="Who owns the master recording"
                  required
                />
              </div>
              <div>
                <Label htmlFor="territoryRights">Territory Rights</Label>
                <Select value={territoryRights} onValueChange={setTerritoryRights}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select territory" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="worldwide">Worldwide</SelectItem>
                    <SelectItem value="north-america">North America</SelectItem>
                    <SelectItem value="usa">USA Only</SelectItem>
                    <SelectItem value="canada">Canada Only</SelectItem>
                    <SelectItem value="other">Other/Specify</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Track Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Track Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="isrc">ISRC Code</Label>
                <Input
                  id="isrc"
                  value={isrc}
                  onChange={e => setIsrc(e.target.value)}
                  placeholder="ISRC code (if available)"
                />
              </div>
              <div>
                <Label htmlFor="upc">UPC/EAN</Label>
                <Input
                  id="upc"
                  value={upc}
                  onChange={e => setUpc(e.target.value)}
                  placeholder="UPC/EAN code (if available)"
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  placeholder="e.g., 3:45"
                  required
                />
              </div>
              <div>
                <Label htmlFor="bpm">BPM</Label>
                <Input
                  id="bpm"
                  type="number"
                  value={bpm}
                  onChange={e => setBpm(e.target.value)}
                  placeholder="Beats per minute"
                />
              </div>
              <div>
                <Label htmlFor="key">Key</Label>
                <Input
                  id="key"
                  value={key}
                  onChange={e => setKey(e.target.value)}
                  placeholder="e.g., C Major, A Minor"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="instrumentalAvailable"
                  checked={instrumentalAvailable}
                  onChange={e => setInstrumentalAvailable(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="instrumentalAvailable">Instrumental Available</Label>
              </div>
            </div>
          </div>

          {/* Contributors */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Contributors & Credits
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addContributor}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Contributor
              </Button>
            </div>
            
            {contributors.map((contributor, index) => (
              <div key={contributor.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Contributor {index + 1}</h4>
                  {contributors.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeContributor(contributor.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={contributor.name}
                      onChange={e => updateContributor(contributor.id, "name", e.target.value)}
                      placeholder="Full name"
                      required
                    />
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Select 
                      value={contributor.role} 
                      onValueChange={(value) => updateContributor(contributor.id, "role", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Percentage %</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={contributor.percentage}
                      onChange={e => updateContributor(contributor.id, "percentage", parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label>PRO</Label>
                    <Select 
                      value={contributor.proPlan} 
                      onValueChange={(value) => updateContributor(contributor.id, "proPlan", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select PRO" />
                      </SelectTrigger>
                      <SelectContent>
                        {proOptions.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Lyrics & Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Additional Information
            </h3>
            <div>
              <Label htmlFor="lyrics">Lyrics (if applicable)</Label>
              <Textarea
                id="lyrics"
                value={lyrics}
                onChange={e => setLyrics(e.target.value)}
                placeholder="Enter song lyrics here..."
                rows={6}
              />
            </div>
            <div>
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                value={additionalNotes}
                onChange={e => setAdditionalNotes(e.target.value)}
                placeholder="Any additional information for sync licensing..."
                rows={3}
              />
            </div>
          </div>

          {status && (
            <div className="p-4 rounded-lg bg-gray-50 border">
              <p className="text-sm">{status}</p>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? "Finalizing..." : "🎵 Finalize Submission"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
