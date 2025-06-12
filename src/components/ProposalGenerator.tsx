import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText } from 'lucide-react';

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
}

interface ProposalGeneratorProps {
  customer: Customer;
  onBack: () => void;
}

const ProposalGenerator: React.FC<ProposalGeneratorProps> = ({ customer, onBack }) => {
  const getAMCTypeDetails = (type: 'A' | 'B' | 'C') => {
    switch (type) {
      case 'A':
        return {
          title: 'TYPE A (Premium Plan) - Weekly Service',
          services: {
            gujarati: [
              'CCTV કેમેરા સિસ્ટમનું વીલાલી ટેસ્ટિંગ કેમ્પ રેકોર્ડિંગ, ટાઇમ અને તારીખ, પાવર સપ્લાય, હાર્ડ ડિસ્ક તેમજ કેમેરા સિસ્ટમ',
              'CCTV કેમેરા સિસ્ટમનું બેકઅપ જ્યારે જરૂરિયાત હોય ત્યારે',
              'CCTV કેમેરા સિસ્ટમમાં અનલિમિટેડ બેક ડાઉન સર્વિસ કૉલ',
              'CCTV કેમેરા સિસ્ટમમાં સોફ્ટવેર અપગ્રેડ ઑનનાઇન મોનાઇટિંગ મોનીટરિંગ રીપોર્ટ',
              'CCTV કેમેરા સિસ્ટમમાં હાર્ડિસ્ક હેલ્થ તેમજ બધિજ વિગતો',
              '1st Priority સર્વિસ કૉલ એટેન્ડન્સ',
              'નોંધ - કેમેરાની કેબલિંગ, પુનઃસ્થાપના અને સફાઈ સામેલ નથી.'
            ],
            english: [
              'CCTV camera system weekly testing camp recording, time and date, power supply, hard disk as well as camera system',
              'CCTV camera system backup when required',
              'Unlimited back down service calls in CCTV camera system',
              'Software upgrade online monitoring monitoring report in CCTV camera system',
              'Hard disk health as well as other information in CCTV camera system',
              '1st Priority service call attendance',
              'NOTE - CABELING , REINSTALLING AND CLEANING OF CAMERAS ARE NOT INCLUDED.'
            ]
          },
          frequency: 'Weekly Service Visits'
        };
      case 'B':
        return {
          title: 'TYPE B (Standard Plan) - Monthly Service',
          services: {
            gujarati: [
              'કેમેરા સિસ્ટમનું મંથલી ટેસ્ટિંગ કેમ્પ રેકોર્ડિંગ ટાઇમ અને તારીખ પાવર સપ્લાય હાર્ડ ડિસ્ક તેમજ કેમેરા સિસ્ટમ',
              'CCTV કેમેરા સિસ્ટમનું બેકઅપ જ્યારે જરૂરિયાત હોય ત્યારે',
              'CCTV કેમેરા સિસ્ટમમાં અનલિમિટેડ બેક ડાઉન સર્વિસ કૉલ',
              'CCTV કેમેરા સિસ્ટમમાં સોફ્ટવેર અપગ્રેડ ઑનનાઇન મોનાઇટિંગ મોનીટરિંગ રીપોર્ટ',
              'CCTV કેમેરા સિસ્ટમમાં હાર્ડિસ્ક હેલ્થ તેમજ બધિજ વિગતો',
              '2nd Priority સર્વિસ કૉલ એટેન્ડન્સ',
              'નોંધ - કેમેરાની કેબલિંગ, પુનઃસ્થાપના અને સફાઈ સામેલ નથી.'
            ],
            english: [
              'Camera system monthly testing camp recording time and date power supply hard disk as well as camera system',
              'CCTV camera system backup when required',
              'Unlimited back down service calls in CCTV camera system',
              'Software upgrade online monitoring monitoring report in CCTV camera system',
              'Hard disk health as well as other information in CCTV camera system',
              '2nd Priority service call attendance',
              'NOTE - CABELING , REINSTALLING AND CLEANING OF CAMERAS ARE NOT INCLUDED.'
            ]
          },
          frequency: 'Monthly Service Visits'
        };
      case 'C':
        return {
          title: 'TYPE C (Basic Plan) - On-Demand Service',
          services: {
            gujarati: [
              'CCTV કેમેરા સિસ્ટમનું બેક અપ જ્યારે જરૂરિયાત હોય ત્યારે',
              'CCTV કેમેરા સિસ્ટમમાં અનલિમિટેડ બેક ડાઉન સર્વિસ કૉલ',
              'CCTV કેમેરા સિસ્ટમમાં સોફ્ટવેર અપગ્રેડ ઑનનાઇન સપોર્ટ',
              'CCTV કેમેરા સિસ્ટમમાં હાર્ડિસ્ક હેલ્થ તેમજ બધિજ વિગતો',
              '3rd Priority સર્વિસ કૉલ એટેન્ડન્સ',
              'નોંધ - કેમેરાની કેબલિંગ, પુનઃસ્થાપના અને સફાઈ સામેલ નથી.'
            ],
            english: [
              'CCTV camera system backup when required',
              'Unlimited back down service calls in CCTV camera system',
              'Software upgrade online support in CCTV camera system',
              'Hard disk health as well as other information in CCTV camera system',
              '3rd Priority service call attendance',
              'NOTE - CABELING , REINSTALLING AND CLEANING OF CAMERAS ARE NOT INCLUDED.'
            ]
          },
          frequency: 'On-Demand Service Only'
        };
    }
  };

  const typeDetails = getAMCTypeDetails(customer.amcType);
  const proposalDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // For now, we'll use the browser's print to PDF functionality
    window.print();
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-2">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-2 print:hidden">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Customers
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={handlePrint}>
              <FileText className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button onClick={handleDownloadPDF}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Proposal Document */}
        <Card className="print:shadow-none print:border-none">
          <CardContent className="p-4">
            {/* Company Header */}
            <div className="text-center mb-2 border-b pb-2">
              <h1 className="text-xl font-bold text-primary mb-0.5">MAX Digital & Services</h1>
              <p className="text-sm text-muted-foreground">CCTV Installation & Maintenance Services</p>
              <div className="mt-1 text-xs text-muted-foreground">
                <p>Phone: +91 9825452543, +91 9824206864</p>
                <p>Email: maxdigitalandservices@gmail.com</p>
                <p>First Floor, Radheshyam Chambers, Haluriya - Pirchhalla Road, Near Gruhlakshmi Bhavnagar - 364001, Gujarat, India</p>
              </div>
            </div>

            {/* Proposal Header */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <h2 className="text-base font-semibold mb-1">AMC PROPOSAL</h2>
                <div className="space-y-0.5 text-xs">
                  <p><strong>Date:</strong> {proposalDate}</p>
                  <p><strong>Valid Until:</strong> {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                  })}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-xs">Customer Details:</h3>
                <div className="bg-muted p-1.5 rounded-lg text-xs space-y-0.5">
                  <p><strong>Company:</strong> {customer.companyName}</p>
                  <p><strong>Contact Person:</strong> {customer.ownerName}</p>
                  <p><strong>Address:</strong> {customer.address}</p>
                  <p><strong>City:</strong> {customer.city}</p>
                  <p><strong>Phone:</strong> {customer.phoneNumber}</p>
                </div>
              </div>
            </div>

            {/* Product Description */}
            {customer.productDescription && (
              <div className="mb-2">
                <h3 className="text-sm font-semibold mb-1">Description of Products/Services:</h3>
                <div className="bg-muted p-1.5 rounded-lg">
                  <p className="text-xs">{customer.productDescription}</p>
                </div>
              </div>
            )}

            {/* AMC Plan Details */}
            <div className="mb-2">
              <h3 className="text-sm font-semibold mb-1">Proposed AMC Plan</h3>
              <div className="border rounded-lg p-2">
                <h4 className="text-base font-bold text-primary mb-0.5">{typeDetails.title}</h4>
                <p className="text-xs text-muted-foreground mb-1">{typeDetails.frequency}</p>
                
                <h5 className="font-semibold mb-1 text-xs">Services Included:</h5>
                <div className="grid grid-cols-2 gap-1">
                  <div>
                    <h6 className="font-medium mb-0.5 text-xs">Gujarati</h6>
                    <ul className="space-y-0.5 text-xs">
                      {typeDetails.services.gujarati.map((service, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-primary mr-0.5">•</span>
                          <span>{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium mb-0.5 text-xs">English</h6>
                    <ul className="space-y-0.5 text-xs">
                      {typeDetails.services.english.map((service, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-primary mr-0.5">•</span>
                          <span>{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Contract Details */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <h3 className="text-sm font-semibold mb-1">Contract Duration</h3>
                <div className="bg-muted p-1.5 rounded-lg text-xs space-y-0.5">
                  <p><strong>Start Date:</strong> {new Date(customer.amcStartDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                  })}</p>
                  <p><strong>End Date:</strong> {new Date(customer.amcEndDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                  })}</p>
                  <p><strong>Duration:</strong> 12 Months</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1">Investment Details</h3>
                <div className="bg-primary/10 p-1.5 rounded-lg text-xs space-y-0.5">
                  <p><strong>Total AMC Amount:</strong></p>
                  <p className="text-lg font-bold text-primary">₹{customer.amcAmount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">(Including all taxes)</p>
                </div>
              </div>
            </div>

            {/* Payment Terms */}
            <div className="mb-2">
              <h3 className="text-sm font-semibold mb-1">Payment Information</h3>
              <div className="bg-muted p-1.5 rounded-lg text-xs">
                <p><strong>Payment Mode:</strong> Bank Transfer / Cheque / Cash</p>
              </div>
            </div>

            {/* Signature Section */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <h4 className="font-semibold mb-2 text-xs">Customer Acceptance</h4>
                <div className="space-y-1">
                  <div className="border-b border-gray-300 pb-0.5">
                    <p className="text-xs text-muted-foreground">Signature</p>
                  </div>
                  <div>
                    <p className="text-xs"><strong>Name:</strong> {customer.ownerName}</p>
                    <p className="text-xs"><strong>Date:</strong> _____________</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-xs">Authorized Signatory</h4>
                <div className="space-y-1">
                  <div className="border-b border-gray-300 pb-0.5">
                    <p className="text-xs text-muted-foreground">Signature</p>
                  </div>
                  <div>
                    <p className="text-xs"><strong>Name:</strong> Authorized Person</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-2 pt-1 border-t text-xs text-muted-foreground">
              <p>Thank you for choosing MAX Digital & Services for your CCTV maintenance needs.</p>
              <p>For any queries, please contact us at +91 9825452543, +91 9824206864</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            margin: 0.3cm;
            size: A4;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-none {
            border: none !important;
          }
          body {
            font-size: 8pt;
          }
          .text-2xl {
            font-size: 1.1rem !important;
          }
          .text-lg {
            font-size: 0.9rem !important;
          }
          .text-base {
            font-size: 0.8rem !important;
          }
          .text-sm {
            font-size: 0.7rem !important;
          }
          .text-xs {
            font-size: 0.65rem !important;
          }
          .p-6 {
            padding: 0.75rem !important;
          }
          .mb-4 {
            margin-bottom: 0.5rem !important;
          }
          .space-y-4 > * + * {
            margin-top: 0.5rem !important;
          }
          .space-y-2 > * + * {
            margin-top: 0.25rem !important;
          }
          .space-y-1 > * + * {
            margin-top: 0.15rem !important;
          }
          .gap-4 {
            gap: 0.5rem !important;
          }
          .gap-2 {
            gap: 0.25rem !important;
          }
          .p-2 {
            padding: 0.25rem !important;
          }
          .mt-4 {
            margin-top: 0.5rem !important;
          }
          .pt-2 {
            padding-top: 0.25rem !important;
          }
          .pb-4 {
            padding-bottom: 0.5rem !important;
          }
          .mb-2 {
            margin-bottom: 0.25rem !important;
          }
          .mb-1 {
            margin-bottom: 0.15rem !important;
          }
          .mt-2 {
            margin-top: 0.25rem !important;
          }
          .rounded-lg {
            border-radius: 0.25rem !important;
          }
          .border-b {
            border-bottom-width: 1px !important;
          }
          .border-t {
            border-top-width: 1px !important;
          }
          .border {
            border-width: 1px !important;
          }
          .text-xl {
            font-size: 1rem !important;
          }
          .text-3xl {
            font-size: 1.2rem !important;
          }
          .text-4xl {
            font-size: 1.3rem !important;
          }
          .text-5xl {
            font-size: 1.4rem !important;
          }
          .text-6xl {
            font-size: 1.5rem !important;
          }
          .text-7xl {
            font-size: 1.6rem !important;
          }
          .text-8xl {
            font-size: 1.7rem !important;
          }
          .text-9xl {
            font-size: 1.8rem !important;
          }
          .text-10xl {
            font-size: 1.9rem !important;
          }
          .text-11xl {
            font-size: 2rem !important;
          }
          .text-12xl {
            font-size: 2.1rem !important;
          }
          .text-13xl {
            font-size: 2.2rem !important;
          }
          .text-14xl {
            font-size: 2.3rem !important;
          }
          .text-15xl {
            font-size: 2.4rem !important;
          }
          .text-16xl {
            font-size: 2.5rem !important;
          }
          .text-17xl {
            font-size: 2.6rem !important;
          }
          .text-18xl {
            font-size: 2.7rem !important;
          }
          .text-19xl {
            font-size: 2.8rem !important;
          }
          .text-20xl {
            font-size: 2.9rem !important;
          }
          .text-21xl {
            font-size: 3rem !important;
          }
          .text-22xl {
            font-size: 3.1rem !important;
          }
          .text-23xl {
            font-size: 3.2rem !important;
          }
          .text-24xl {
            font-size: 3.3rem !important;
          }
          .text-25xl {
            font-size: 3.4rem !important;
          }
          .text-26xl {
            font-size: 3.5rem !important;
          }
          .text-27xl {
            font-size: 3.6rem !important;
          }
          .text-28xl {
            font-size: 3.7rem !important;
          }
          .text-29xl {
            font-size: 3.8rem !important;
          }
          .text-30xl {
            font-size: 3.9rem !important;
          }
          .text-31xl {
            font-size: 4rem !important;
          }
          .text-32xl {
            font-size: 4.1rem !important;
          }
          .text-33xl {
            font-size: 4.2rem !important;
          }
          .text-34xl {
            font-size: 4.3rem !important;
          }
          .text-35xl {
            font-size: 4.4rem !important;
          }
          .text-36xl {
            font-size: 4.5rem !important;
          }
          .text-37xl {
            font-size: 4.6rem !important;
          }
          .text-38xl {
            font-size: 4.7rem !important;
          }
          .text-39xl {
            font-size: 4.8rem !important;
          }
          .text-40xl {
            font-size: 4.9rem !important;
          }
          .text-41xl {
            font-size: 5rem !important;
          }
          .text-42xl {
            font-size: 5.1rem !important;
          }
          .text-43xl {
            font-size: 5.2rem !important;
          }
          .text-44xl {
            font-size: 5.3rem !important;
          }
          .text-45xl {
            font-size: 5.4rem !important;
          }
          .text-46xl {
            font-size: 5.5rem !important;
          }
          .text-47xl {
            font-size: 5.6rem !important;
          }
          .text-48xl {
            font-size: 5.7rem !important;
          }
          .text-49xl {
            font-size: 5.8rem !important;
          }
          .text-50xl {
            font-size: 5.9rem !important;
          }
          .text-51xl {
            font-size: 6rem !important;
          }
          .text-52xl {
            font-size: 6.1rem !important;
          }
          .text-53xl {
            font-size: 6.2rem !important;
          }
          .text-54xl {
            font-size: 6.3rem !important;
          }
          .text-55xl {
            font-size: 6.4rem !important;
          }
          .text-56xl {
            font-size: 6.5rem !important;
          }
          .text-57xl {
            font-size: 6.6rem !important;
          }
          .text-58xl {
            font-size: 6.7rem !important;
          }
          .text-59xl {
            font-size: 6.8rem !important;
          }
          .text-60xl {
            font-size: 6.9rem !important;
          }
          .text-61xl {
            font-size: 7rem !important;
          }
          .text-62xl {
            font-size: 7.1rem !important;
          }
          .text-63xl {
            font-size: 7.2rem !important;
          }
          .text-64xl {
            font-size: 7.3rem !important;
          }
          .text-65xl {
            font-size: 7.4rem !important;
          }
          .text-66xl {
            font-size: 7.5rem !important;
          }
          .text-67xl {
            font-size: 7.6rem !important;
          }
          .text-68xl {
            font-size: 7.7rem !important;
          }
          .text-69xl {
            font-size: 7.8rem !important;
          }
          .text-70xl {
            font-size: 7.9rem !important;
          }
          .text-71xl {
            font-size: 8rem !important;
          }
          .text-72xl {
            font-size: 8.1rem !important;
          }
          .text-73xl {
            font-size: 8.2rem !important;
          }
          .text-74xl {
            font-size: 8.3rem !important;
          }
          .text-75xl {
            font-size: 8.4rem !important;
          }
          .text-76xl {
            font-size: 8.5rem !important;
          }
          .text-77xl {
            font-size: 8.6rem !important;
          }
          .text-78xl {
            font-size: 8.7rem !important;
          }
          .text-79xl {
            font-size: 8.8rem !important;
          }
          .text-80xl {
            font-size: 8.9rem !important;
          }
          .text-81xl {
            font-size: 9rem !important;
          }
          .text-82xl {
            font-size: 9.1rem !important;
          }
          .text-83xl {
            font-size: 9.2rem !important;
          }
          .text-84xl {
            font-size: 9.3rem !important;
          }
          .text-85xl {
            font-size: 9.4rem !important;
          }
          .text-86xl {
            font-size: 9.5rem !important;
          }
          .text-87xl {
            font-size: 9.6rem !important;
          }
          .text-88xl {
            font-size: 9.7rem !important;
          }
          .text-89xl {
            font-size: 9.8rem !important;
          }
          .text-90xl {
            font-size: 9.9rem !important;
          }
          .text-91xl {
            font-size: 10rem !important;
          }
          .text-92xl {
            font-size: 10.1rem !important;
          }
          .text-93xl {
            font-size: 10.2rem !important;
          }
          .text-94xl {
            font-size: 10.3rem !important;
          }
          .text-95xl {
            font-size: 10.4rem !important;
          }
          .text-96xl {
            font-size: 10.5rem !important;
          }
          .text-97xl {
            font-size: 10.6rem !important;
          }
          .text-98xl {
            font-size: 10.7rem !important;
          }
          .text-99xl {
            font-size: 10.8rem !important;
          }
          .text-100xl {
            font-size: 10.9rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProposalGenerator;
