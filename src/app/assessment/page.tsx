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
import { AssessmentState } from '@/types';
import { calculateTotalFootprint } from '@/lib/carbon-calculator';
import { ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';

const steps = [
  { id: 'transport', title: 'Transportation', description: 'How do you get around?' },
  { id: 'food', title: 'Food & Diet', description: 'What fuels your lifestyle?' },
  { id: 'energy', title: 'Home Energy', description: 'Powering your living space.' },
  { id: 'shopping', title: 'Shopping', description: 'Your consumption habits.' },
  { id: 'waste', title: 'Waste Management', description: 'How do you handle trash?' },
];

export default function AssessmentPage() {
  const router = useRouter();
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

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finish();
    }
  };

  const back = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const finish = () => {
    const footprint = calculateTotalFootprint(formData);
    localStorage.setItem('footprint_iq_data', JSON.stringify(footprint));
    localStorage.setItem('footprint_iq_assessment', JSON.stringify(formData));
    router.push('/dashboard');
  };

  const progressValue = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background pb-32">
      <Navigation />
      <div className="container mx-auto px-6 pt-12 max-w-2xl">
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <span className="text-primary font-medium">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-muted-foreground font-medium">{steps[currentStep].title}</span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>

        <Card className="glass border-white/10 shadow-2xl rounded-[2rem] overflow-hidden">
          <CardHeader className="p-10 pb-0">
            <CardTitle className="text-3xl font-headline font-bold">{steps[currentStep].title}</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              {steps[currentStep].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-10">
            {currentStep === 0 && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <Label className="text-lg">Vehicle Type</Label>
                  <RadioGroup 
                    value={formData.vehicleType} 
                    onValueChange={(v: any) => setFormData({ ...formData, vehicleType: v })}
                    className="grid grid-cols-2 gap-4"
                  >
                    {['gas', 'electric', 'hybrid', 'none'].map((type) => (
                      <div key={type} className="flex items-center space-x-3 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                        <RadioGroupItem value={type} id={type} />
                        <Label htmlFor={type} className="capitalize">{type}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div className="space-y-4">
                  <Label htmlFor="commute" className="text-lg">Daily Commute (km)</Label>
                  <Input 
                    id="commute" 
                    type="number" 
                    value={formData.dailyCommute} 
                    onChange={(e) => setFormData({...formData, dailyCommute: Number(e.target.value)})}
                    className="h-12 bg-white/5 border-white/10"
                  />
                </div>
                <div className="space-y-4">
                  <Label htmlFor="flights" className="text-lg">Flights per Year</Label>
                  <Input 
                    id="flights" 
                    type="number" 
                    value={formData.flightsPerYear} 
                    onChange={(e) => setFormData({...formData, flightsPerYear: Number(e.target.value)})}
                    className="h-12 bg-white/5 border-white/10"
                  />
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <Label className="text-lg">Dietary Habits</Label>
                  <RadioGroup 
                    value={formData.dietType} 
                    onValueChange={(v: any) => setFormData({ ...formData, dietType: v })}
                    className="grid grid-cols-1 gap-4"
                  >
                    {[
                      { id: 'vegan', label: 'Vegan', desc: 'No animal products' },
                      { id: 'vegetarian', label: 'Vegetarian', desc: 'No meat, but dairy/eggs' },
                      { id: 'omnivore', label: 'Omnivore', desc: 'Balanced diet with meat' },
                      { id: 'heavy-meat', label: 'Heavy Meat', desc: 'Meat in most meals' },
                    ].map((diet) => (
                      <div key={diet.id} className="flex items-center space-x-3 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                        <RadioGroupItem value={diet.id} id={diet.id} />
                        <div className="flex flex-col">
                          <Label htmlFor={diet.id} className="font-bold">{diet.label}</Label>
                          <span className="text-sm text-muted-foreground">{diet.desc}</span>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <Label htmlFor="electricity" className="text-lg">Avg. Monthly Electricity (kWh)</Label>
                  <Input 
                    id="electricity" 
                    type="number" 
                    value={formData.monthlyElectricity} 
                    onChange={(e) => setFormData({...formData, monthlyElectricity: Number(e.target.value)})}
                    className="h-12 bg-white/5 border-white/10"
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5">
                  <div className="space-y-1">
                    <Label className="text-lg">Heavy AC Usage</Label>
                    <p className="text-sm text-muted-foreground">Do you run air conditioning daily?</p>
                  </div>
                  <Switch checked={formData.hasAC} onCheckedChange={(v) => setFormData({...formData, hasAC: v})} />
                </div>
                <div className="space-y-4">
                  <Label htmlFor="renewable" className="text-lg">Renewable Energy Share ({formData.renewableEnergy}%)</Label>
                  <Input 
                    id="renewable" 
                    type="range" min="0" max="100" 
                    value={formData.renewableEnergy} 
                    onChange={(e) => setFormData({...formData, renewableEnergy: Number(e.target.value)})}
                    className="accent-primary"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <Label htmlFor="online" className="text-lg">Monthly Online Deliveries</Label>
                  <Input 
                    id="online" 
                    type="number" 
                    value={formData.onlinePurchasesPerMonth} 
                    onChange={(e) => setFormData({...formData, onlinePurchasesPerMonth: Number(e.target.value)})}
                    className="h-12 bg-white/5 border-white/10"
                  />
                </div>
                <div className="space-y-4">
                  <Label htmlFor="clothing" className="text-lg">New Clothing Items per Year</Label>
                  <Input 
                    id="clothing" 
                    type="number" 
                    value={formData.clothingItemsPerYear} 
                    onChange={(e) => setFormData({...formData, clothingItemsPerYear: Number(e.target.value)})}
                    className="h-12 bg-white/5 border-white/10"
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <Label className="text-lg">Recycling Habits</Label>
                  <RadioGroup 
                    value={formData.recyclingFrequency} 
                    onValueChange={(v: any) => setFormData({ ...formData, recyclingFrequency: v })}
                    className="grid grid-cols-1 gap-4"
                  >
                    {[
                      { id: 'always', label: 'Always', desc: 'Strict separation of all materials' },
                      { id: 'sometimes', label: 'Sometimes', desc: 'When convenient' },
                      { id: 'never', label: 'Never', desc: 'Everything goes into general waste' },
                    ].map((freq) => (
                      <div key={freq.id} className="flex items-center space-x-3 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                        <RadioGroupItem value={freq.id} id={freq.id} />
                        <div className="flex flex-col">
                          <Label htmlFor={freq.id} className="font-bold">{freq.label}</Label>
                          <span className="text-sm text-muted-foreground">{freq.desc}</span>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-12 gap-4">
              <Button 
                variant="outline" 
                onClick={back} 
                disabled={currentStep === 0}
                className="flex-1 h-12 rounded-xl"
              >
                <ChevronLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button 
                onClick={next} 
                className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90"
              >
                {currentStep === steps.length - 1 ? 'Calculate Footprint' : 'Next Step'} 
                {currentStep === steps.length - 1 ? <CheckCircle2 className="ml-2 w-4 h-4" /> : <ChevronRight className="ml-2 w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}