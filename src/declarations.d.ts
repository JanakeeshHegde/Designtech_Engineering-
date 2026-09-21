declare module '*.css' {
  const styles: { [className: string]: string };
  export default styles;
}

/// <reference types="vite/client" />