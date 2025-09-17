import * as React from 'react';

import {
  Sheet as SheetPrimitive,
  SheetTrigger as SheetTriggerPrimitive,
  SheetOverlay as SheetOverlayPrimitive,
  SheetClose as SheetClosePrimitive,
  SheetPortal as SheetPortalPrimitive,
  SheetContent as SheetContentPrimitive,
  SheetHeader as SheetHeaderPrimitive,
  SheetFooter as SheetFooterPrimitive,
  SheetTitle as SheetTitlePrimitive,
  SheetDescription as SheetDescriptionPrimitive,
  type SheetProps as SheetPrimitiveProps,
  type SheetTriggerProps as SheetTriggerPrimitiveProps,
  type SheetOverlayProps as SheetOverlayPrimitiveProps,
  type SheetCloseProps as SheetClosePrimitiveProps,
  type SheetContentProps as SheetContentPrimitiveProps,
  type SheetHeaderProps as SheetHeaderPrimitiveProps,
  type SheetFooterProps as SheetFooterPrimitiveProps,
  type SheetTitleProps as SheetTitlePrimitiveProps,
  type SheetDescriptionProps as SheetDescriptionPrimitiveProps,
} from '@/components/animate-ui/primitives/radix/sheet';
import { cn } from '@/lib/utils';
import { XIcon, User, Phone, Mail, MessageSquare, Send } from 'lucide-react';
import { motion } from 'framer-motion';

type SheetProps = SheetPrimitiveProps;

function Sheet(props: SheetProps) {
  return <SheetPrimitive {...props} />;
}

type SheetTriggerProps = SheetTriggerPrimitiveProps;

function SheetTrigger(props: SheetTriggerProps) {
  return <SheetTriggerPrimitive {...props} />;
}

type SheetOverlayProps = SheetOverlayPrimitiveProps;

function SheetOverlay({ className, ...props }: SheetOverlayProps) {
  return (
    <SheetOverlayPrimitive
      className={cn('fixed inset-0 z-50 bg-black/80 backdrop-blur-sm', className)}
      {...props}
    />
  );
}

type SheetCloseProps = SheetClosePrimitiveProps;

function SheetClose(props: SheetCloseProps) {
  return <SheetClosePrimitive {...props} />;
}

type SheetContentProps = SheetContentPrimitiveProps & {
  showCloseButton?: boolean;
};

function SheetContent({
  className,
  children,
  side = 'right',
  showCloseButton = true,
  ...props
}: SheetContentProps) {
  return (
    <SheetPortalPrimitive>
      <SheetOverlay />
      <SheetContentPrimitive
        className={cn(
          'bg-gray-900 fixed z-50 flex flex-col border-gray-800 shadow-xl',
          side === 'right' && 'h-full w-[380px] border-l',
          side === 'left' && 'h-full w-[380px] border-r',
          side === 'top' && 'w-full h-[400px] border-b',
          side === 'bottom' && 'w-full h-[400px] border-t',
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetClose className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
            <XIcon className="size-5 text-gray-400 hover:text-white transition-colors" />
            <span className="sr-only">Close</span>
          </SheetClose>
        )}
      </SheetContentPrimitive>
    </SheetPortalPrimitive>
  );
}

type SheetHeaderProps = SheetHeaderPrimitiveProps;

function SheetHeader({ className, ...props }: SheetHeaderProps) {
  return (
    <SheetHeaderPrimitive
      className={cn('flex flex-col gap-2 p-6 border-b border-gray-800', className)}
      {...props}
    />
  );
}

type SheetFooterProps = SheetFooterPrimitiveProps;

function SheetFooter({ className, ...props }: SheetFooterProps) {
  return (
    <SheetFooterPrimitive
      className={cn('mt-auto flex flex-col gap-2 p-6 border-t border-gray-800', className)}
      {...props}
    />
  );
}

type SheetTitleProps = SheetTitlePrimitiveProps;

function SheetTitle({ className, ...props }: SheetTitleProps) {
  return (
    <SheetTitlePrimitive
      className={cn('text-2xl font-bold text-white', className)}
      {...props}
    />
  );
}

type SheetDescriptionProps = SheetDescriptionPrimitiveProps;

function SheetDescription({ className, ...props }: SheetDescriptionProps) {
  return (
    <SheetDescriptionPrimitive
      className={cn('text-gray-400 text-sm', className)}
      {...props}
    />
  );
}

// Form components for the sheet
interface FormFieldProps {
  label: string;
  icon: React.ReactNode;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

function FormField({ label, icon, type = "text", placeholder, required = false }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
        {icon}
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 
                 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
      />
    </div>
  );
}

function ContactForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Message sent successfully!');
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <FormField 
        label="Full Name" 
        icon={<User className="h-4 w-4" />} 
        placeholder="Enter your full name" 
        required 
      />
      
      <FormField 
        label="Phone Number" 
        icon={<Phone className="h-4 w-4" />} 
        type="tel" 
        placeholder="Enter your phone number" 
        required 
      />
      
      <FormField 
        label="Email" 
        icon={<Mail className="h-4 w-4" />} 
        type="email" 
        placeholder="Enter your email" 
        required 
      />
      
      <FormField 
        label="Subject" 
        icon={<MessageSquare className="h-4 w-4" />} 
        placeholder="What is this regarding?" 
        required 
      />
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Message
          <span className="text-red-400">*</span>
        </label>
        <textarea
          placeholder="Type your message here..."
          required
          rows={4}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 
                   focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all resize-none"
        />
      </div>
      
      <motion.button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg
                 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
            Sending...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Message
          </>
        )}
      </motion.button>
    </form>
  );
}

// Enhanced Sheet with form
function ContactSheet({ side = 'right', ...props }: SheetContentProps) {
  return (
    <SheetContent side={side} {...props}>
      <SheetHeader>
        <SheetTitle>Get In Touch</SheetTitle>
        <SheetDescription>
          Fill out the form and we'll get back to you as soon as possible.
        </SheetDescription>
      </SheetHeader>
      
      <ContactForm />
      
      <SheetFooter>
        <div className="text-xs text-gray-500 text-center">
          By submitting this form, you agree to our privacy policy.
        </div>
      </SheetFooter>
    </SheetContent>
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  ContactSheet,
  ContactForm,
  type SheetProps,
  type SheetTriggerProps,
  type SheetCloseProps,
  type SheetContentProps,
  type SheetHeaderProps,
  type SheetFooterProps,
  type SheetTitleProps,
  type SheetDescriptionProps,
};