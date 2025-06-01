// Show intro modal on page load
$(document).ready(function () {
  $('#introModal').modal('show');

  // Fetch game data and render categories
  fetchGameData();

  // Handle reset button click - show confirmation modal
  $('#resetBtn').on('click', function () {
    $('#resetConfirmModal').modal('show');
  });

  // Handle confirm reset button click
  $('#confirmResetBtn').on('click', function () {
    resetGameCollection();
  });

  // Logout
  $('#logoutBtn').on('click', function () {
    fetch('/api/logout', {method: 'POST'})
      .then(() => window.location.href = '/');
  });

  // Delegate click event for category headers
  $(document).on('click', '.category-header', function () {
    const categoryHeader = $(this);
    const categoryContent = categoryHeader.siblings('.category-content');
    const isExpanding = categoryHeader.hasClass('collapsed');

    // Toggle collapsed classes
    categoryHeader.toggleClass('collapsed');
    categoryContent.toggleClass('collapsed');

    // Load videos if expanding
    if (isExpanding) {
      loadVideosInCategory(categoryContent);
    }
  });

  // Handle played button clicks
  $(document).on('click', '.played-btn', async function () {
    const button = $(this);
    const categoryId = button.data('category-id');
    const gameId = button.data('game-id');

    console.log('Toggle played clicked with:', {categoryId, gameId});

    if (!categoryId || !gameId) {
      showErrorMessage('Could not identify game. Please refresh the page and try again.');
      return;
    }

    try {
      button.prop('disabled', true); // Disable button during request

      const apiUrl = `/api/games/${categoryId}/${gameId}/toggle-played`;
      console.log('Calling API endpoint:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', response.status, errorText);
        throw new Error(`Failed to update game status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API success response:', data);

      // Update UI based on new played status
      if (data.played) {
        button.text('Played ✓');
        button.addClass('played');
        button.closest('.game-tile').addClass('game-played');
      } else {
        button.text('Mark as Played');
        button.removeClass('played');
        button.closest('.game-tile').removeClass('game-played');
      }

      // Show success message
      showSuccessMessage(data.message);

    } catch (error) {
      console.error('Error toggling played status:', error);
      showErrorMessage('Failed to update game status. Please try again.');
    } finally {
      button.prop('disabled', false); // Re-enable button
    }
  });

  // Handle delete button clicks
  $(document).on('click', '.delete-btn', function () {
    const button = $(this);
    const categoryId = button.data('category-id');
    const gameId = button.data('game-id');
    const gameName = button.closest('.game-tile').find('.game-title').text();

    if (!categoryId || !gameId) {
      showErrorMessage('Could not identify game. Please refresh the page and try again.');
      return;
    }

    // Show confirmation dialog
    if (confirm(`Are you sure you want to delete "${gameName}" from your collection? This action cannot be undone.`)) {
      deleteGame(categoryId, gameId, button);
    }
  });

  // Handle add game button clicks
  $(document).on('click', '.add-game-tile', function () {
    const categoryId = $(this).data('category-id');
    $('#addGameCategoryId').val(categoryId);
    $('#addGameForm')[0].reset();

    // Reset buy options to just one
    $('#buyOptionsContainer .buy-option:not(:first)').remove();
    $('#buyOptionsContainer .buy-option:first .remove-buy-option').hide();

    // Show the modal
    $('#addGameModal').modal('show');
  });

  // Add new buy option field
  $('#addBuyOption').on('click', function () {
    const newBuyOption = `
      <div class="buy-option">
        <div class="row">
          <div class="col">
            <input type="text" class="form-style" name="buyFor[]" placeholder="Platform (e.g., PC)" required>
          </div>
          <div class="col">
            <input type="url" class="form-style" name="buyLink[]" placeholder="Purchase URL" required>
          </div>
          <div class="col-auto">
            <button type="button" class="btn remove-buy-option">Remove</button>
          </div>
        </div>
      </div>
    `;

    $('#buyOptionsContainer').append(newBuyOption);

    // Show remove button for the first option if we have more than one
    if ($('#buyOptionsContainer .buy-option').length > 1) {
      $('#buyOptionsContainer .buy-option:first .remove-buy-option').show();
    }
  });

  // Remove buy option
  $(document).on('click', '.remove-buy-option', function () {
    $(this).closest('.buy-option').remove();

    // Hide the remove button if only one option remains
    if ($('#buyOptionsContainer .buy-option').length === 1) {
      $('#buyOptionsContainer .buy-option:first .remove-buy-option').hide();
    }
  });

  // Save new game
  $('#saveGameBtn').on('click', async function () {
    // Basic form validation
    const form = $('#addGameForm')[0];
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const categoryId = $('#addGameCategoryId').val();
    const name = $('#gameName').val();
    const rating = parseFloat($('#gameRating').val());
    const desc = $('#gameDesc').val();
    const trailer = $('#gameTrailer').val();

    // Collect buy options
    const buy = [];
    const buyForInputs = $('input[name="buyFor[]"]');
    const buyLinkInputs = $('input[name="buyLink[]"]');

    for (let i = 0; i < buyForInputs.length; i++) {
      buy.push({
        for: buyForInputs[i].value,
        link: buyLinkInputs[i].value
      });
    }

    try {
      const response = await fetch(`/api/games/${categoryId}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name, rating, desc, trailer, buy})
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add game');
      }

      // Show success message and reload games
      showSuccessMessage('Game added successfully!');
      $('#addGameModal').modal('hide');

      // Reload the category content
      fetchGameData();
    } catch (error) {
      console.error('Error adding game:', error);
      showErrorMessage(error.message || 'Failed to add game. Please try again.');
    }
  });
});

