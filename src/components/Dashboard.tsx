
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText, Users } from 'lucide-react';
import CustomerForm from './CustomerForm';
import CustomerList from './CustomerList';
import ProposalGenerator from './ProposalGenerator';

interface Customer {
  id: string;
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
  nextServiceDate?: string;
}

const Dashboard = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'add-customer' | 'customers' | 'proposal'>('dashboard');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Load customers from localStorage on component mount
  useEffect(() => {
    const savedCustomers = localStorage.getItem('amcCustomers');
    if (savedCustomers) {
      const parsedCustomers = JSON.parse(savedCustomers);
      // Update customer statuses and next service dates
      const updatedCustomers = parsedCustomers.map((customer: Customer) => ({
        ...customer,
        ...updateCustomerStatus(customer),
        nextServiceDate: calculateNextServiceDate(customer)
      }));
      setCustomers(updatedCustomers);
    }
  }, []);

  // Save customers to localStorage whenever customers state changes
  useEffect(() => {
    localStorage.setItem('amcCustomers', JSON.stringify(customers));
  }, [customers]);

  const updateCustomerStatus = (customer: Customer) => {
    const today = new Date();
    const endDate = new Date(customer.amcEndDate);
    const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    if (endDate < today) {
      return { status: 'expired' as const };
    } else if (endDate <= sevenDaysFromNow) {
      return { status: 'active' as const }; // Still active but expiring soon
    } else {
      return { status: customer.status };
    }
  };

  const calculateNextServiceDate = (customer: Customer): string => {
    const today = new Date();
    const startDate = new Date(customer.amcStartDate);
    
    if (customer.amcType === 'A') {
      // Weekly service - find next Monday
      const nextMonday = new Date(today);
      nextMonday.setDate(today.getDate() + (7 - today.getDay() + 1) % 7);
      return nextMonday.toISOString().split('T')[0];
    } else if (customer.amcType === 'B') {
      // Monthly service - same date next month
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);
      nextMonth.setDate(startDate.getDate());
      return nextMonth.toISOString().split('T')[0];
    }
    return ''; // Type C has no scheduled service
  };

  const addCustomer = (customerData: Omit<Customer, 'id'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      nextServiceDate: calculateNextServiceDate(customerData as Customer)
    };
    setCustomers(prev => [...prev, newCustomer]);
    setCurrentView('dashboard');
  };

  const updateCustomer = (updatedCustomer: Customer) => {
    setCustomers(prev => prev.map(c => 
      c.id === updatedCustomer.id 
        ? { ...updatedCustomer, nextServiceDate: calculateNextServiceDate(updatedCustomer) }
        : c
    ));
  };

  const deleteCustomer = (customerId: string) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
  };

  // Calculate dashboard metrics
  const activeCustomers = customers.filter(c => c.status === 'active');
  const proposedCustomers = customers.filter(c => c.status === 'proposed');
  const expiredCustomers = customers.filter(c => c.status === 'expired');
  
  const today = new Date().toISOString().split('T')[0];
  const todaysServices = customers.filter(c => c.nextServiceDate === today);
  
  const expiringIn7Days = customers.filter(c => {
    const endDate = new Date(c.amcEndDate);
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return endDate <= sevenDaysFromNow && endDate >= new Date();
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'proposed': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (currentView === 'add-customer') {
    return (
      <CustomerForm 
        onSubmit={addCustomer}
        onCancel={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'customers') {
    return (
      <CustomerList
        customers={customers}
        onBack={() => setCurrentView('dashboard')}
        onEdit={updateCustomer}
        onDelete={deleteCustomer}
        onGenerateProposal={(customer) => {
          setSelectedCustomer(customer);
          setCurrentView('proposal');
        }}
      />
    );
  }

  if (currentView === 'proposal' && selectedCustomer) {
    return (
      <ProposalGenerator
        customer={selectedCustomer}
        onBack={() => {
          setCurrentView('customers');
          setSelectedCustomer(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">AMC Management System</h1>
            <p className="text-muted-foreground">Manage your Annual Maintenance Contracts efficiently</p>
          </div>
          <div className="space-x-3">
            <Button onClick={() => setCurrentView('add-customer')}>
              Add New Customer
            </Button>
            <Button variant="outline" onClick={() => setCurrentView('customers')}>
              View All Customers
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentView('customers')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active AMCs</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeCustomers.length}</div>
              <p className="text-xs text-muted-foreground">Currently active contracts</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentView('customers')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Proposed AMCs</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{proposedCustomers.length}</div>
              <p className="text-xs text-muted-foreground">Pending proposals</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expired AMCs</CardTitle>
              <Clock className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{expiredCustomers.length}</div>
              <p className="text-xs text-muted-foreground">Require renewal</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Services</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{todaysServices.length}</div>
              <p className="text-xs text-muted-foreground">Scheduled for today</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Scheduled Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todaysServices.length === 0 ? (
                <p className="text-muted-foreground">No services scheduled for today</p>
              ) : (
                <div className="space-y-3">
                  {todaysServices.map(customer => (
                    <div key={customer.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{customer.companyName}</p>
                        <p className="text-sm text-muted-foreground">{customer.ownerName} • Type {customer.amcType}</p>
                        <p className="text-sm text-muted-foreground">{customer.city}</p>
                      </div>
                      <Badge className={getStatusColor(customer.status)}>
                        {customer.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Renewal Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Renewal Alerts (Next 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {expiringIn7Days.length === 0 ? (
                <p className="text-muted-foreground">No contracts expiring in the next 7 days</p>
              ) : (
                <div className="space-y-3">
                  {expiringIn7Days.map(customer => (
                    <div key={customer.id} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div>
                        <p className="font-medium">{customer.companyName}</p>
                        <p className="text-sm text-muted-foreground">{customer.ownerName}</p>
                        <p className="text-sm text-yellow-600">Expires: {new Date(customer.amcEndDate).toLocaleDateString()}</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Expiring Soon
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>AMC Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {customers.filter(c => c.amcType === 'A').length}
                </div>
                <p className="text-sm text-blue-600">Type A (Premium)</p>
                <p className="text-xs text-muted-foreground">Weekly Service</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {customers.filter(c => c.amcType === 'B').length}
                </div>
                <p className="text-sm text-green-600">Type B (Standard)</p>
                <p className="text-xs text-muted-foreground">Monthly Service</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {customers.filter(c => c.amcType === 'C').length}
                </div>
                <p className="text-sm text-purple-600">Type C (Basic)</p>
                <p className="text-xs text-muted-foreground">On-Demand</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
