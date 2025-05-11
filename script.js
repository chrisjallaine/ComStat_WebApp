document.addEventListener('DOMContentLoaded', function() {
  // Initialize chart
  const ctx = document.getElementById('probability-chart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Non-Suicidal', 'Suicidal'],
      datasets: [{
        label: 'Probability',
        data: [0, 0],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',  // Medium blue for non-suicidal
          'rgba(239, 68, 68, 0.7)'    // Red for suicidal
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 1,
          ticks: {
            callback: function(value) {
              return (value * 100) + '%';
            }
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return (context.raw * 100).toFixed(1) + '%';
            }
          }
        }
      }
    }
  });

  // Set initial stats data
  updateStatsData();

  // Analyze button click handler
  document.getElementById('analyze-btn').addEventListener('click', function() {
    const tweetText = document.getElementById('tweet-input').value.trim();
    const model = document.getElementById('model-select').value;
    
    if (!tweetText) {
      alert('Please enter a tweet to analyze.');
      return;
    }
    
    // Show loading state
    this.innerHTML = 'Analyzing...';
    this.disabled = true;
    
    // PLACEHOLDER: Here you would call your backend API to analyze the tweet
    // This is where you would integrate with your ML models
    
    analyzeTweet(tweetText, model)
      .then(result => {
        // Display results
        document.getElementById('results-section').classList.remove('hidden');
        
        // Update model name
        const modelNames = {
          'logistic-regression': 'LogReg (SGD)',
          'bayesian-bert': 'LogReg Bayesian w/ BERT'
        };
        document.getElementById('model-badge').textContent = modelNames[model];
        
        // Update classification results
        updateClassificationResults(result);
        
        // Update chart
        chart.data.datasets[0].data = [result.nonSuicidalProb, result.suicidalProb];
        chart.update();
        
        // Update feature importance
        updateFeatureImportance(result.features);
        
        // Add to history table
        addToHistory(tweetText, model, result);