// Load videos for all placeholders in a category
function loadVideosInCategory(categoryContent) {
  categoryContent.find('.video-placeholder').each(function () {
    const placeholder = $(this);
    const videoUrl = placeholder.data('video-url');

    // Create iframe and replace placeholder
    const iframe = $('<iframe>')
      .attr('src', videoUrl)
      .attr('frameborder', '0')
      .attr('allowfullscreen', 'true');

    placeholder.replaceWith(iframe);
  });
}

// Show error message
function showErrorMessage(message) {
  const errorMessage = $('<div>')
    .addClass('alert alert-danger')
    .attr('role', 'alert')
    .css({
      'position': 'fixed',
      'top': '100px',
      'left': '50%',
      'transform': 'translateX(-50%)',
      'z-index': '9999',
      'padding': '15px 30px',
      'border-radius': '5px',
      'box-shadow': '0 4px 12px rgba(0,0,0,0.15)'
    })
    .text(message);

  $('body').append(errorMessage);

  // Remove after 3 seconds
  setTimeout(() => {
    errorMessage.fadeOut(500, function () {
      $(this).remove();
    });
  }, 3000);
}

// Show success message
function showSuccessMessage(message) {
  const successMessage = $('<div>')
    .addClass('alert alert-success')
    .attr('role', 'alert')
    .css({
      'position': 'fixed',
      'top': '100px',
      'left': '50%',
      'transform': 'translateX(-50%)',
      'z-index': '9999',
      'padding': '15px 30px',
      'border-radius': '5px',
      'box-shadow': '0 4px 12px rgba(0,0,0,0.15)'
    })
    .text(message);

  $('body').append(successMessage);

  // Remove after 3 seconds
  setTimeout(() => {
    successMessage.fadeOut(500, function () {
      $(this).remove();
    });
  }, 3000);
}

// Reset game collection
async function resetGameCollection() {
  try {
    const response = await fetch('/api/reset-games', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to reset game collection');
    }

    // Hide the modal
    $('#resetConfirmModal').modal('hide');

    // Show a success message
    const successMessage = $('<div>')
      .addClass('alert alert-success')
      .attr('role', 'alert')
      .css({
        'position': 'fixed',
        'top': '100px',
        'left': '50%',
        'transform': 'translateX(-50%)',
        'z-index': '9999',
        'padding': '15px 30px',
        'border-radius': '5px',
        'box-shadow': '0 4px 12px rgba(0,0,0,0.15)'
      })
      .text('Game collection reset successfully!');

    $('body').append(successMessage);

    // Refresh the game data
    fetchGameData();

    // Remove the success message after 3 seconds
    setTimeout(() => {
      successMessage.fadeOut(500, function () {
        $(this).remove();
      });
    }, 3000);

  } catch (error) {
    console.error('Error resetting game collection:', error);

    // Hide the modal
    $('#resetConfirmModal').modal('hide');

    // Show error message
    showErrorMessage('Failed to reset game collection. Please try again later.');
  }
}

// Fetch game data from API
async function fetchGameData() {
  try {
    const response = await fetch('/api/games');
    if (!response.ok) {
      throw new Error('Failed to fetch games');
    }

    const gameData = await response.json();
    renderCategories(gameData.categories);
  } catch (error) {
    console.error('Error fetching games:', error);
    showErrorMessage('Could not load your games. Please try refreshing the page.');
  }
}

// Render all game categories
function renderCategories(categories) {
  const categoriesContainer = $('.categories-grid');
  categoriesContainer.empty(); // Clear existing content

  categories.forEach(category => {
    const categoryColumn = createCategoryColumn(category);
    categoriesContainer.append(categoryColumn);
  });
}

