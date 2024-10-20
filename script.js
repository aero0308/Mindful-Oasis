document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleButton');
    const body = document.body;
  
    // Check if the user already has a saved preference in localStorage
    const savedTheme = localStorage.getItem('theme');
  
    if (savedTheme === 'dark') {
      body.classList.add('dark-mode');
    //   toggleButton.textContent = 'Switch to Light Mode';
    }
  
    toggleButton.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
  
      if (body.classList.contains('dark-mode')) {
        // toggleButton.textContent = 'Switch to Light Mode';
        // Save user's preference
        // localStorage.setItem('theme', 'dark');
      } else {
        // toggleButton.textContent = 'Switch to Night Mode';
        // localStorage.setItem('theme', 'light');
      }
    });
  });
  