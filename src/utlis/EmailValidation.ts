    export const isValidEmail = (email: string) => {
      // Email validation
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      return emailRegex.test(email);
    };