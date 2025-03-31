export const getRgbaColor = (hexColor: string, opacity: number) => {
  if (hexColor.startsWith("rgba")) {
    const values = hexColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*(?:\.\d+)?)\)/);
    if (values) {
      return `rgba(${values[1]}, ${values[2]}, ${values[3]}, ${opacity})`;
    }
  }
  
  if (hexColor.startsWith("rgb")) {
    const values = hexColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (values) {
      return `rgba(${values[1]}, ${values[2]}, ${values[3]}, ${opacity})`;
    }
  }
  
  let hex = hexColor.replace('#', '');
  
  if (hex.length === 3) {
    hex = hex.split('').map(x => x + x).join('');
  }
  
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};