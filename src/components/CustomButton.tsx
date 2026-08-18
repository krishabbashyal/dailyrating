interface CustomButtonProps {   
  label: string   
  customClasses?: string
  onClick?: () => void   
  iconSide?: 'left' | 'right'
  textClasses?: string
  isSubmitting?: boolean
  submittingText?: string
}  

const CustomButton = ({ 
  label, 
  customClasses,
  textClasses,
  iconSide = 'left',
  onClick, 
  isSubmitting = false,
  submittingText 
}: CustomButtonProps) => {   
  return (     
    <button 
    className={`
      h-10 px-4 rounded-lg
      text-white 
      cursor-pointer
      transition-all duration-300 ease-in-out
      hover:scale-105 
      active:scale-95 
      ${customClasses}
    `}
      onClick={onClick}
      disabled={isSubmitting}
    >     
      {isSubmitting ? (
        <span className="flex items-center justify-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          {submittingText}
        </span>
      ) : (
        <div
          className={`flex flex-row items-center justify-center gap-x-2 ${iconSide === "right" && "flex-row-reverse"}`}
        >
          <p className={`font-medium ${textClasses}`}>{label}</p>
        </div>
      )}
    </button>   
  ) 
}  

export default CustomButton