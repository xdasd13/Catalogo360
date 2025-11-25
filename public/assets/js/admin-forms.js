// Dynamic Form Handlers for Admin

// Multi-select handler
class MultiSelect {
  constructor(selectElement) {
    this.select = selectElement;
    this.init();
  }

  init() {
    this.select.addEventListener('change', () => this.updateDisplay());
  }

  getSelected() {
    return Array.from(this.select.selectedOptions).map(opt => opt.value);
  }

  updateDisplay() {
    const selected = this.getSelected();
    console.log('Selected values:', selected);
  }
}

// Initialize all multi-selects
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('select[multiple]').forEach(select => {
    new MultiSelect(select);
  });
});

// Form helper functions
function getFormData(formId) {
  const form = document.getElementById(formId);
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  return data;
}

function resetForm(formId) {
  const form = document.getElementById(formId);
  if (form) form.reset();
}

function toggleFormField(fieldName, shouldShow) {
  const field = document.querySelector(`[name="${fieldName}"]`);
  if (field) {
    const group = field.closest('.form-group');
    if (group) {
      group.style.display = shouldShow ? 'block' : 'none';
    }
  }
}

// Price formatter
function formatPrice(input) {
  let value = input.value.replace(/[^0-9.]/g, '');
  if (value) {
    value = parseFloat(value).toFixed(2);
    input.value = value;
  }
}

// Slug generator from title
function generateSlug(titleInput, slugInput) {
  if (!titleInput || !slugInput) return;
  
  titleInput.addEventListener('blur', () => {
    const title = titleInput.value;
    if (title && !slugInput.value) {
      const slug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      slugInput.value = slug;
    }
  });
}

// Color picker preview
function initColorPicker(inputSelector, previewSelector) {
  const input = document.querySelector(inputSelector);
  const preview = document.querySelector(previewSelector);
  
  if (input && preview) {
    input.addEventListener('change', () => {
      preview.style.backgroundColor = input.value;
    });
  }
}

// Confirm delete action
function confirmDelete(itemName = 'este elemento') {
  return confirm(`¿Estás seguro de que deseas eliminar ${itemName}? Esta acción no se puede deshacer.`);
}

// Image preview
function previewImage(inputSelector, previewSelector) {
  const input = document.querySelector(inputSelector);
  const preview = document.querySelector(previewSelector);
  
  if (input && preview) {
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          preview.src = event.target.result;
          preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

// Export functions for use in HTML
window.getFormData = getFormData;
window.resetForm = resetForm;
window.toggleFormField = toggleFormField;
window.formatPrice = formatPrice;
window.generateSlug = generateSlug;
window.initColorPicker = initColorPicker;
window.confirmDelete = confirmDelete;
window.previewImage = previewImage;
