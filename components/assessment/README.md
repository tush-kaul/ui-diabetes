# Modular Comprehensive Assessment Components

This directory contains the refactored modular version of the comprehensive assessment functionality, breaking down the original monolithic component into smaller, manageable pieces.

## Structure

### Core Files

- **`ComprehensiveAssessmentRefactored.tsx`** - Main component that orchestrates all assessments
- **`index.ts`** - Central export file for easy imports
- **`types.ts`** - Shared TypeScript interfaces and types
- **`utils.ts`** - Shared utility functions (color helpers, data storage)

### Individual Assessment Components

- **`RetinopathyAssessment.tsx`** - Eye/retina assessment with detailed examination forms
- **`NephrologyAssessment.tsx`** - Kidney assessment with trend analysis and management
- **`MentalHealthTracking.tsx`** - Mental health tracking with PHQ-9, GAD-7 scoring

### Hooks

- **`hooks/useDrawing.ts`** - Custom hook for canvas drawing functionality (for neuropathy diagrams)

## Key Features

### 🔧 **Improved Maintainability**
- Each assessment is now a separate component (~300-500 lines instead of 8400+)
- Easier to debug and test individual sections
- Clear separation of concerns

### 🚀 **Better Performance**
- Components can be lazy-loaded
- Smaller bundle sizes for individual features
- More efficient re-renders

### 🎨 **Enhanced Developer Experience**
- TypeScript interfaces clearly define data structures
- Reusable utility functions
- Consistent patterns across components

### 📊 **Data Management**
- Auto-save functionality for nephrology data (per V3 specs)
- LocalStorage integration with custom events
- State isolation between components

## Usage

### Basic Usage

```tsx
import { ComprehensiveAssessmentRefactored } from '@/components/assessment';

export default function MyPage() {
  const handleNavigate = (tab: string) => {
    console.log(`Navigate to ${tab}`);
  };

  return (
    <ComprehensiveAssessmentRefactored
      initialSubTab="complications"
      onNavigate={handleNavigate}
    />
  );
}
```

### Using Individual Components

```tsx
import { 
  RetinopathyAssessment, 
  NephrologyAssessment, 
  MentalHealthTracking 
} from '@/components/assessment';

export default function CustomAssessment() {
  return (
    <div>
      <RetinopathyAssessment />
      <NephrologyAssessment onNavigate={(tab) => console.log(tab)} />
      <MentalHealthTracking />
    </div>
  );
}
```

### Using Hooks

```tsx
import { useDrawing } from '@/components/assessment';

export default function CustomDrawingComponent() {
  const { canvasRefs, startDrawing, draw, stopDrawing, clearDrawing } = useDrawing();
  
  return (
    <canvas
      ref={(el) => { canvasRefs.current['myCanvas'] = el; }}
      onMouseDown={(e) => startDrawing(e, 'myCanvas')}
      onMouseMove={(e) => draw(e, 'myCanvas')}
      onMouseUp={stopDrawing}
    />
  );
}
```

## Migration Guide

To replace the original `comprehensive-assessment-functional.tsx`:

1. Import the new component:
   ```tsx
   import { ComprehensiveAssessmentRefactored } from '@/components/assessment';
   ```

2. Replace the old component with the new one:
   ```tsx
   // Old
   <ComprehensiveAssessmentFunctional 
     initialSubTab={subTab} 
     onNavigate={handleNavigate} 
   />
   
   // New
   <ComprehensiveAssessmentRefactored 
     initialSubTab={subTab} 
     onNavigate={handleNavigate} 
   />
   ```

3. Remove or archive the old file after testing.

## Benefits of This Refactoring

1. **Reduced Complexity**: Each component focuses on a single assessment type
2. **Improved Testability**: Easier to write unit tests for individual components
3. **Better Code Reusability**: Components can be used independently
4. **Enhanced Performance**: Lazy loading and tree shaking opportunities
5. **Easier Maintenance**: Changes to one assessment don't affect others
6. **Better Developer Experience**: Smaller files, clearer structure
7. **Type Safety**: Comprehensive TypeScript interfaces

## Future Extensions

This modular structure makes it easy to:
- Add new assessment types
- Extend existing assessments with new features  
- Create specialized views for different user roles
- Implement assessment-specific optimizations
- Add assessment-specific data validation

## Dependencies

The components use the same UI library components as the original:
- `@/components/ui/*` (shadcn/ui components)
- `lucide-react` for icons
- `recharts` for data visualization