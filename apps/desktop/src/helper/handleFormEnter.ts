export const handleFormEnter = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
          if ((e.target as HTMLElement).tagName === 'TEXTAREA') return;
    
          e.preventDefault();
    
          const form = e.currentTarget;
          const focusableElements = Array.from(form.querySelectorAll<HTMLElement>('input, select, textarea, button:not([type="submit"])')).filter((el) => !el.hasAttribute('disabled'));
    
          const currentIndex = focusableElements.indexOf(e.target as HTMLElement);
    
          //Si existe un siguiente campo, le damos focus
          if (currentIndex !== -1 && currentIndex < focusableElements.length - 1) {
            focusableElements[currentIndex + 1].focus();
            (focusableElements[currentIndex + 1] as HTMLInputElement).select();

          }
        }
}