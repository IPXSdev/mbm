import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload } from "lucide-react"

export default function SubmitPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Submit Your Music</h1>
        <p className="text-xl text-muted-foreground">Share your story and get featured on Man Behind The Music</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Music Submission Form</CardTitle>
          <CardDescription>Fill out the details below to submit your music for consideration</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            {/* File Upload Section */}
            <div className="space-y-4">
              <Label>Upload Files</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center border-muted-foreground/25">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">Drag and drop your files here</p>
                <p className="text-sm text-muted-foreground mb-4">or click to browse (MP3, WAV, FLAC, JPG, PNG)</p>
                <input type="file" multiple accept="audio/*,image/*" className="hidden" id="file-upload" />
                <Button type="button" variant="outline" asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Choose Files
                  </label>
                </Button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Track Title *</Label>
                <Input id="title" name="title" placeholder="Enter track title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="artist">Artist Name *</Label>
                <Input id="artist" name="artist" placeholder="Enter artist name" required />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="genre">Genre</Label>
                <Select name="genre">
                  <SelectTrigger>
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pop">Pop</SelectItem>
                    <SelectItem value="rock">Rock</SelectItem>
                    <SelectItem value="hip-hop">Hip Hop</SelectItem>
                    <SelectItem value="electronic">Electronic</SelectItem>
                    <SelectItem value="indie">Indie</SelectItem>
                    <SelectItem value="jazz">Jazz</SelectItem>
                    <SelectItem value="classical">Classical</SelectItem>
                    <SelectItem value="country">Country</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Contact Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  defaultValue="dev@music.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Tell Your Story</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Share the inspiration behind your music, your creative process, or any interesting stories..."
                className="min-h-[120px]"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button type="submit" className="flex-1">
                Submit for Review
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
