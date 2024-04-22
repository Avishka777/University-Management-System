import { useSelector } from 'react-redux';

export default function ThemeProvider({ children }) {
  // Retrieve The Current Theme From The Redux Store
  const { theme } = useSelector((state) => state.theme);
  
  // Render The Children Wrapped In The Theme Specific Class
  return (
    <div className={theme}>
      <div className='bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen'>
        {children}
      </div>
    </div>
  );
}

// This Component Serves As A Provider For The Theme Throughout The Application.
// It Retrieves The Current Theme From The Redux Store Using The UseSelector Hook.
// Then, It Applies The Theme-Specific Class To The Outermost Div, Allowing CSS To Style Components Accordingly.
// Inside This Div, It Renders The Children Components, Ensuring That They Inherit The Theme Styles.
