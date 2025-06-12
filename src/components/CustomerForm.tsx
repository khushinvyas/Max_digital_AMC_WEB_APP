import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

interface CustomerFormData {
  companyName: string;
  ownerName: string;
  city: string;
  address: string;
  phoneNumber: string;
  amcStartDate: string;
  amcEndDate: string;
  amcType: 'A' | 'B' | 'C';
  amcAmount: number;
  productDescription: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceAmount: number;
  status: 'active' | 'proposed' | 'expired' | 'suspended' | 'cancelled';
}

interface CustomerFormProps {
  onSubmit: (data: CustomerFormData) => void;
  onCancel: () => void;
  initialData?: Partial<CustomerFormData>;
  isEditing?: boolean;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onSubmit, onCancel, initialData, isEditing = false }) => {
  const [formData, setFormData] = useState<CustomerFormData>({
    companyName: initialData?.companyName || '',
    ownerName: initialData?.ownerName || '',
    city: initialData?.city || '',
    address: initialData?.address || '',
    phoneNumber: initialData?.phoneNumber || '',
    amcStartDate: initialData?.amcStartDate || '',
    amcEndDate: initialData?.amcEndDate || '',
    amcType: initialData?.amcType || 'A',
    amcAmount: initialData?.amcAmount || 0,
    productDescription: initialData?.productDescription || '',
    invoiceNumber: initialData?.invoiceNumber || '',
    invoiceDate: initialData?.invoiceDate || '',
    invoiceAmount: initialData?.invoiceAmount || 0,
    status: initialData?.status || 'proposed'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialData?.amcStartDate ? new Date(initialData.amcStartDate) : undefined
  );
  const [invoiceDate, setInvoiceDate] = useState<Date | undefined>(
    initialData?.invoiceDate ? new Date(initialData.invoiceDate) : undefined
  );

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.amcStartDate) newErrors.amcStartDate = 'AMC start date is required';
    if (formData.amcAmount <= 0) newErrors.amcAmount = 'AMC amount must be greater than 0';

    // Only validate invoice fields if status is not 'proposed'
    if (formData.status !== 'proposed') {
      if (!formData.invoiceNumber?.trim()) newErrors.invoiceNumber = 'Invoice number is required';
      if (!formData.invoiceDate) newErrors.invoiceDate = 'Invoice date is required';
      if (formData.invoiceAmount <= 0) newErrors.invoiceAmount = 'Invoice amount must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    if (date) {
      const startDateStr = format(date, 'yyyy-MM-dd');
      const endDate = new Date(date);
      endDate.setFullYear(date.getFullYear() + 1);
      const endDateStr = format(endDate, 'yyyy-MM-dd');
      
      setFormData(prev => ({
        ...prev,
        amcStartDate: startDateStr,
        amcEndDate: endDateStr
      }));
    }
  };

  const handleInvoiceDateChange = (date: Date | undefined) => {
    setInvoiceDate(date);
    if (date) {
      setFormData(prev => ({
        ...prev,
        invoiceDate: format(date, 'yyyy-MM-dd')
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // For proposed status, set all invoice fields to null
      const submitData = {
        ...formData,
        invoiceNumber: formData.status === 'proposed' ? null : formData.invoiceNumber,
        invoiceDate: formData.status === 'proposed' ? null : formData.invoiceDate,
        invoiceAmount: formData.status === 'proposed' ? null : formData.invoiceAmount,
      };
      onSubmit(submitData);
    }
  };

  const handleInputChange = (field: keyof CustomerFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-foreground">
            {isEditing ? 'Edit Customer' : 'Add New Customer'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Details */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Enter company name"
                  className={errors.companyName ? 'border-red-500' : ''}
                />
                {errors.companyName && <p className="text-sm text-red-500">{errors.companyName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerName">Owner Name *</Label>
                <Input
                  id="ownerName"
                  value={formData.ownerName}
                  onChange={(e) => handleInputChange('ownerName', e.target.value)}
                  placeholder="Enter owner name"
                  className={errors.ownerName ? 'border-red-500' : ''}
                />
                {errors.ownerName && <p className="text-sm text-red-500">{errors.ownerName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Enter city"
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="Enter phone number"
                  className={errors.phoneNumber ? 'border-red-500' : ''}
                />
                {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter complete address"
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
              </div>
            </CardContent>
          </Card>

          {/* AMC Contract Details */}
          <Card>
            <CardHeader>
              <CardTitle>AMC Contract Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>AMC Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground",
                        errors.amcStartDate && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={handleStartDateChange}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.amcStartDate && <p className="text-sm text-red-500">{errors.amcStartDate}</p>}
              </div>

              <div className="space-y-2">
                <Label>AMC End Date (Auto-calculated)</Label>
                <Input
                  value={formData.amcEndDate ? format(new Date(formData.amcEndDate), "PPP") : ''}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label>AMC Type</Label>
                <Select value={formData.amcType} onValueChange={(value: 'A' | 'B' | 'C') => handleInputChange('amcType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select AMC type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Type A - Premium (Weekly Service)</SelectItem>
                    <SelectItem value="B">Type B - Standard (Monthly Service)</SelectItem>
                    <SelectItem value="C">Type C - Basic (On-Demand)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amcAmount">AMC Amount *</Label>
                <Input
                  id="amcAmount"
                  type="number"
                  value={formData.amcAmount}
                  onChange={(e) => handleInputChange('amcAmount', parseFloat(e.target.value) || 0)}
                  placeholder="Enter AMC amount"
                  className={errors.amcAmount ? 'border-red-500' : ''}
                />
                {errors.amcAmount && <p className="text-sm text-red-500">{errors.amcAmount}</p>}
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="productDescription">Product Description</Label>
                <Textarea
                  id="productDescription"
                  value={formData.productDescription}
                  onChange={(e) => handleInputChange('productDescription', e.target.value)}
                  placeholder="Describe the CCTV system and components"
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value: 'active' | 'proposed' | 'expired' | 'suspended' | 'cancelled') => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="proposed">Proposed</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Details */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details {formData.status === 'proposed' && '(Optional for Proposals)'}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice Number {formData.status === 'proposed' && '(Optional)'}</Label>
                <Input
                  id="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                  placeholder={formData.status === 'proposed' ? "Will be generated later" : "Enter invoice number"}
                  disabled={formData.status === 'proposed'}
                />
              </div>

              <div className="space-y-2">
                <Label>Invoice Date {formData.status === 'proposed' && '(Optional)'}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !invoiceDate && "text-muted-foreground"
                      )}
                      disabled={formData.status === 'proposed'}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {invoiceDate ? format(invoiceDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={invoiceDate}
                      onSelect={handleInvoiceDateChange}
                      initialFocus
                      className="pointer-events-auto"
                      disabled={formData.status === 'proposed'}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceAmount">Invoice Amount {formData.status === 'proposed' && '(Optional)'}</Label>
                <Input
                  id="invoiceAmount"
                  type="number"
                  value={formData.invoiceAmount}
                  onChange={(e) => handleInputChange('invoiceAmount', parseFloat(e.target.value) || 0)}
                  placeholder={formData.status === 'proposed' ? "Will be set later" : "Enter invoice amount"}
                  disabled={formData.status === 'proposed'}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Update Customer' : 'Add Customer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;
