// Admin Sidebar Toggle
function toggleSidebar() {
  const sidebar = document.querySelector('.admin-sidebar');
  sidebar.classList.toggle('active');
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
  const sidebar = document.querySelector('.admin-sidebar');
  const toggleBtn = document.querySelector('.sidebar-toggle');
  
  if (sidebar && toggleBtn && !sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
    sidebar.classList.remove('active');
  }
});

// Active link in sidebar
function setActiveSidebarLink() {
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll('.sidebar-link');
  
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || currentPath.includes(href.split('/')[2])) {
      link.classList.add('active');
      link.closest('.sidebar-section')?.previousElementSibling?.scrollIntoView();
    } else {
      link.classList.remove('active');
    }
  });
}

// Initialize active link on page load
document.addEventListener('DOMContentLoaded', setActiveSidebarLink);

// Flash messages auto-dismiss
function initFlashMessages() {
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach(alert => {
    setTimeout(() => {
      alert.style.animation = 'slideOut 300ms ease';
      setTimeout(() => alert.remove(), 300);
    }, 5000);
  });
}

document.addEventListener('DOMContentLoaded', initFlashMessages);

// Form validation
function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return true;
  
  const inputs = form.querySelectorAll('[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.style.borderColor = '#ef4444';
      isValid = false;
    } else {
      input.style.borderColor = '';
    }
  });
  
  return isValid;
}

// Export for use in HTML
window.validateForm = validateForm;
window.toggleSidebar = toggleSidebar;
