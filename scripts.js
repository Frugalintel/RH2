document.addEventListener('DOMContentLoaded', function() {
  // Close deposit card
  const depositCard = document.getElementById('depositCard');
  const closeDepositCard = document.getElementById('closeDepositCard');
  
  if (closeDepositCard && depositCard) {
    closeDepositCard.addEventListener('click', function() {
      depositCard.style.display = 'none';
    });
  }

  // Draw main stock chart
  const stockChartCanvas = document.getElementById('stockChart');
  if (stockChartCanvas) {
    drawStockChart(stockChartCanvas);
  }

  // Draw mini charts
  const miniCharts = document.querySelectorAll('.mini-chart');
  miniCharts.forEach(canvas => {
    const isPositive = canvas.getAttribute('data-is-positive') === 'true';
    drawMiniChart(canvas, isPositive);
  });

  // Time selector
  const timeOptions = document.querySelectorAll('.time-option');
  timeOptions.forEach(option => {
    option.addEventListener('click', function() {
      timeOptions.forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
    });
  });
});

// Function to draw the main stock chart
function drawStockChart(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set canvas dimensions with higher resolution for retina displays
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  // Clear canvas
  ctx.clearRect(0, 0, rect.width, rect.height);

  // Generate some sample data that resembles the chart in the image
  const points = generateChartData(rect.width, rect.height);

  // Draw the chart line
  ctx.beginPath();
  ctx.moveTo(0, points[0]);

  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(i * (rect.width / points.length), points[i]);
  }

  ctx.strokeStyle = "#22c55e"; // Green color
  ctx.lineWidth = 2;
  ctx.stroke();

  // Add the dot at the end
  const lastX = rect.width;
  const lastY = points[points.length - 1];
  ctx.beginPath();
  ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
  ctx.fillStyle = "#22c55e";
  ctx.fill();
}

// Function to draw mini charts for holdings
function drawMiniChart(canvas, isPositive) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set canvas dimensions with higher resolution for retina displays
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  // Clear canvas
  ctx.clearRect(0, 0, rect.width, rect.height);

  // Generate data based on whether the chart should show positive or negative trend
  const data = isPositive 
    ? [10, 11, 9, 12, 11, 13, 12, 14, 13, 15] 
    : [15, 14, 13, 12, 11, 10, 9, 8, 7, 6];

  // Draw the chart line
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue;
  
  const getY = (value) => {
    return rect.height - ((value - minValue) / range) * rect.height * 0.8 - rect.height * 0.1;
  };

  ctx.beginPath();
  ctx.moveTo(0, getY(data[0]));

  for (let i = 1; i < data.length; i++) {
    const x = (i / (data.length - 1)) * rect.width;
    const y = getY(data[i]);
    ctx.lineTo(x, y);
  }

  ctx.strokeStyle = isPositive ? "#22c55e" : "#f97316"; // Green or orange
  ctx.lineWidth = 2;
  ctx.stroke();
}

// Function to generate chart data
function generateChartData(width, height) {
  // This is a simplified version to mimic the chart in the image
  const numPoints = 100;
  const points = [];

  // Start high
  let y = height * 0.4;

  for (let i = 0; i < numPoints; i++) {
    // Add some randomness to create a realistic looking chart
    const randomFactor = Math.random() * 10 - 5;

    // Create a pattern similar to the image
    if (i < numPoints * 0.2) {
      // Initial decline
      y += Math.random() * 2 - 0.5;
    } else if (i < numPoints * 0.4) {
      // Sharp rise
      y -= Math.random() * 3 + 1;
    } else if (i < numPoints * 0.6) {
      // Fluctuation at top
      y += Math.random() * 6 - 3;
    } else if (i < numPoints * 0.8) {
      // Gradual decline
      y += Math.random() * 2;
    } else {
      // Final rise
      y -= Math.random() * 3 + 1;
    }

    // Keep within bounds
    y = Math.max(10, Math.min(height - 10, y + randomFactor));

    points.push(y);
  }

  return points;
}
