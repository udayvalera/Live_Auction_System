import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Upload, X, Plus, FileText } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// --- Import the auction service and relevant types ---
import { auctionService } from "@/services/auctionService";
import { IAuctionCreatePayload, IAuctionDocument } from "@/types/auction"; // Adjust path if needed

// Schema remains the same
const auctionFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  startingBid: z.coerce.number().positive("Starting bid must be positive"),
  // Renamed to match payload expectation more closely, but keep 'endDate' for user clarity if preferred.
  // Sticking with 'endDate' as per original schema for consistency in the form. Will map later.
  endDate: z
    .date({
      required_error: "End date is required",
    })
    .refine((date) => date > new Date(), {
      message: "End date must be in the future",
    }),
  // --- Optional fields (add if needed in the form) ---
  // category: z.string().optional(),
  // location: z.string().optional(),
  // startTime: z.date().optional().refine( ... validation ... ),
});

type AuctionFormValues = z.infer<typeof auctionFormSchema>;

// Demo data remains the same
const demoImageUrls = [
  // ... (keep demo URLs)
  "https://images.unsplash.com/photo-1524592094714-0f0654e20314",
  "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6",
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5",
  "https://images.unsplash.com/photo-1587202372775-e229f172b9d7",
  "https://images.unsplash.com/photo-1540574163026-643ea20ade25",
  "https://images.unsplash.com/photo-1591489378430-ef2f4669cffb",
];

const demoDocumentTypes: IAuctionDocument[] = [
  // Use the imported type
  // ... (keep demo documents)
  {
    name: "Certificate of Authenticity",
    url: "https://images.unsplash.com/photo-1599008633840-052c7f756385",
    type: "image/jpeg",
  },
  {
    name: "Appraisal Document",
    url: "https://images.unsplash.com/photo-1586952518485-11b180e92764",
    type: "image/jpeg",
  },
  {
    name: "Provenance Documentation",
    url: "https://images.unsplash.com/photo-1618091372796-20ee7ec01261",
    type: "image/jpeg",
  },
];

const AuctionForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [documents, setDocuments] = useState<IAuctionDocument[]>([]); // Use the imported type

  const form = useForm<AuctionFormValues>({
    resolver: zodResolver(auctionFormSchema),
    defaultValues: {
      title: "",
      description: "",
      startingBid: 0,
      // endDate: undefined, // Or set a default future date if desired
    },
  });

  // *** MODIFIED onSubmit Function ***
  const onSubmit = async (data: AuctionFormValues) => {
    setIsSubmitting(true);

    // --- Prepare the payload for the API ---
    const payload: IAuctionCreatePayload = {
      title: data.title,
      description: data.description,
      startingBid: data.startingBid,
      endTime: data.endDate.toISOString(), // Convert Date to ISO string, map endDate -> endTime
      images: images, // Use images from state
      documents: documents, // Use documents from state
      // Add other optional fields if they are part of the form/state
      // category: data.category,
      // location: data.location,
      // startTime: data.startTime?.toISOString(),
      imageUrl: images.length > 0 ? images[0] : undefined, // Optionally set the first image as the primary imageUrl
    };

    console.log("Submitting auction payload:", payload);

    try {
      // --- Call the auction service ---
      const createdAuction = await auctionService.createAuction(payload);
      // --------------------------------

      console.log("Auction created successfully:", createdAuction); // Log the response from the backend

      toast({
        title: "Auction created successfully!",
        description: `"${createdAuction.title}" has been listed. ID: ${createdAuction._id}`, // Use data from response
      });

      // Reset form and state after successful submission
      form.reset();
      setImages([]);
      setDocuments([]);

      // Navigate to the home page or the newly created auction page
      // navigate(`/auctions/${createdAuction._id}`); // Option: Navigate to detail page
      navigate("/"); // Navigate back to auction list
    } catch (error: any) {
      // Catch Axios errors potentially
      console.error("Error creating auction:", error);
      let errorMessage =
        "There was a problem creating your auction. Please try again.";
      // Attempt to extract backend validation errors if available
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Error Creating Auction",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false); // Ensure loading state is reset
    }
  };

  // --- Image and Document handling functions remain the same ---
  const handleImageUpload = () => {
    if (images.length < 5) {
      const randomIndex = Math.floor(Math.random() * demoImageUrls.length);
      setImages([...images, demoImageUrls[randomIndex]]);
    } else {
      toast({
        title: "Maximum 5 images",
        description: "You can only upload up to 5 images for an auction.",
        variant: "destructive",
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleDocumentUpload = () => {
    if (documents.length < 3) {
      const randomIndex = Math.floor(Math.random() * demoDocumentTypes.length);
      const docType = demoDocumentTypes[randomIndex];

      if (!documents.some((doc) => doc.name === docType.name)) {
        setDocuments([...documents, docType]);
      } else {
        toast({
          title: "Document already added",
          description: "You already added this type of document.",
        });
      }
    } else {
      toast({
        title: "Maximum 3 documents",
        description: "You can only upload up to 3 documents for an auction.",
        variant: "destructive",
      });
    }
  };

  const removeDocument = (index: number) => {
    const newDocuments = [...documents];
    newDocuments.splice(index, 1);
    setDocuments(newDocuments);
  };
  // --------------------------------------------------------------

  return (
    // --- Form JSX remains largely the same ---
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Image Upload Section */}
        <div>
          <h3 className="text-sm font-medium mb-2">Images (Max 5)</h3>
          <div className="grid grid-cols-3 gap-2 mb-2">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative h-20 rounded-md overflow-hidden"
              >
                <img
                  src={img}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <button
                type="button"
                onClick={handleImageUpload}
                className="h-20 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-500 hover:border-auction-purple hover:text-auction-purple transition-colors"
              >
                <Upload className="h-5 w-5 mb-1" />
                <span className="text-xs">Upload</span>
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Upload up to 5 images of your item. The first image will be the main
            display image.
          </p>
          {/* Basic check for image requirement */}
          {form.formState.isSubmitted && images.length === 0 && (
            <p className="text-sm font-medium text-destructive mt-1">
              At least one image is required.
            </p>
          )}
        </div>

        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          // ... render logic ...
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Vintage Watch" {...field} />
              </FormControl>
              <FormDescription>
                A descriptive title for your auction item.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          // ... render logic ...
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A rare vintage mechanical watch from the 1960s in excellent condition. Check out more details at https://watchhistory.com."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide details about your item's condition, history, and
                special features. URLs will be automatically detected and made
                clickable.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Starting Bid Field */}
        <FormField
          control={form.control}
          name="startingBid"
          // ... render logic ...
          render={({ field }) => (
            <FormItem>
              <FormLabel>Starting Bid ($)</FormLabel>
              <FormControl>
                <div className="relative">
                  {/* Consider adding $ symbol inside if needed */}
                  {/* <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span> */}
                  <Input
                    // className="pl-7" // Adjust padding if adding symbol inside
                    {...field}
                    type="number"
                    min="0.01" // Ensure positive, maybe allow cents
                    step="0.01"
                    placeholder="e.g., 50.00"
                    onChange={(event) => field.onChange(+event.target.value)} // Ensure value is stored as number
                  />
                </div>
              </FormControl>
              <FormDescription>
                Set the minimum bid for your auction. Must be greater than 0.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* End Date Field */}
        <FormField
          control={form.control}
          name="endDate"
          // ... render logic ...
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP") // 'PPP' formats as 'Jan 1st, 2025' etc.
                      ) : (
                        <span>Select an end date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => {
                      // Disable past dates, set hours to 0 to compare dates correctly
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    initialFocus
                    // className={cn("p-3 pointer-events-auto")} // Remove pointer-events-auto if causing issues
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                When the auction will automatically end (usually at midnight
                server time).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Document Upload Section */}
        <div>
          <h3 className="text-sm font-medium mb-2">
            Documents (Optional, Max 3)
          </h3>
          <div className="space-y-2 mb-2">
            {/* ... document mapping logic ... */}
            {documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border rounded-md bg-gray-50"
              >
                <div className="flex items-center overflow-hidden mr-2">
                  <FileText className="h-4 w-4 mr-2 text-auction-purple flex-shrink-0" />
                  <span className="text-sm truncate" title={doc.name}>
                    {doc.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeDocument(index)}
                  className="text-gray-500 hover:text-red-500 flex-shrink-0"
                  aria-label={`Remove ${doc.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {documents.length < 3 && (
              // ... add document button ...
              <button
                type="button"
                onClick={handleDocumentUpload}
                className="w-full p-2 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-500 hover:border-auction-purple hover:text-auction-purple transition-colors"
              >
                <Plus className="h-4 w-4 mr-1" />
                <span className="text-sm">Add Document</span>
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Upload optional documents like certificates or appraisals.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/")}
            disabled={isSubmitting} // Disable cancel while submitting
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-auction-purple hover:bg-auction-purple-dark text-white min-w-[120px]" // Ensure minimum width
            disabled={isSubmitting || images.length === 0} // Disable if submitting OR no images uploaded
          >
            {isSubmitting ? "Creating..." : "Create Auction"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AuctionForm;
