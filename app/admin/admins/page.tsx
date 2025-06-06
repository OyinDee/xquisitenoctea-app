"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Plus, Trash2 } from "lucide-react"

interface Admin {
  _id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newAdmin, setNewAdmin] = useState({
    email: "",
    name: "",
    password: "",
  })

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admins')
      if (response.ok) {
        const data = await response.json()
        setAdmins(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to fetch admins')
      }
    } catch (error) {
      setError('Error fetching admins')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAdmin),
      })

      if (response.ok) {
        setSuccess('Admin added successfully')
        setNewAdmin({ email: "", name: "", password: "" })
        setIsDialogOpen(false)
        fetchAdmins()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to add admin')
      }
    } catch (error) {
      setError('Error adding admin')
    }
  }

  const handleDeleteAdmin = async (id: string) => {
    if (!confirm('Are you sure you want to delete this admin?')) return

    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(`/api/admins/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setSuccess('Admin deleted successfully')
        fetchAdmins()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to delete admin')
      }
    } catch (error) {
      setError('Error deleting admin')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Users</h1>
          <p className="text-muted-foreground mt-1">Manage admin access</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Admin</DialogTitle>
              <DialogDescription>
                Create a new admin user account. They will be able to access the admin dashboard.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddAdmin}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Admin</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertTitle className="text-red-600">Error</AlertTitle>
          <AlertDescription className="text-red-600">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertTitle className="text-green-600">Success</AlertTitle>
          <AlertDescription className="text-green-600">
            {success}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading admins...</p>
            </div>
          ) : admins.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((admin) => (
                    <TableRow key={admin._id}>
                      <TableCell className="font-medium">{admin.name}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell className="capitalize">{admin.role}</TableCell>
                      <TableCell>{formatDate(admin.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAdmin(admin._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center p-8">
              <p className="text-xl mb-4">No admins found</p>
              <p className="text-muted-foreground">
                Add your first admin user to get started.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 