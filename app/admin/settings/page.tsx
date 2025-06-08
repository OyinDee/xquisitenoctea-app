"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ImageUpload from "@/components/ui/image-upload"
import MultiImageUpload from "@/components/ui/multi-image-upload"
import { AlertCircle, Check, Save, Send, Store, Trash2, Eye } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  
  // Store settings
  const [storeName, setStoreName] = useState("Xquisitenoctéa")
  const [storeEmail, setStoreEmail] = useState("info@xquisitenoctea.com")
  const [storePhone, setStorePhone] = useState("+234 801 234 5678")
  const [storeAddress, setStoreAddress] = useState("123 Fashion Street, Lagos, Nigeria")
  const [storeLogo, setStoreLogo] = useState("/logo.jpg")
  const [currency, setCurrency] = useState("NGN")
  const [storeDescription, setStoreDescription] = useState("Premium fashion store offering exclusive designs and accessories.")
  
  // Payment settings
  const [acceptCashOnDelivery, setAcceptCashOnDelivery] = useState(true)
  const [acceptBankTransfer, setAcceptBankTransfer] = useState(true)
  const [acceptOnlinePayment, setAcceptOnlinePayment] = useState(true)
  const [bankName, setBankName] = useState("First Bank")
  const [accountNumber, setAccountNumber] = useState("1234567890")
  const [accountName, setAccountName] = useState("Xquisitenoctéa Ltd")
  
  // Shipping settings
  const [shippingFee, setShippingFee] = useState("1500")
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("20000")
  const [enableFreeShipping, setEnableFreeShipping] = useState(true)
  const [estimatedDeliveryDays, setEstimatedDeliveryDays] = useState("3-5")
  
  // Notification settings
  const [sendOrderConfirmation, setSendOrderConfirmation] = useState(true)
  const [sendShippingUpdates, setSendShippingUpdates] = useState(true)
  const [sendDeliveryNotification, setSendDeliveryNotification] = useState(true)
  const [sendAbandonedCartReminder, setSendAbandonedCartReminder] = useState(false)
  
  const handleSaveSettings = (tab: string) => {
    setIsSaving(true)
    
    // In a real app, you would make an API call to save the settings
    setTimeout(() => {
      setIsSaving(false)
      setShowSuccessAlert(true)
      
      // Hide success alert after 3 seconds
      setTimeout(() => {
        setShowSuccessAlert(false)
      }, 3000)
    }, 1000)
  }
  
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your store preferences and settings</p>
      </div>
      
      {showSuccessAlert && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-600">Success</AlertTitle>
          <AlertDescription className="text-green-600">
            Your settings have been saved successfully.
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="store" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="store">Store Info</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        {/* Store Info Tab */}
        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Manage your store's basic information and details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input 
                      id="storeName" 
                      value={storeName} 
                      onChange={(e) => setStoreName(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NGN">Nigerian Naira (₦)</SelectItem>
                        <SelectItem value="USD">US Dollar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                        <SelectItem value="GBP">British Pound (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="storeEmail">Store Email</Label>
                    <Input 
                      id="storeEmail" 
                      type="email" 
                      value={storeEmail} 
                      onChange={(e) => setStoreEmail(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="storePhone">Store Phone</Label>
                    <Input 
                      id="storePhone" 
                      value={storePhone} 
                      onChange={(e) => setStorePhone(e.target.value)} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="storeAddress">Store Address</Label>
                  <Input 
                    id="storeAddress" 
                    value={storeAddress} 
                    onChange={(e) => setStoreAddress(e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="storeDescription">Store Description</Label>
                  <Textarea 
                    id="storeDescription" 
                    value={storeDescription} 
                    onChange={(e) => setStoreDescription(e.target.value)} 
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Store Logo</Label>
                  <MultiImageUpload
                    value={storeLogo ? [storeLogo] : []}
                    onChange={(url) => setStoreLogo(url)}
                    onRemove={() => setStoreLogo("")}
                    multiple={false}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('store')} disabled={isSaving}>
                  {isSaving ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Payment Tab */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Configure payment options and methods for your store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Store className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Cash on Delivery</h4>
                      <p className="text-sm text-muted-foreground">
                        Allow customers to pay when they receive their order
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={acceptCashOnDelivery} 
                    onCheckedChange={setAcceptCashOnDelivery} 
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Store className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Bank Transfer</h4>
                      <p className="text-sm text-muted-foreground">
                        Allow customers to pay via bank transfer
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={acceptBankTransfer} 
                    onCheckedChange={setAcceptBankTransfer} 
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Store className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Online Payment</h4>
                      <p className="text-sm text-muted-foreground">
                        Allow customers to pay online with cards and other methods
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={acceptOnlinePayment} 
                    onCheckedChange={setAcceptOnlinePayment} 
                  />
                </div>
                
                <Separator className="my-4" />
                
                <h3 className="text-lg font-medium">Bank Account Details</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  These details will be shown to customers who choose to pay via bank transfer
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input 
                      id="bankName" 
                      value={bankName} 
                      onChange={(e) => setBankName(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input 
                      id="accountNumber" 
                      value={accountNumber} 
                      onChange={(e) => setAccountNumber(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accountName">Account Name</Label>
                    <Input 
                      id="accountName" 
                      value={accountName} 
                      onChange={(e) => setAccountName(e.target.value)} 
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('payment')} disabled={isSaving}>
                  {isSaving ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Shipping Tab */}
        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Settings</CardTitle>
              <CardDescription>
                Configure shipping options and delivery settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="shippingFee">Standard Shipping Fee (₦)</Label>
                    <Input 
                      id="shippingFee" 
                      type="number" 
                      value={shippingFee} 
                      onChange={(e) => setShippingFee(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="estimatedDeliveryDays">Estimated Delivery Days</Label>
                    <Input 
                      id="estimatedDeliveryDays" 
                      value={estimatedDeliveryDays} 
                      onChange={(e) => setEstimatedDeliveryDays(e.target.value)} 
                      placeholder="e.g. 3-5"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Free Shipping</h4>
                    <p className="text-sm text-muted-foreground">
                      Offer free shipping for orders above a certain amount
                    </p>
                  </div>
                  <Switch 
                    checked={enableFreeShipping} 
                    onCheckedChange={setEnableFreeShipping} 
                  />
                </div>
                
                {enableFreeShipping && (
                  <div className="space-y-2">
                    <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (₦)</Label>
                    <Input 
                      id="freeShippingThreshold" 
                      type="number" 
                      value={freeShippingThreshold} 
                      onChange={(e) => setFreeShippingThreshold(e.target.value)} 
                    />
                    <p className="text-sm text-muted-foreground">
                      Orders above this amount will qualify for free shipping
                    </p>
                  </div>
                )}
                
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Note</AlertTitle>
                  <AlertDescription>
                    Currently, shipping options are limited to Nigeria only. Additional
                    shipping zones can be configured later.
                  </AlertDescription>
                </Alert>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('shipping')} disabled={isSaving}>
                  {isSaving ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure email and notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <h4 className="font-medium">Order Confirmations</h4>
                    <p className="text-sm text-muted-foreground">
                      Send confirmation emails when orders are placed
                    </p>
                  </div>
                  <Switch 
                    checked={sendOrderConfirmation} 
                    onCheckedChange={setSendOrderConfirmation} 
                  />
                </div>
                
                <div className="flex items-center justify-between py-3 border-t">
                  <div>
                    <h4 className="font-medium">Shipping Updates</h4>
                    <p className="text-sm text-muted-foreground">
                      Notify customers when their order is shipped
                    </p>
                  </div>
                  <Switch 
                    checked={sendShippingUpdates} 
                    onCheckedChange={setSendShippingUpdates} 
                  />
                </div>
                
                <div className="flex items-center justify-between py-3 border-t">
                  <div>
                    <h4 className="font-medium">Delivery Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Notify customers when their order has been delivered
                    </p>
                  </div>
                  <Switch 
                    checked={sendDeliveryNotification} 
                    onCheckedChange={setSendDeliveryNotification} 
                  />
                </div>
                
                <div className="flex items-center justify-between py-3 border-t">
                  <div>
                    <h4 className="font-medium">Abandoned Cart Reminders</h4>
                    <p className="text-sm text-muted-foreground">
                      Send reminders for abandoned shopping carts
                    </p>
                  </div>
                  <Switch 
                    checked={sendAbandonedCartReminder} 
                    onCheckedChange={setSendAbandonedCartReminder} 
                  />
                </div>
                
                <div className="mt-6 p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Email Template Preview</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Preview and test your email templates before sending
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm">
                      <Send className="mr-2 h-4 w-4" />
                      Send Test
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('notifications')} disabled={isSaving}>
                  {isSaving ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
