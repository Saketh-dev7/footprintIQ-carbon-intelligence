"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Navigation } from '@/components/Navigation';
import { AssessmentState, AssessmentSchema } from '@/types';
import { calculateTotalFootprint } from '@/lib/carbon-calculator';
import { ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFootprint } from '@/hooks/use-footprint';

const steps = [
  { id: 'transport', title: 'Transportation', description: 'Your daily and long-distance travel.' },
  { id: 'food', title: 'Diet & Nutrition', description: 'Food production impact.' },
  { id: 'energy', title: 'Housing Energy', description: 'Utilities and power usage.' },
  { id: 'shopping', title: 'Consumption', description: 'Retail and online shopping.' },
  { id: 'waste', title: 'Waste', description: 'Recycling and trash management.' },
];

export default function AssessmentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { saveData } = useFootprint();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<AssessmentState>({
    vehicleType: 'gas',
    dailyCommute: 20,
    flightsPerYear: 2,
    dietType: 'omnivore',
    monthlyElectricity: 250,
    hasAC: true,
    renewableEnergy: 0,
    onlinePurchasesPerMonth: 5,
    clothingItemsPerYear: 12,
    recyclingFrequency: 'sometimes',
  });

  const validateCurrentStep = (): boolean => {
    const stepId = steps[currentStep].id;
    switch (stepId) {
      case 'transport':
        return AssessmentSchema.pick({ vehicleType: true, dailyCommute: true, flightsPerYear: true }).safeParse(formData).success;
      case 'food':
        return AssessmentSchema.pick({ dietType: true }).safeParse(formData).success;
      case 'energy':
        return AssessmentSchema.pick({ monthlyElectricity: true, hasAC: true, renewableEnergy: true }).safeParse(formData).success;
      case 'shopping':
        return AssessmentSchema.pick({ onlinePurchasesPerMonth: true, clothingItemsPerYear: true }).safeParse(formData).success;
      case 'waste':
        return AssessmentSchema.pick({ recyclingFrequency: true }).safeParse(formData).success;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      toast({
        variant: "destructive",
        title: "Check Your Inputs",
        description: "One or more values for this step are out of the expected range."
      });
      return;
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finish();
    }
  };

  const finish = () => {
    const result = AssessmentSchema.safeParse(formData);
    if (!result.success) {
      toast({
        variant: "destructive",
        title: "Incomplete Data",
        description: "Please ensure all fields are filled correctly."
      });
      return;
    }
    const footprint = calculateTotalFootprint(formData);
    saveData(footprint, formData);
    router.push('/dashboard');
  };

  const progressValue = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background pb-32">
      <Navigation />
      <main className="container mx-auto px-6 pt-12 max-w-2xl" role="main">
        <header className="mb-12" aria-label="Assessment Progress">
          <div className="flex justify-between items-center mb-4 text-sm font-bold uppercase tracking-widest text-primary">
            <span id="step-counter">Step {currentStep + 1} / {steps.length}</span>
            <span className="text-muted-foreground">{steps[currentStep].title}</span>
          </div>
          <Progress 
            value={progressValue} 
            className="h-2" 
            aria-labelledby="step-counter" 
            aria-valuenow={progressValue} 
            aria-valuemin={0} 
            aria-valuemax={100}
          />
        </header>

        <Card className="glass border-white/10 shadow-2xl rounded-[2rem] overflow-hidden">
          <CardHeader className="p-10 pb-0">
            <CardTitle className="text-3xl font-headline font-bold">{steps[currentStep].title}</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              {steps[currentStep].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-10">
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500" key={currentStep}>
              {currentStep === 0 && (
                <>
                  <div className="space-y-4">
                    <Label className="text-lg" id="vehicle-type-label">Vehicle Type</Label>
                    <RadioGroup 
                      value={formData.vehicleType} 
                      onValueChange={(v: string) => setFormData({ ...formData, vehicleType: v as AssessmentState['vehicleType'] })}
                      className="grid grid-cols-2 gap-4"
                      aria-labelledby="vehicle-type-label"
                    >
                      {['gas', 'electric', 'hybrid', 'none'].map((type) => (
                        <div key={type} className="flex items-center space-x-3 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                          <RadioGroupItem value={type} id={`type-${type}`} />
                          <Label htmlFor={`type-${type}`} className="capitalize cursor-pointer flex-1">{type}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="commute" className="text-lg">Daily Commute (km)</Label>
                    <Input 
                      id="commute" 
                      type="number" 
                      min="0"
                      value={formData.dailyCommute} 
                      onChange={(e) => setFormData({...formData, dailyCommute: Number(e.target.value)})}
                      className="h-12 bg-white/5 border-white/10"
                      required
                    />
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="flights" className="text-lg">Annual Flights</Label>
                    <Input 
                      id="flights" 
                      type="number" 
                      min="0"
                      value={formData.flightsPerYear} 
                      onChange={(e) => setFormData({...formData, flightsPerYear: Number(e.target.value)})}
                      className="h-12 bg-white/5 border-white/10"
                      required
                    />
                  </div>
                </>
              )}

              {currentStep === 1 && (
                <div className="space-y-4">
                  <Label className="text-lg" id="diet-label">Dietary Habits</Label>
                  <RadioGroup 
                    value={formData.dietType} 
                    onValueChange={(v: string) => setFormData({ ...formData, dietType: v as AssessmentState['dietType'] })}
                    className="grid grid-cols-1 gap-4"
                    aria-labelledby="diet-label"
                  >
                    {[
                      { id: 'vegan', label: 'Vegan', desc: 'No animal products' },
                      { id: 'vegetarian', label: 'Vegetarian', desc: 'Meat-free, includes dairy/eggs' },
                      { id: 'omnivore', label: 'Omnivore', desc: 'Balanced diet with moderate meat' },
                      { id: 'heavy-meat', label: 'Meat-Heavy', desc: 'Meat consumed most meals' },
                    ].map((diet) => (
                      <div key={diet.id} className="flex items-center space-x-3 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                        <RadioGroupItem value={diet.id} id={`diet-${diet.id}`} />
                        <div className="flex flex-col cursor-pointer flex-1">
                          <Label htmlFor={`diet-${diet.id}`} className="font-bold">{diet.label}</Label>
                          <span className="text-sm text-muted-foreground">{diet.desc}</span>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {currentStep === 2 && (
                <>
                  <div className="space-y-4">
                    <Label htmlFor="electricity" className="text-lg">Monthly Electricity (kWh)</Label>
                    <Input 
                      id="electricity" 
                      type="number" 
                      min="0"
                      value={formData.monthlyElectricity} 
                      onChange={(e) => setFormData({...formData, monthlyElectricity: Number(e.target.value)})}
                      className="h-12 bg-white/5 border-white/10"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5">
                    <div className="space-y-1">
                      <Label htmlFor="has-ac" className="text-lg">High AC / Heating Usage</Label>
                      <p className="text-sm text-muted-foreground">Do you regulate temperature daily?</p>
                    </div>
                    <Switch 
                      id="has-ac"
                      checked={formData.hasAC} 
                      onCheckedChange={(v) => setFormData({...formData, hasAC: v})} 
                      aria-label="Toggle AC usage"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="renewable" className="text-lg">Renewable Energy Share</Label>
                      <span className="text-primary font-bold" aria-live="polite">{formData.renewableEnergy}%</span>
                    </div>
                    <Input 
                      id="renewable" 
                      type="range" min="0" max="100" step="5"
                      value={formData.renewableEnergy} 
                      onChange={(e) => setFormData({...formData, renewableEnergy: Number(e.target.value)})}
                      className="accent-primary"
                    />
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <div className="space-y-4">
                    <Label htmlFor="online" className="text-lg">Online Orders per Month</Label>
                    <Input 
                      id="online" 
                      type="number" 
                      min="0"
                      value={formData.onlinePurchasesPerMonth} 
                      onChange={(e) => setFormData({...formData, onlinePurchasesPerMonth: Number(e.target.value)})}
                      className="h-12 bg-white/5 border-white/10"
                      required
                    />
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="clothing" className="text-lg">New Apparel per Year</Label>
                    <Input 
                      id="clothing" 
                      type="number" 
                      min="0"
                      value={formData.clothingItemsPerYear} 
                      onChange={(e) => setFormData({...formData, clothingItemsPerYear: Number(e.target.value)})}
                      className="h-12 bg-white/5 border-white/10"
                      required
                    />
                  </div>
                </>
              )}

              {currentStep === 4 && (
                <div className="space-y-4">
                  <Label className="text-lg" id="recycling-label">Recycling Consistency</Label>
                  <RadioGroup 
                    value={formData.recyclingFrequency} 
                    onValueChange={(v: string) => setFormData({ ...formData, recyclingFrequency: v as AssessmentState['recyclingFrequency'] })}
                    className="grid grid-cols-1 gap-4"
                    aria-labelledby="recycling-label"
                  >
                    {[
                      { id: 'always', label: 'Strict Recycling', desc: 'Separating all recyclables' },
                      { id: 'sometimes', label: 'Moderate', desc: 'Recycling when convenient' },
                      { id: 'never', label: 'None', desc: 'All materials to general waste' },
                    ].map((freq) => (
                      <div key={freq.id} className="flex items-center space-x-3 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                        <RadioGroupItem value={freq.id} id={`freq-${freq.id}`} />
                        <div className="flex flex-col cursor-pointer flex-1">
                          <Label htmlFor={`freq-${freq.id}`} className="font-bold">{freq.label}</Label>
                          <span className="text-sm text-muted-foreground">{freq.desc}</span>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
            </div>

            <nav className="flex justify-between mt-12 gap-4" aria-label="Step Navigation">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(prev => prev - 1)} 
                disabled={currentStep === 0}
                className="flex-1 h-12 rounded-xl"
                aria-label="Previous step"
              >
                <ChevronLeft className="mr-2 w-4 h-4" aria-hidden="true" /> Back
              </Button>
              <Button 
                onClick={handleNext} 
                className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                aria-label={currentStep === steps.length - 1 ? 'Calculate result' : 'Next step'}
              >
                {currentStep === steps.length - 1 ? 'Calculate Footprint' : 'Next Step'} 
                {currentStep === steps.length - 1 ? <CheckCircle2 className="ml-2 w-4 h-4" aria-hidden="true" /> : <ChevronRight className="ml-2 w-4 h-4" aria-hidden="true" />}
              </Button>
            </nav>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
