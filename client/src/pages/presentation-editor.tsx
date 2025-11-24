import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Plus, X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { insertPresentationSchema, type Presentation } from "@shared/schema";
import { z } from "zod";

const formSchema = insertPresentationSchema;
type FormValues = z.infer<typeof formSchema>;

export default function PresentationEditor() {
  const params = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const isNew = params.id === "new";

  const { data: presentation } = useQuery<Presentation>({
    queryKey: ["/api/presentations", params.id],
    enabled: !isNew && !!params.id,
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return await apiRequest("POST", "/api/presentations", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/presentations"] });
      toast({
        title: "Presentation created",
        description: "Your presentation has been created successfully.",
      });
      navigate("/");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create presentation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return await apiRequest("PATCH", `/api/presentations/${params.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/presentations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/presentations", params.id] });
      toast({
        title: "Presentation updated",
        description: "Your changes have been saved successfully.",
      });
      navigate("/");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update presentation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slides: [""],
      slideDuration: 30,
      fontSize: "medium" as const,
    },
  });

  useEffect(() => {
    if (presentation && !isNew) {
      form.reset({
        title: presentation.title,
        slides: presentation.slides,
        slideDuration: presentation.slideDuration || 30,
        fontSize: (presentation.fontSize as "small" | "medium" | "large" | "xlarge") || "medium",
      });
    }
  }, [presentation, isNew, form]);

  const onSubmit = async (data: FormValues) => {
    if (isNew) {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate(data);
    }
  };

  const slides = form.watch("slides");
  const isPending = createMutation.isPending || updateMutation.isPending;

  const addSlide = () => {
    const currentSlides = form.getValues("slides");
    form.setValue("slides", [...currentSlides, ""]);
  };

  const removeSlide = (index: number) => {
    const currentSlides = form.getValues("slides");
    if (currentSlides.length > 1) {
      form.setValue(
        "slides",
        currentSlides.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            className="gap-2 mb-4"
            onClick={() => navigate("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Presentations
          </Button>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {isNew ? "Create Presentation" : "Edit Presentation"}
          </h1>
          <p className="text-muted-foreground">
            Configure your presentation settings and slide content
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Presentation Details</CardTitle>
                <CardDescription>Give your presentation a memorable title</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter presentation title..."
                          {...field}
                          data-testid="input-title"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slideDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slide Duration</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-duration">
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="20">20 seconds</SelectItem>
                          <SelectItem value="25">25 seconds</SelectItem>
                          <SelectItem value="30">30 seconds</SelectItem>
                          <SelectItem value="35">35 seconds</SelectItem>
                          <SelectItem value="40">40 seconds</SelectItem>
                          <SelectItem value="45">45 seconds</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fontSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Font Size</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-font-size">
                            <SelectValue placeholder="Select font size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                          <SelectItem value="xlarge">Extra Large</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Slides</CardTitle>
                    <CardDescription>
                      {slides.length} slide{slides.length !== 1 ? 's' : ''} • Total time: {Math.ceil(slides.length * 30 / 60)} minutes
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={addSlide}
                    data-testid="button-add-slide"
                  >
                    <Plus className="w-4 h-4" />
                    Add Slide
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {slides.map((_, index) => (
                  <div key={index} className="relative" data-testid={`slide-${index}`}>
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center gap-2 pt-3">
                        <GripVertical className="w-5 h-5 text-muted-foreground" />
                        <div className="text-sm font-medium text-muted-foreground">
                          {index + 1}
                        </div>
                      </div>
                      <FormField
                        control={form.control}
                        name={`slides.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Textarea
                                placeholder="Enter slide content..."
                                className="min-h-[120px] resize-none"
                                {...field}
                                data-testid={`textarea-slide-${index}`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {slides.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSlide(index)}
                          className="mt-2"
                          data-testid={`button-remove-slide-${index}`}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                type="submit"
                size="lg"
                className="flex-1"
                disabled={isPending}
                data-testid="button-save"
              >
                {isPending ? "Saving..." : isNew ? "Create Presentation" : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => navigate("/")}
                disabled={isPending}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
