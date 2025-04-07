import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function UpdateForm({
    title,  
    description,    
    setTitle,
    setDescription,
    setIsAddingUpdate,
    handleAddUpdate,
    isLoading
}: {
    title: string;
    description: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
    setIsAddingUpdate: React.Dispatch<React.SetStateAction<boolean>>;
    handleAddUpdate: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    isLoading: boolean
}) {
  return (
    <form
      onSubmit={handleAddUpdate}
      className="w-full space-y-4 bg-card p-6 rounded-lg border"
    >
      <div className="space-y-2">
        <Label htmlFor="update-title">Update Title</Label>
        <Input
          id="update-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's new with your campaign?"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="update-description">Description</Label>
        <Textarea
          id="update-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Share details about your campaign's progress..."
          rows={5}
          required
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setIsAddingUpdate(false)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>{isLoading ? "Posting..." : "Post Update"}</Button>
      </div>
    </form>
  );
}
