'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { CheckCircleIcon, StarIcon } from 'lucide-react';
import Link from 'next/link';
import { motion, Transition } from 'framer-motion';

type FREQUENCY = 'monthly' | 'yearly';
const frequencies: FREQUENCY[] = ['monthly', 'yearly'];

interface Plan {
  id: string;
  name: string;
  info: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: {
    text: string;
    tooltip?: string;
  }[];
  btn: {
    text: string;
    href: string;
  };
  highlighted?: boolean;
}

interface PricingSectionProps extends React.ComponentProps<'div'> {
  plans: Plan[];
  heading: string;
  description?: string;
}

export function PricingSection({
  plans,
  heading,
  description,
  ...props
}: PricingSectionProps) {
  const [frequency, setFrequency] = React.useState<'monthly' | 'yearly'>(
    'monthly'
  );

  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-center space-y-10 p-6',
        props.className
      )}
      {...props}
    >
      <div className="mx-auto max-w-2xl space-y-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
          {heading}
        </h2>
        {description && (
          <p className="text-zinc-400 text-sm md:text-base px-4">
            {description}
          </p>
        )}
      </div>
      
      <PricingFrequencyToggle
        frequency={frequency}
        setFrequency={setFrequency}
      />
      
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 items-start relative z-10">
        {plans.map((plan) => (
          <PricingCard plan={plan} key={plan.name} frequency={frequency} />
        ))}
      </div>
    </div>
  );
}

type PricingFrequencyToggleProps = React.ComponentProps<'div'> & {
  frequency: FREQUENCY;
  setFrequency: React.Dispatch<React.SetStateAction<FREQUENCY>>;
};

export function PricingFrequencyToggle({
  frequency,
  setFrequency,
  ...props
}: PricingFrequencyToggleProps) {
  return (
    <div
      className={cn(
        'bg-[#0a0a0a] border border-white/10 mx-auto flex w-fit rounded-full p-1 relative z-20 shadow-xl',
        props.className
      )}
      {...props}
    >
      {frequencies.map((freq) => (
        <button
          key={freq}
          onClick={() => setFrequency(freq)}
          className="relative px-6 py-2 text-sm uppercase tracking-wider font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          <span className="relative z-10">{freq}</span>
          {frequency === freq && (
            <motion.span
              layoutId="frequency_pill"
              transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
              className="bg-primary/20 absolute inset-0 z-0 rounded-full border border-primary/30"
            />
          )}
          {/* Active text effect overlay */}
          {frequency === freq && (
             <span className="absolute inset-0 z-10 flex items-center justify-center text-primary uppercase tracking-wider font-bold">
               {freq}
             </span>
          )}
        </button>
      ))}
    </div>
  );
}

type PricingCardProps = React.ComponentProps<'div'> & {
  plan: Plan;
  frequency?: FREQUENCY;
};

export function PricingCard({
  plan,
  className,
  frequency = frequencies[0],
  ...props
}: PricingCardProps) {
  return (
    <div
      key={plan.name}
      className={cn(
        'relative flex w-full flex-col rounded-xl border bg-[#080808]',
        plan.highlighted ? "border-primary/50 shadow-[0_0_30px_rgba(0,243,141,0.1)]" : "border-white/10 hover:border-white/20",
        "transition-colors duration-300",
        className
      )}
      {...props}
    >
      {plan.highlighted && (
        <BorderTrail
          style={{
            boxShadow:
              '0px 0px 60px 30px rgba(0,243,141,0.2), 0 0 100px 60px rgba(0,243,141,0.2), 0 0 140px 90px rgba(0,243,141,0.2)',
          }}
          size={120}
          className="bg-primary"
        />
      )}
      <div
        className={cn(
          'rounded-t-xl border-b border-white/5 p-6 md:p-8 relative overflow-hidden',
          plan.highlighted ? 'bg-[#0a0a0a]' : 'bg-[#050505]'
        )}
      >
        {/* Subtle background glow for highlighted card */}
        {plan.highlighted && <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none"></div>}

        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {plan.highlighted && (
            <p className="bg-primary/10 text-primary border border-primary/20 flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wider">
              <StarIcon className="h-3 w-3 fill-current" />
              Popular
            </p>
          )}
          {frequency === 'yearly' && plan.price.monthly > 0 && (
            <p className="bg-white/10 text-white border border-white/20 flex items-center gap-1 rounded-md px-2 py-1 text-[10px] uppercase font-bold">
              Save {Math.round(
                ((plan.price.monthly * 12 - plan.price.yearly) /
                  (plan.price.monthly * 12)) *
                  100
              )}
              %
            </p>
          )}
        </div>

        <div className="text-xl font-bold text-white mb-2 relative z-10">{plan.name}</div>
        <p className="text-zinc-500 text-sm font-medium relative z-10">{plan.info}</p>
        <h3 className="mt-6 flex items-end gap-1 relative z-10">
          <span className="text-4xl md:text-5xl font-black text-white">₱{plan.price[frequency].toLocaleString()}</span>
          <span className="text-zinc-500 font-medium mb-1 ml-1">
            {plan.name !== 'Core'
              ? '/' + (frequency === 'monthly' ? 'mo' : 'yr')
              : ''}
          </span>
        </h3>
      </div>
      <div
        className={cn(
          'space-y-4 px-6 py-8 text-sm',
          plan.highlighted ? 'bg-[#050505]' : 'bg-[#070707]'
        )}
      >
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <CheckCircleIcon className="text-primary h-4 w-4 shrink-0 mt-0.5" />
            <TooltipProvider delay={0}>
              <Tooltip>
                <TooltipTrigger render={
                  <p
                    className={cn(
                      "text-zinc-300 leading-snug",
                      feature.tooltip &&
                        'cursor-help border-b border-dashed border-zinc-600 hover:border-primary transition-colors hover:text-white'
                    )}
                  >
                    {feature.text}
                  </p>
                } />
                {feature.tooltip && (
                  <TooltipContent side="top" className="max-w-[200px] text-center">
                    <p>{feature.tooltip}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </div>
      <div
        className={cn(
          'mt-auto w-full border-t border-white/5 p-6',
          plan.highlighted ? 'bg-[#0a0a0a] rounded-b-xl' : 'bg-[#050505] rounded-b-xl'
        )}
      >
        <Button
          className={cn(
            "w-full h-12 uppercase tracking-widest text-xs font-bold transition-all",
            plan.highlighted 
              ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(0,243,141,0.2)]" 
              : "bg-white/5 border border-white/10 hover:bg-white/10 text-white"
          )}
          render={<Link href={plan.btn.href} />}
          // @ts-ignore - nativeButton is a valid prop for Base UI but may not be exposed by the wrapper
          nativeButton={false}
        >
          {plan.btn.text}
        </Button>
      </div>
    </div>
  );
}

type BorderTrailProps = {
  className?: string;
  size?: number;
  transition?: Transition;
  delay?: number;
  onAnimationComplete?: () => void;
  style?: React.CSSProperties;
};

export function BorderTrail({
  className,
  size = 60,
  transition,
  delay,
  onAnimationComplete,
  style,
}: BorderTrailProps) {
  const BASE_TRANSITION = {
    repeat: Infinity,
    duration: 5,
    ease: 'linear',
  };

  return (
    <div className='pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]'>
      <motion.div
        className={cn('absolute aspect-square', className)}
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          ...style,
        }}
        animate={{
          offsetDistance: ['0%', '100%'],
        }}
        transition={{
          ...(transition ?? BASE_TRANSITION),
          delay: delay,
        }}
        onAnimationComplete={onAnimationComplete}
      />
    </div>
  );
}
