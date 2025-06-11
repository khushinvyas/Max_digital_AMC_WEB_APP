
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

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

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCustomers = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching customers:', error);
        toast({
          title: "Error",
          description: "Failed to load customers",
          variant: "destructive",
        });
        return;
      }

      // Transform data to match component interface
      const transformedCustomers = data?.map(customer => ({
        id: customer.id,
        companyName: customer.company_name,
        ownerName: customer.owner_name,
        city: customer.city,
        address: customer.address,
        phoneNumber: customer.phone_number,
        amcStartDate: customer.amc_start_date,
        amcEndDate: customer.amc_end_date,
        amcType: customer.amc_type,
        amcAmount: Number(customer.amc_amount),
        productDescription: customer.product_description || '',
        invoiceNumber: customer.invoice_number,
        invoiceDate: customer.invoice_date,
        invoiceAmount: Number(customer.invoice_amount),
        status: customer.status,
        nextServiceDate: customer.next_service_date,
      })) || [];

      setCustomers(transformedCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: "Error",
        description: "Failed to load customers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (customerData: Omit<Customer, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([{
          user_id: user.id,
          company_name: customerData.companyName,
          owner_name: customerData.ownerName,
          city: customerData.city,
          address: customerData.address,
          phone_number: customerData.phoneNumber,
          amc_start_date: customerData.amcStartDate,
          amc_end_date: customerData.amcEndDate,
          amc_type: customerData.amcType,
          amc_amount: customerData.amcAmount.toString(),
          product_description: customerData.productDescription,
          invoice_number: customerData.invoiceNumber,
          invoice_date: customerData.invoiceDate,
          invoice_amount: customerData.invoiceAmount.toString(),
          status: customerData.status,
          next_service_date: customerData.nextServiceDate,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding customer:', error);
        toast({
          title: "Error",
          description: "Failed to add customer",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Customer added successfully",
      });

      fetchCustomers();
    } catch (error) {
      console.error('Error adding customer:', error);
      toast({
        title: "Error",
        description: "Failed to add customer",
        variant: "destructive",
      });
    }
  };

  const updateCustomer = async (updatedCustomer: Customer) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('customers')
        .update({
          company_name: updatedCustomer.companyName,
          owner_name: updatedCustomer.ownerName,
          city: updatedCustomer.city,
          address: updatedCustomer.address,
          phone_number: updatedCustomer.phoneNumber,
          amc_start_date: updatedCustomer.amcStartDate,
          amc_end_date: updatedCustomer.amcEndDate,
          amc_type: updatedCustomer.amcType,
          amc_amount: updatedCustomer.amcAmount.toString(),
          product_description: updatedCustomer.productDescription,
          invoice_number: updatedCustomer.invoiceNumber,
          invoice_date: updatedCustomer.invoiceDate,
          invoice_amount: updatedCustomer.invoiceAmount.toString(),
          status: updatedCustomer.status,
          next_service_date: updatedCustomer.nextServiceDate,
        })
        .eq('id', updatedCustomer.id);

      if (error) {
        console.error('Error updating customer:', error);
        toast({
          title: "Error",
          description: "Failed to update customer",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Customer updated successfully",
      });

      fetchCustomers();
    } catch (error) {
      console.error('Error updating customer:', error);
      toast({
        title: "Error",
        description: "Failed to update customer",
        variant: "destructive",
      });
    }
  };

  const deleteCustomer = async (customerId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customerId);

      if (error) {
        console.error('Error deleting customer:', error);
        toast({
          title: "Error",
          description: "Failed to delete customer",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });

      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [user]);

  return {
    customers,
    loading,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    refetch: fetchCustomers,
  };
};
