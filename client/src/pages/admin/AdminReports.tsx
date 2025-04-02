
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { reportedAuctions, ReportedAuction } from "@/data/adminData";
import { auctions } from "@/data/auctions";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  CheckCircle, 
  Eye, 
  XCircle,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

const AdminReports = () => {
  const [reportsList, setReportsList] = useState<ReportedAuction[]>(reportedAuctions);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  const filteredReports = reportsList.filter(
    (report) => {
      const matchesSearch = 
        report.auctionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reportedBy.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || report.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    }
  );

  const handleResolveReport = (id: string) => {
    setReportsList(
      reportsList.map((report) => {
        if (report.id === id) {
          return { ...report, status: 'resolved' };
        }
        return report;
      })
    );
    
    toast({
      title: "Report resolved",
      description: `Report #${id} has been marked as resolved.`,
    });
  };

  const handleDismissReport = (id: string) => {
    setReportsList(
      reportsList.map((report) => {
        if (report.id === id) {
          return { ...report, status: 'dismissed' };
        }
        return report;
      })
    );
    
    toast({
      title: "Report dismissed",
      description: `Report #${id} has been dismissed.`,
    });
  };

  const handleReopenReport = (id: string) => {
    setReportsList(
      reportsList.map((report) => {
        if (report.id === id) {
          return { ...report, status: 'pending' };
        }
        return report;
      })
    );
    
    toast({
      title: "Report reopened",
      description: `Report #${id} has been reopened for review.`,
    });
  };

  const getAuctionDetails = (auctionId: string) => {
    return auctions.find(auction => auction.id === auctionId);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Reported Auctions</h1>
        <p className="text-muted-foreground">
          Review and manage reported auctions on the platform.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Reports</CardTitle>
          <CardDescription>
            Total of {reportsList.length} reports on the platform.
          </CardDescription>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="overflow-auto">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>Auction</TableHead>
                  <TableHead className="hidden md:table-cell">Reason</TableHead>
                  <TableHead className="hidden lg:table-cell">Reported By</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="line-clamp-1">{report.auctionTitle}</div>
                        <div className="text-xs text-muted-foreground">ID: {report.auctionId}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{report.reason}</TableCell>
                    <TableCell className="hidden lg:table-cell">{report.reportedBy.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {report.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                        ${report.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : report.status === 'resolved'
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'}`
                      }>
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                  <DialogHeader>
                                    <DialogTitle>Report Details</DialogTitle>
                                    <DialogDescription>
                                      Complete information about this report
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 pt-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <div className="font-semibold">Report ID:</div>
                                      <div className="col-span-3">{report.id}</div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <div className="font-semibold">Auction:</div>
                                      <div className="col-span-3">
                                        {report.auctionTitle} (ID: {report.auctionId})
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <div className="font-semibold">Reported By:</div>
                                      <div className="col-span-3">
                                        {report.reportedBy.name} (ID: {report.reportedBy.id})
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <div className="font-semibold">Date:</div>
                                      <div className="col-span-3">
                                        {report.createdAt.toLocaleString()}
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <div className="font-semibold">Status:</div>
                                      <div className="col-span-3">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                                          ${report.status === 'pending' 
                                            ? 'bg-yellow-100 text-yellow-800' 
                                            : report.status === 'resolved'
                                              ? 'bg-green-100 text-green-800' 
                                              : 'bg-gray-100 text-gray-800'}`
                                        }>
                                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-4 items-start gap-4">
                                      <div className="font-semibold">Reason:</div>
                                      <div className="col-span-3">{report.reason}</div>
                                    </div>
                                    <div className="grid grid-cols-4 items-start gap-4">
                                      <div className="font-semibold">Description:</div>
                                      <div className="col-span-3">{report.description}</div>
                                    </div>
                                    <div className="grid grid-cols-4 items-start gap-4">
                                      <div className="font-semibold">Auction Details:</div>
                                      <div className="col-span-3">
                                        {getAuctionDetails(report.auctionId) ? (
                                          <div className="space-y-2">
                                            <div><strong>Current Bid:</strong> ${getAuctionDetails(report.auctionId)?.currentBid}</div>
                                            <div><strong>Bid Count:</strong> {getAuctionDetails(report.auctionId)?.bidCount}</div>
                                            <div><strong>Status:</strong> {getAuctionDetails(report.auctionId)?.status}</div>
                                            <div><strong>End Date:</strong> {getAuctionDetails(report.auctionId)?.endTime.toLocaleDateString()}</div>
                                            <Button asChild className="mt-2">
                                              <a href={`/auction/${report.auctionId}`} target="_blank" rel="noopener noreferrer">
                                                View Auction
                                              </a>
                                            </Button>
                                          </div>
                                        ) : (
                                          <div>Auction not found or has been removed.</div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <DialogFooter className="mt-6">
                                    <DialogClose asChild>
                                      <Button variant="outline">Close</Button>
                                    </DialogClose>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Report Details</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {report.status === 'pending' && (
                          <>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleResolveReport(report.id)}
                                    className="text-green-600">
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Mark as Resolved</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleDismissReport(report.id)}
                                    className="text-red-600">
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Dismiss Report</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </>
                        )}
                        
                        {(report.status === 'resolved' || report.status === 'dismissed') && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleReopenReport(report.id)}
                                  className="text-blue-600">
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Reopen Report</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReports;
