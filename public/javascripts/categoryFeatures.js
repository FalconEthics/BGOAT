// Function to create a "Create Category" button
function createCreateCategoryButton() {
  const createCategoryButton = $('<div>').addClass('category-column create-category-column');
  const createButton = $('<div>').addClass('create-category-button')
    .css({
      'background': '#282832',
      'border': '2px dashed #4b4b65',
      'border-radius': '10px',
      'height': '80px',
      'display': 'flex',
      'align-items': 'center',
      'justify-content': 'center',
      'cursor': 'pointer',
      'margin-bottom': '0.5rem',
      'transition': 'all 0.2s ease'
    })
    .html('<div style="font-size: 2rem; color: #ffeba7; margin-right: 10px;">+</div><div style="font-size: 1.2rem; font-weight: 600; color: #ffeba7;">CREATE NEW CATEGORY</div>');

  createButton.hover(
    function () {
      $(this).css({
        'background': '#303040',
        'border-color': '#ffeba7',
        'transform': 'translateY(-2px)'
      });
    },
    function () {
      $(this).css({
        'background': '#282832',
        'border-color': '#4b4b65',
        'transform': 'none'
      });
    }
  );

  createCategoryButton.append(createButton);

  // Add click event for the Create Category button
  createButton.on('click', function () {
    // Clear previous values
    $('#categoryName').val('');
    // Show the modal
    $('#createCategoryModal').modal('show');
  });

  return createCategoryButton;
}

// Function to handle creating a new category
async function createNewCategory(categoryName) {
  if (!categoryName || categoryName.trim() === '') {
    showErrorMessage('Category name cannot be empty');
    return;
  }

  try {
    console.log('Sending category creation request with name:', categoryName);

    const response = await fetch('/api/games/categories/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name: categoryName.trim()})
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Server error response:', responseData);
      throw new Error(responseData.message || 'Failed to create category');
    }

    // Show success message and reload games
    showSuccessMessage('Category created successfully!');
    $('#createCategoryModal').modal('hide');

    // Reload the categories
    fetchGameData();
  } catch (error) {
    console.error('Error creating category:', error);
    showErrorMessage(error.message || 'Failed to create category. Please try again.');
  }
}

// Add this to the document ready section
$(document).ready(function () {
  // Handle save category button clicks
  $('#saveCategoryBtn').on('click', async function () {
    const categoryName = $('#categoryName').val();
    await createNewCategory(categoryName);
  });

  // Use Enter key to submit the category form
  $('#categoryName').on('keypress', function (e) {
    if (e.which === 13) { // Enter key
      e.preventDefault();
      const categoryName = $('#categoryName').val();
      createNewCategory(categoryName);
    }
  });
});