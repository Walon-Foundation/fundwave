import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import UpdateForm from "../forms/updateForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Plus, Trash } from "lucide-react";
import { formatDate } from "@/core/helpers/formatDate";
import { Update } from "@/core/types/types";

export default function UpdateSection({
    campaignUpdate,
    hasUpdates,
    isCreator,
    isAddingUpdate,
    setIsAddingUpdate,
    title,
    description,
    setTitle,
    setDescription,
    handleAddUpdate,
    isLoading
}:{
    campaignUpdate: Update[],
    hasUpdates: boolean,
    isCreator: boolean,
    isAddingUpdate: boolean,
    setIsAddingUpdate: React.Dispatch<React.SetStateAction<boolean>>,
    title: string,
    description: string,
    setTitle: React.Dispatch<React.SetStateAction<string>>,
    setDescription: React.Dispatch<React.SetStateAction<string>>,
    handleAddUpdate: (e: React.FormEvent<HTMLFormElement>) => Promise<void>,
    isLoading: boolean
}) {
  return (
    <TabsContent
      value="updates"
      className="p-6 space-y-6 animate-in fade-in-50"
    >
      <div className="space-y-6 animate-in fade-in-50">
        {isCreator && (
          <div className="flex justify-end">
            {!isAddingUpdate ? (
              <Button
                className="flex items-center gap-2"
                onClick={() => setIsAddingUpdate(true)}
              >
                <Plus className="h-4 w-4" />
                Add Update
              </Button>
            ) : (
              // Update Form
              <UpdateForm
                title={title}
                description={description}
                setTitle={setTitle}
                setDescription={setDescription}
                setIsAddingUpdate={setIsAddingUpdate}
                handleAddUpdate={handleAddUpdate}
                isLoading={isLoading}
              />
            )}
          </div>
        )}

        {hasUpdates ? (
          <div className="space-y-4">
            {campaignUpdate.map((update) => (
              <Card key={update?._id} className="overflow-hidden">
                <CardHeader className="bg-muted/30">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{update?.title}</CardTitle>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDate(update?.createdAt as string)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 flex items-center justify-between">
                  <CardDescription className="text-foreground whitespace-pre-line">
                    {update?.description}
                  </CardDescription>
                  <CardDescription>
                    {
                      isCreator && ( 
                        <Button variant="ghost" size="lg" className="w-10 h-10">
                      <Trash className="w-8 h-8 text-red-500"/>
                    </Button>
                      )
                    }
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 bg-blue-50/50 rounded-lg border border-blue-100">
            <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path>
              </svg>
            </div>
            <h4 className="text-xl font-medium text-blue-800 mb-2">
              No Updates Yet
            </h4>
            <p className="text-gray-600 max-w-md mx-auto">
              {isCreator
                ? "You haven't posted any updates yet. Keep your supporters informed by adding updates about your campaign's progress!"
                : "The campaign creator hasn't posted any updates yet. Check back soon for news about this campaign's progress!"}
            </p>
          </div>
        )}
      </div>
    </TabsContent>
  );
}
