// Room
type Room = {
  id: number;
  floor: number;
  room_number: number;
  availability: "available" | "occupied";
  type: "premium" | "normal";
  breakfast: boolean;
  image: string;
};

// Filter option
type FilterOption = {
  label: string;
  value: string;
};

// Filter component
type FilterProps = {
  id: string;
  name: string;
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export type { Room, FilterOption, FilterProps };

// Input types
interface InputProps {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
}

export type { InputProps };
