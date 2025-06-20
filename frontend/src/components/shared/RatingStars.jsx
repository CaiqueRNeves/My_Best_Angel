import { useState } from 'react';

const RatingStars = ({ 
  value = 0, 
  onChange, 
  size = 'md', 
  readOnly = false,
  count = 5
}) => {
  const [hoverValue, setHoverValue] = useState(0);
  
  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'fa-sm';
      case 'lg': return 'fa-lg';
      case 'xl': return 'fa-2x';
      case 'md':
      default: return '';
    }
  };
  
  const handleMouseOver = (index) => {
    if (readOnly) return;
    setHoverValue(index);
  };
  
  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverValue(0);
  };
  
  const handleClick = (index) => {
    if (readOnly) return;
    onChange(index);
  };
  
  const renderStar = (index) => {
    const filled = (hoverValue || value) >= index;
    
    return (
      <span
        key={index}
        className={`star ${readOnly ? 'read-only' : 'clickable'} ${filled ? 'filled' : 'empty'}`}
        onMouseOver={() => handleMouseOver(index)}
        onClick={() => handleClick(index)}
      >
        <i className={`${filled ? 'fas' : 'far'} fa-star ${getIconSize()}`}></i>
      </span>
    );
  };
  
  return (
    <div 
      className="rating-stars"
      onMouseLeave={handleMouseLeave}
    >
      {[...Array(count)].map((_, i) => renderStar(i + 1))}
      
      <style jsx>{`
        .rating-stars {
          display: inline-flex;
          direction: ltr;
        }
        
        .star {
          margin: 0 2px;
          color: #ffc107;
        }
        
        .star.clickable {
          cursor: pointer;
        }
        
        .star.filled {
          color: #ffc107;
        }
        
        .star.empty {
          color: #e4e5e9;
        }
        
        .star.read-only {
          cursor: default;
        }
      `}</style>
    </div>
  );
};

export default RatingStars;