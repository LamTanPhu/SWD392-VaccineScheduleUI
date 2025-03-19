import { useEffect, useRef, useState } from "react";

const CustomSelect = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredGroup, setHoveredGroup] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setHoveredGroup(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange({ target: { name: 'relationship', value: optionValue } });
    setIsOpen(false);
    setHoveredGroup(null);
  };

  const getCurrentOptionName = () => {
    for (const option of options) {
      if (option.id === value) return option.name;
      if (option.children) {
        const child = option.children.find(c => c.id === value);
        if (child) return child.name;
      }
    }
    return '';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="border border-gray px-5 py-2 rounded-lg cursor-pointer bg-white flex justify-between items-center hover:border-primary transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? 'text-black' : 'text-gray-400'}>
          {value ? getCurrentOptionName() : placeholder}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-10 min-w-[200px] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          {options.map((option) => (
            <div 
              key={option.id}
              onMouseEnter={() => option.children && setHoveredGroup(option.id)}
              onMouseLeave={() => setHoveredGroup(null)}
              className="relative"
            >
              <div
                className={`px-4 py-2 cursor-pointer transition-colors
                  ${option.children ? 'font-medium text-primary' : 'hover:bg-gray-100'}
                  ${!option.children && value === option.id ? 'bg-gray-100' : ''}
                `}
                onClick={() => !option.children && handleSelect(option.id)}
              >
                {option.name}
              </div>

              {option.children && hoveredGroup === option.id && (
                <div className="absolute left-full top-0 ml-1 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[200px]">
                  {option.children.map((child) => (
                    <div
                      key={child.id}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors
                        ${value === child.id ? 'bg-gray-100' : ''}
                      `}
                      onClick={() => handleSelect(child.id)}
                    >
                      {child.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;