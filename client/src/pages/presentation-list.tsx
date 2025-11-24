import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, Play, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Presentation } from "@shared/schema";

export default function PresentationList() {
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: presentations, isLoading } = useQuery<Presentation[]>({
    queryKey: ["/api/presentations"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/presentations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/presentations"] });
      toast({
        title: "Presentation deleted",
        description: "The presentation has been deleted successfully.",
      });
      setDeleteId(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete presentation. Please try again.",
        variant: "destructive",
      });
      setDeleteId(null);
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-muted-foreground">Loading presentations...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Pecha Kucha Teleprompter</h1>
            <p className="text-muted-foreground">Create and deliver professional presentations with automatic 30-second slide transitions</p>
          </div>
          <Link href="/editor/new">
            <Button size="lg" className="gap-2" data-testid="button-create-presentation">
              <Plus className="w-5 h-5" />
              New Presentation
            </Button>
          </Link>
        </div>

        {!presentations || presentations.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Play className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No presentations yet</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Get started by creating your first Pecha Kucha presentation with automatic slide timing
              </p>
              <Link href="/editor/new">
                <Button size="lg" className="gap-2" data-testid="button-create-first-presentation">
                  <Plus className="w-5 h-5" />
                  Create Your First Presentation
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {presentations.map((presentation) => (
              <Card key={presentation.id} className="hover-elevate" data-testid={`card-presentation-${presentation.id}`}>
                <CardHeader>
                  <CardTitle className="line-clamp-2">{presentation.title}</CardTitle>
                  <CardDescription>
                    {presentation.slides.length} slide{presentation.slides.length !== 1 ? 's' : ''} • {Math.ceil(presentation.slides.length * (presentation.slideDuration || 30) / 60)} min
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Link href={`/present/${presentation.id}`} className="flex-1">
                      <Button variant="default" className="w-full gap-2" data-testid={`button-present-${presentation.id}`}>
                        <Play className="w-4 h-4" />
                        Present
                      </Button>
                    </Link>
                    <Link href={`/editor/${presentation.id}`}>
                      <Button variant="outline" size="icon" data-testid={`button-edit-${presentation.id}`}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setDeleteId(presentation.id)}
                      data-testid={`button-delete-${presentation.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Presentation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this presentation? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
