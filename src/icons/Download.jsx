export const Download = ({
    fill = 'currentColor',
    filled,
    size,
    height,
    width,
    label,
    ...props
  }) => {
    return (
    <svg  
        width={size || width || 24}
        height={size || height || 24}
        viewBox="0 0 24 24" 
        strokeWidth="2" 
        stroke="currentColor"
        fill="none"
        {...props}
    >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" /><path d="M7 11l5 5l5 -5" /><path d="M12 4l0 12" />
    </svg> 
    );
  };