// Create a category column with games
function createCategoryColumn(category) {
  const categoryColumn = $('<div>').addClass('category-column');

  // Create category header with collapse state
  const categoryHeader = $('<div>')
    .addClass('category-header collapsed')
    .text(category.name.replace(/-/g, ' ').toUpperCase());

  categoryColumn.append(categoryHeader);

  // Create category content (game tiles container)
  const categoryContent = $('<div>').addClass('category-content collapsed');

  // Add all games in this category
  category.games.forEach(game => {
    // Add category ID to each game object
    game.parentCategoryId = category._id;
    const gameTile = createGameTile(game);
    categoryContent.append(gameTile);
  });

  // Add 'Add Game' tile at the end of each category
  const addGameTile = createAddGameTile(category._id);
  categoryContent.append(addGameTile);

  categoryColumn.append(categoryContent);

  return categoryColumn;
}

// Create the 'Add Game' tile
function createAddGameTile(categoryId) {
  return $(`
    <div class="add-game-tile" data-category-id="${categoryId}">
      <div class="add-game-icon">+</div>
      <div class="add-game-text">ADD MORE GAME</div>
    </div>
  `);
}

// Extract YouTube video ID from URL
function getYouTubeVideoId(url) {
  if (!url) return null;

  // Handle youtube.com/embed/VIDEO_ID format
  const embedMatch = url.match(/\/embed\/([^/?]+)/);
  if (embedMatch) return embedMatch[1];

  // Handle youtube.com/watch?v=VIDEO_ID format
  const urlObj = new URL(url);
  if (urlObj.hostname.includes('youtube.com')) {
    return urlObj.searchParams.get('v');
  }

  // Handle youtu.be/VIDEO_ID format
  if (urlObj.hostname === 'youtu.be') {
    return urlObj.pathname.slice(1);
  }

  return null;
}

// Create a game tile with details
function createGameTile(game) {
  // Calculate star rating display
  const fullStars = Math.floor(game.rating / 2);
  const halfStar = game.rating % 2 >= 1;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  // Create star rating HTML
  let starsHtml = '';
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<span class="star">&#9733;</span>'; // Full star
  }
  if (halfStar) {
    starsHtml += '<span class="star">&#9733;</span>'; // We'll use full star for simplicity
  }
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<span class="star">&#9734;</span>'; // Empty star
  }

  // Create buy buttons
  const buyButtonsHtml = game.buy.map(option =>
    `<a href="${option.link}" target="_blank" class="buy-btn">${option.for}</a>`
  ).join('');

  // Get YouTube video ID and thumbnail
  const videoId = getYouTubeVideoId(game.trailer);
  const thumbnailUrl = videoId ?
    `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` :
    '/images/video-placeholder.jpg';

  // Create played button
  const playedButtonText = game.played ? 'Played ✓' : 'Mark as Played';
  const playedButtonClass = game.played ? 'played-btn played' : 'played-btn';

  // Create game tile HTML with video placeholder instead of iframe
  const gameTileHtml = `
    <div class="game-tile ${game.played ? 'game-played' : ''}">
      <div class="game-tile-content">
        <div class="game-info">
          <div class="game-title">${game.name}</div>
          <div class="game-intro">${game.desc.substring(0, 120)}${game.desc.length > 120 ? '...' : ''}</div>
          <div class="game-rating">
            ${starsHtml}
            <span class="rating-value">${game.rating}/10</span>
          </div>
          <div class="game-actions">
            ${buyButtonsHtml}
            <button class="${playedButtonClass}" data-category-id="${game.parentCategoryId || ''}" data-game-id="${game._id}">${playedButtonText}</button>
            <button class="delete-btn" data-category-id="${game.parentCategoryId || ''}" data-game-id="${game._id}">Delete</button>
          </div>
        </div>
        <div class="game-trailer">
          <div class="video-placeholder" data-video-url="${game.trailer}">
            <img src="${thumbnailUrl}" alt="${game.name} trailer">
            <div class="play-icon">▶</div>
          </div>
        </div>
      </div>
    </div>
  `;

  return $(gameTileHtml);
}

// Delete game function
async function deleteGame(categoryId, gameId, buttonElement) {
  try {
    buttonElement.prop('disabled', true); // Disable button during request

    console.log('Delete request with IDs:', categoryId, gameId);
    const apiUrl = `/api/games/${categoryId}/${gameId}`;
    console.log('Calling delete API endpoint:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', response.status, errorText);
      throw new Error(`Failed to delete game: ${response.status}`);
    }

    const data = await response.json();
    console.log('API success response:', data);

    // Remove game tile from UI
    buttonElement.closest('.game-tile').fadeOut(300, function () {
      $(this).remove();
    });

    // Show success message
    showSuccessMessage(data.message);

  } catch (error) {
    console.error('Error deleting game:', error);
    showErrorMessage('Failed to delete game. Please try again.');
    buttonElement.prop('disabled', false); // Re-enable button in case of error
  }
}