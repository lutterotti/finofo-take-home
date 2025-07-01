import { SegmentGroup } from "@chakra-ui/react"

interface ToggleViewProps {
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
  }>;
  size?: "xs" | "sm" | "md" | "lg";
}

export const ToggleView = ({ value, onValueChange, options, size = "sm" }: ToggleViewProps) => {
  return (
    <SegmentGroup.Root 
      size={size} 
      value={value}
      onValueChange={(details) => {
        if (details.value) {
          onValueChange(details.value);
        }
      }}
    >
      <SegmentGroup.Indicator />
      <SegmentGroup.Items 
        items={options.map(option => ({
          value: option.value,
          label: option.label
        }))} 
      />
    </SegmentGroup.Root>
  )
}