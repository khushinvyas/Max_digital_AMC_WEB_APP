import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText, Users, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCustomers } from '@/hooks/useCustomers';
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
  const [currentView, setCurrentView] = useState<'dashboard' | 'add-customer' | 'customers' | 'proposal'>('dashboard');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const { user, signOut } = useAuth();
  const { customers, loading, addCustomer, updateCustomer, deleteCustomer } = useCustomers();

  const handleSignOut = async () => {
    await signOut();
  };

  // Calculate customer status and next service dates
  const customersWithUpdatedStatus = customers.map(customer => {
    const today = new Date();
    const endDate = new Date(customer.amcEndDate);
    const startDate = new Date(customer.amcStartDate);
    
    let status = customer.status;
    if (endDate < today && customer.status === 'active') {
      status = 'expired';
    }

    let nextServiceDate = customer.nextServiceDate;
    if (customer.amcType === 'A') {
      // Weekly service - maintain same day of week as start date
      const startDay = startDate.getDay(); // 0-6 (Sunday-Saturday)
      const currentDay = today.getDay();
      
      // Calculate days until next service
      let daysUntilNextService = (startDay - currentDay + 7) % 7;
      if (daysUntilNextService === 0) {
        // If today is the service day, check if we need to schedule for next week
        if (new Date(customer.lastServiceDate) >= today) {
          daysUntilNextService = 7;
        }
      }
      
      const nextService = new Date(today);
      nextService.setDate(today.getDate() + daysUntilNextService);
      nextServiceDate = nextService.toISOString().split('T')[0];
    } else if (customer.amcType === 'B') {
      // Monthly service - maintain same date of month as start date
      const startDateOfMonth = startDate.getDate(); // Get the date (1-31) from start date
      const currentDate = today.getDate();
      
      // Calculate months until next service
      let monthsUntilNextService = 0;
      if (currentDate > startDateOfMonth) {
        // If we've passed the service date this month, schedule for next month
        monthsUntilNextService = 1;
      }
      
      const nextService = new Date(today);
      nextService.setMonth(today.getMonth() + monthsUntilNextService);
      
      // Handle edge cases for months with different number of days
      const daysInTargetMonth = new Date(
        nextService.getFullYear(),
        nextService.getMonth() + 1,
        0
      ).getDate();
      
      // If the target date doesn't exist in the target month (e.g., Jan 31 -> Feb 28),
      // use the last day of the target month
      const targetDate = Math.min(startDateOfMonth, daysInTargetMonth);
      nextService.setDate(targetDate);
      
      // If the calculated date is today and service was already done today,
      // schedule for next month
      if (nextService.toISOString().split('T')[0] === today.toISOString().split('T')[0] &&
          new Date(customer.lastServiceDate) >= today) {
        nextService.setMonth(nextService.getMonth() + 1);
        // Recalculate the target date for the new month
        const daysInNewMonth = new Date(
          nextService.getFullYear(),
          nextService.getMonth() + 1,
          0
        ).getDate();
        nextService.setDate(Math.min(startDateOfMonth, daysInNewMonth));
      }
      
      nextServiceDate = nextService.toISOString().split('T')[0];
    }

    return { ...customer, status, nextServiceDate };
  });

  // Calculate dashboard metrics
  const activeCustomers = customersWithUpdatedStatus.filter(c => c.status === 'active');
  const proposedCustomers = customersWithUpdatedStatus.filter(c => c.status === 'proposed');
  const expiredCustomers = customersWithUpdatedStatus.filter(c => c.status === 'expired');
  
  const today = new Date().toISOString().split('T')[0];
  const todaysServices = customersWithUpdatedStatus.filter(c => c.nextServiceDate === today);
  
  const expiringIn7Days = customersWithUpdatedStatus
    .filter(c => {
      const today = new Date();
      const endDate = new Date(c.amcEndDate);
      const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      
      // Only include active customers
      if (c.status !== 'active') return false;
      
      // Check if the end date is within the next 7 days and hasn't expired yet
      return endDate <= sevenDaysFromNow && endDate > today;
    })
    .map(customer => {
      const today = new Date();
      const endDate = new Date(customer.amcEndDate);
      const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return { ...customer, daysRemaining };
    })
    .sort((a, b) => a.daysRemaining - b.daysRemaining); // Sort by days remaining ascending

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

  const getRenewalAlertColor = (daysRemaining: number) => {
    if (daysRemaining <= 3) {
      return 'bg-red-50 border-red-200 text-red-800';
    }
    return 'bg-yellow-50 border-yellow-200 text-yellow-800';
  };

  const getRenewalAlertBadgeColor = (daysRemaining: number) => {
    if (daysRemaining <= 3) {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-yellow-100 text-yellow-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

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
        customers={customersWithUpdatedStatus}
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
            <p className="text-muted-foreground">Welcome back, {user?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => setCurrentView('add-customer')}>
              Add New Customer
            </Button>
            <Button variant="outline" onClick={() => setCurrentView('customers')}>
              View All Customers
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
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
                    <div 
                      key={customer.id} 
                      className={`flex justify-between items-center p-3 rounded-lg border ${getRenewalAlertColor(customer.daysRemaining)}`}
                    >
                      <div>
                        <p className="font-medium">{customer.companyName}</p>
                        <p className="text-sm text-muted-foreground">{customer.ownerName}</p>
                        <p className="text-sm">
                          Expires: {new Date(customer.amcEndDate).toLocaleDateString()}
                          <span className="ml-2 font-medium">
                            ({customer.daysRemaining} {customer.daysRemaining === 1 ? 'day' : 'days'} remaining)
                          </span>
                        </p>
                      </div>
                      <Badge className={getRenewalAlertBadgeColor(customer.daysRemaining)}>
                        {customer.daysRemaining <= 3 ? 'Urgent Renewal' : 'Expiring Soon'}
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
                  {customersWithUpdatedStatus.filter(c => c.amcType === 'A').length}
                </div>
                <p className="text-sm text-blue-600">Type A (Premium)</p>
                <p className="text-xs text-muted-foreground">Weekly Service</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {customersWithUpdatedStatus.filter(c => c.amcType === 'B').length}
                </div>
                <p className="text-sm text-green-600">Type B (Standard)</p>
                <p className="text-xs text-muted-foreground">Monthly Service</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {customersWithUpdatedStatus.filter(c => c.amcType === 'C').length}
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
