'use client';

import { useState, ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { referralSchema, type ReferralFormData } from '@/lib/schemas';
import { trpc } from '@/lib/trpc-client';

import {
  User,
  Mail,
  Phone,
  Calendar,
  Building,
  Briefcase,
  Stethoscope,
  MapPin,
  Loader2, // A spinner icon
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

const CLINIC_LOCATIONS = [
  'Anaheim',
  'Culver City',
  'Downey',
  'El Monte',
  'Long Beach',
  'Los Angeles',
];

// --- A helper component for consistent input styling with icons ---
const InputGroup = ({ icon, children }: { icon: ReactNode; children: ReactNode }) => (
  <div className="relative">
    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
      {icon}
    </div>
    {children}
  </div>
);


export default function ReferralForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ReferralFormData>({
    resolver: zodResolver(referralSchema),
    mode: 'onBlur',
  });

  const complaintLength = watch('primaryComplaint')?.length || 0;

  const onSubmit = async (data: ReferralFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    setSuccessMessage('');
    try {
      // Call backend via tRPC client
      const result = await trpc.referral.submitReferral.mutate(data);
      
      if (result.success) {
        const fullMessage = `${result.message}. ${result.estimatedFollowUp}`;
        setSuccessMessage(fullMessage);
        setSubmitStatus('success');
        reset();
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        throw new Error(result.message || 'Failed to submit referral');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit referral. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">Patient Referral Portal</h1>
            <p className="text-slate-500 mt-2">Submit a new patient referral to Synergex Med</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">          
          {submitStatus === 'success' && (
            <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200">
              <CheckCircle2 className="h-5 w-5" />
              <p className="font-medium text-sm">{successMessage}</p>
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
              <AlertTriangle className="h-5 w-5" />
              <p className="font-medium text-sm">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              <h2 className="flex items-center gap-3 text-xl font-semibold text-slate-700">
                <User className="h-6 w-6 text-blue-600" />
                Patient Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="patientFirstName" className="block text-sm font-medium text-slate-600 mb-1">First Name *</label>
                  <input {...register('patientFirstName')} type="text" placeholder="John"
                    className={`w-full px-4 py-2.5 border rounded-lg bg-slate-50 transition-colors
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                               ${errors.patientFirstName ? 'border-red-500 ring-red-500' : 'border-slate-300'}`} />
                  {errors.patientFirstName && <p className="text-red-500 text-xs mt-1.5">{errors.patientFirstName.message}</p>}
                </div>
                <div>
                  <label htmlFor="patientLastName" className="block text-sm font-medium text-slate-600 mb-1">Last Name *</label>
                  <input {...register('patientLastName')} type="text" placeholder="Doe"
                    className={`w-full px-4 py-2.5 border rounded-lg bg-slate-50 transition-colors
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                               ${errors.patientLastName ? 'border-red-500 ring-red-500' : 'border-slate-300'}`} />
                  {errors.patientLastName && <p className="text-red-500 text-xs mt-1.5">{errors.patientLastName.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="patientDateOfBirth" className="block text-sm font-medium text-slate-600 mb-1">Date of Birth *</label>
                    <InputGroup icon={<Calendar className="h-5 w-5 text-slate-400" />}>
                      <input {...register('patientDateOfBirth')} type="date"
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg bg-slate-50 transition-colors
                                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                  ${errors.patientDateOfBirth ? 'border-red-500 ring-red-500' : 'border-slate-300'}`} />
                    </InputGroup>
                    {errors.patientDateOfBirth && <p className="text-red-500 text-xs mt-1.5">{errors.patientDateOfBirth.message}</p>}
                </div>
                 <div>
                    <label htmlFor="patientPhone" className="block text-sm font-medium text-slate-600 mb-1">Phone Number *</label>
                    <InputGroup icon={<Phone className="h-5 w-5 text-slate-400" />}>
                      <input {...register('patientPhone')} type="tel" placeholder="(555) 123-4567"
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg bg-slate-50 transition-colors
                                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                  ${errors.patientPhone ? 'border-red-500 ring-red-500' : 'border-slate-300'}`} />
                    </InputGroup>
                    {errors.patientPhone && <p className="text-red-500 text-xs mt-1.5">{errors.patientPhone.message}</p>}
                </div>
              </div>
              <div>
                  <label htmlFor="patientEmail" className="block text-sm font-medium text-slate-600 mb-1">Email Address <span className="text-slate-400">(Optional)</span></label>
                  <InputGroup icon={<Mail className="h-5 w-5 text-slate-400" />}>
                    <input {...register('patientEmail')} type="email" placeholder="john.doe@example.com"
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg bg-slate-50 transition-colors
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                ${errors.patientEmail ? 'border-red-500 ring-red-500' : 'border-slate-300'}`} />
                  </InputGroup>
                  {errors.patientEmail && <p className="text-red-500 text-xs mt-1.5">{errors.patientEmail.message}</p>}
              </div>
            </div>

            {/* --- SECTION: Attorney Information --- */}
            <div className="space-y-6 pt-8 border-t border-slate-200">
              <h2 className="flex items-center gap-3 text-xl font-semibold text-slate-700">
                <Briefcase className="h-6 w-6 text-blue-600" />
                Referring Attorney Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="lawFirmName" className="block text-sm font-medium text-slate-600 mb-1">Law Firm Name *</label>
                   <InputGroup icon={<Building className="h-5 w-5 text-slate-400" />}>
                      <input {...register('lawFirmName')} type="text" placeholder="Justice & Associates"
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg bg-slate-50 transition-colors
                                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                  ${errors.lawFirmName ? 'border-red-500 ring-red-500' : 'border-slate-300'}`} />
                  </InputGroup>
                  {errors.lawFirmName && <p className="text-red-500 text-xs mt-1.5">{errors.lawFirmName.message}</p>}
                </div>
                 <div>
                  <label htmlFor="attorneyName" className="block text-sm font-medium text-slate-600 mb-1">Attorney / Case Manager *</label>
                   <InputGroup icon={<User className="h-5 w-5 text-slate-400" />}>
                      <input {...register('attorneyName')} type="text" placeholder="Jane Smith"
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg bg-slate-50 transition-colors
                                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                  ${errors.attorneyName ? 'border-red-500 ring-red-500' : 'border-slate-300'}`} />
                  </InputGroup>
                  {errors.attorneyName && <p className="text-red-500 text-xs mt-1.5">{errors.attorneyName.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="attorneyEmail" className="block text-sm font-medium text-slate-600 mb-1">Attorney Email *</label>
                  <InputGroup icon={<Mail className="h-5 w-5 text-slate-400" />}>
                    <input {...register('attorneyEmail')} type="email" placeholder="jane.smith@justice.com"
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg bg-slate-50 transition-colors
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                ${errors.attorneyEmail ? 'border-red-500 ring-red-500' : 'border-slate-300'}`} />
                  </InputGroup>
                  {errors.attorneyEmail && <p className="text-red-500 text-xs mt-1.5">{errors.attorneyEmail.message}</p>}
                </div>
                <div>
                  <label htmlFor="attorneyPhone" className="block text-sm font-medium text-slate-600 mb-1">Attorney Phone *</label>
                  <InputGroup icon={<Phone className="h-5 w-5 text-slate-400" />}>
                    <input {...register('attorneyPhone')} type="tel" placeholder="(555) 987-6543"
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg bg-slate-50 transition-colors
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                ${errors.attorneyPhone ? 'border-red-500 ring-red-500' : 'border-slate-300'}`} />
                  </InputGroup>
                  {errors.attorneyPhone && <p className="text-red-500 text-xs mt-1.5">{errors.attorneyPhone.message}</p>}
                </div>
              </div>
            </div>

            {/* --- SECTION: Referral Details --- */}
            <div className="space-y-6 pt-8 border-t border-slate-200">
               <h2 className="flex items-center gap-3 text-xl font-semibold text-slate-700">
                  <Stethoscope className="h-6 w-6 text-blue-600" />
                  Referral Details
              </h2>
              <div>
                <label htmlFor="primaryComplaint" className="block text-sm font-medium text-slate-600 mb-1">Primary Complaint / Reason for Referral *</label>
                <textarea {...register('primaryComplaint')} rows={4}
                  placeholder="e.g., 'Patient involved in a motor vehicle accident, experiencing neck and back pain.'"
                  className={`w-full px-4 py-2.5 border rounded-lg bg-slate-50 transition-colors resize-none
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                            ${errors.primaryComplaint ? 'border-red-500 ring-red-500' : 'border-slate-300'}`} />
                <div className="flex justify-between items-center mt-1.5">
                  {errors.primaryComplaint ? <p className="text-red-500 text-xs">{errors.primaryComplaint.message}</p> : <span></span>}
                  <p className="text-slate-400 text-xs font-medium">{complaintLength}/500</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="preferredLocation" className="block text-sm font-medium text-slate-600 mb-1">Preferred Clinic Location *</label>
                    <InputGroup icon={<MapPin className="h-5 w-5 text-slate-400" />}>
                        <select {...register('preferredLocation')}
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg bg-slate-50 appearance-none
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                    ${errors.preferredLocation ? 'border-red-500 ring-red-500' : 'border-slate-300'}`}>
                          <option value="">Select a location</option>
                          {CLINIC_LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                        </select>
                    </InputGroup>
                    {errors.preferredLocation && <p className="text-red-500 text-xs mt-1.5">{errors.preferredLocation.message}</p>}
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Preferred Appointment Type *</label>
                    {/* --- UPDATED: Custom styled radio buttons --- */}
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500 has-[:checked]:text-blue-900 transition-all">
                        <input {...register('appointmentType')} type="radio" value="in-person" className="h-4 w-4 accent-blue-600" />
                        In-Person
                      </label>
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500 has-[:checked]:text-blue-900 transition-all">
                        <input {...register('appointmentType')} type="radio" value="telemedicine" className="h-4 w-4 accent-blue-600" />
                        Telemedicine
                      </label>
                    </div>
                     {errors.appointmentType && <p className="text-red-500 text-xs mt-1.5">{errors.appointmentType.message}</p>}
                </div>
              </div>
            </div>

            {/* --- UPDATED: Actions with better styling and loading indicator --- */}
            <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-4">
              <button type="submit" disabled={isSubmitting}
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg
                          hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                          disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Referral'
                )}
              </button>
              <button type="button" onClick={() => reset()} disabled={isSubmitting}
                className="w-full sm:w-auto bg-slate-100 text-slate-700 font-medium py-3 px-6 rounded-lg
                           hover:bg-slate-200 disabled:opacity-50 transition-colors">
                Clear Form
              </button>
            </div>
             <p className="text-xs text-slate-500 text-center">
                Information provided is confidential and used solely for referral processing.
             </p>
          </form>
        </div>
      </div>
    </div>
  );
}