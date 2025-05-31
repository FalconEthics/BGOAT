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
    const gameTile = createGameTile(game);
    categoryContent.append(gameTile);
  });

  categoryColumn.append(categoryContent);

  return categoryColumn;
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

  // Create game tile HTML with video placeholder instead of iframe
  const gameTileHtml = `
    <div class="game-tile">
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