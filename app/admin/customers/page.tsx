"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Eye, Mail, Phone } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  status: "active" | "inactive";
  createdAt: string;
  lastOrderDate: string;
}

// Mock data for customers (in a real app, this would come from an API)
const mockCustomers: Customer[] = [
  {
    _id: "cust_001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+234 801 234 5678",
    totalOrders: 5,
    totalSpent: 25000,
    status: "active",
    createdAt: "2023-01-15T14:23:45Z",
    lastOrderDate: "2023-05-20T09:45:12Z"
  },
  {
    _id: "cust_002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+234 802 345 6789",
    totalOrders: 3,
    totalSpent: 15500,
    status: "active",
    createdAt: "2023-02-10T11:34:22Z",
    lastOrderDate: "2023-05-15T16:30:45Z"
  },
  {
    _id: "cust_003",
    name: "Michael Johnson",
    email: "michael.j@example.com",
    phone: "+234 803 456 7890",
    totalOrders: 1,
    totalSpent: 5200,
    status: "inactive",
    createdAt: "2023-03-05T09:12:33Z",
    lastOrderDate: "2023-03-05T10:20:15Z"
  },
  {
    _id: "cust_004",
    name: "Olivia Williams",
    email: "olivia.w@example.com",
    phone: "+234 804 567 8901",
    totalOrders: 8,
    totalSpent: 42000,
    status: "active",
    createdAt: "2023-01-20T15:45:10Z",
    lastOrderDate: "2023-05-25T14:10:35Z"
  },
  {
    _id: "cust_005",
    name: "Robert Brown",
    email: "robert.b@example.com",
    phone: "+234 805 678 9012",
    totalOrders: 2,
    totalSpent: 9800,
    status: "active",
    createdAt: "2023-04-12T10:22:15Z",
    lastOrderDate: "2023-05-01T11:45:22Z"
  },
  {
    _id: "cust_006",
    name: "Emma Davis",
    email: "emma.d@example.com",
    phone: "+234 806 789 0123",
    totalOrders: 0,
    totalSpent: 0,
    status: "inactive",
    createdAt: "2023-05-01T08:15:40Z",
    lastOrderDate: ""
  }
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  useEffect(() => {
    // In a real app, this would be a fetch call to your API
    // Simulating API fetch with setTimeout
    const timer = setTimeout(() => {
      setCustomers(mockCustomers)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = 
      statusFilter === "all" || 
      customer.status === statusFilter;
      
    return matchesSearch && matchesStatus;
  });

  const openCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDetailsDialogOpen(true)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground mt-1">Manage your customer database</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search customers..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Customer List</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-100 animate-pulse rounded-md" />
                  ))}
                </div>
              ) : filteredCustomers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Orders</TableHead>
                      <TableHead className="text-right">Total Spent</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer._id}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm flex items-center">
                              <Mail className="mr-1 h-3 w-3" /> {customer.email}
                            </span>
                            <span className="text-sm text-muted-foreground flex items-center">
                              <Phone className="mr-1 h-3 w-3" /> {customer.phone}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={customer.status === "active" ? "default" : "secondary"}
                          >
                            {customer.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{customer.totalOrders}</TableCell>
                        <TableCell className="text-right">₦{customer.totalSpent.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openCustomerDetails(customer)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center p-6">
                  <p className="text-xl mb-2">No customers found</p>
                  <p className="text-muted-foreground">
                    {searchQuery || statusFilter !== "all" 
                      ? "Try adjusting your search or filters" 
                      : "Your customer database is empty"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="grid">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredCustomers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCustomers.map((customer) => (
                <Card key={customer._id} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      {customer.name}
                      <Badge 
                        variant={customer.status === "active" ? "default" : "secondary"}
                      >
                        {customer.status}
                      </Badge>
                    </CardTitle>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Mail className="mr-1 h-3 w-3" /> {customer.email}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Phone className="mr-1 h-3 w-3" /> {customer.phone}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Total Orders</span>
                      <span className="font-medium">{customer.totalOrders}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Total Spent</span>
                      <span className="font-medium">₦{customer.totalSpent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Joined</span>
                      <span className="font-medium">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                  <div className="p-4 border-t">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => openCustomerDetails(customer)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 border rounded-lg">
              <p className="text-xl mb-4">No customers found</p>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "Your customer database is empty"}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Customer Details Dialog */}
      {selectedCustomer && (
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
              <DialogDescription>
                Detailed information about {selectedCustomer.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Customer Name</h4>
                  <p className="text-base">{selectedCustomer.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                  <Badge 
                    variant={selectedCustomer.status === "active" ? "default" : "secondary"}
                    className="mt-1"
                  >
                    {selectedCustomer.status}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                  <p className="text-base">{selectedCustomer.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Phone</h4>
                  <p className="text-base">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Joined</h4>
                  <p className="text-base">{new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Last Order</h4>
                  <p className="text-base">
                    {selectedCustomer.lastOrderDate 
                      ? new Date(selectedCustomer.lastOrderDate).toLocaleDateString() 
                      : "No orders yet"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Total Orders</h4>
                  <p className="text-base">{selectedCustomer.totalOrders}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Total Spent</h4>
                  <p className="text-base">₦{selectedCustomer.totalSpent.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
