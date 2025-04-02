
import { useState } from "react";
import { FileText, Eye, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";

interface Document {
  name: string;
  url: string;
  type: string;
}

interface DocumentViewerProps {
  documents: Document[] | undefined;
}

const DocumentViewer = ({ documents }: DocumentViewerProps) => {
  const [currentDoc, setCurrentDoc] = useState<Document | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  if (!documents || documents.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-3">Documents</h3>
      <div className="space-y-2">
        {documents.map((doc, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-auction-purple" />
              <span>{doc.name}</span>
            </div>
            
            <button 
              onClick={() => {
                setCurrentDoc(doc);
                setIsOpen(true);
              }}
              className="flex items-center text-sm text-auction-purple hover:underline"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </button>
          </div>
        ))}
      </div>
      
      {/* Document Viewer Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-3xl">
          <div className="flex justify-between items-center mb-4">
            <DialogTitle>{currentDoc?.name}</DialogTitle>
            <DialogClose className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100">
              <X className="h-4 w-4" />
            </DialogClose>
          </div>
          
          <div className="h-[60vh] overflow-auto">
            {currentDoc?.type.startsWith('image/') ? (
              <img
                src={currentDoc?.url}
                alt={currentDoc?.name}
                className="w-full h-auto object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <a 
                  href={currentDoc?.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-auction-purple hover:underline flex items-center"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Open document in new tab
                </a>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentViewer;
