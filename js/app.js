// Stage data generated with AI
let stageData = {};


// Country select bar
const countrySelect = document.getElementById("countrySelect");

// Table under select bar
const tableBody = document.getElementById("stageTableBody");

// Stage select bar (only available when country is selected)
const stageSelect = document.getElementById("stageSelect");

// Modal stage select (uses same stages as country selected)
const resultStage = document.getElementById("resultStage");

//Fetch function to load stage data from .json file
function loadStageData() {
  fetch("/data/stages.json")
    .then(handleFetchResponse)
    .then(handleDataLoaded)
    .catch(handleFetchError);
}

// Handles fetch response regardless of error or no error - throws error for error handler later
function handleFetchResponse(response) {
  if (!response.ok) {
    throw new Error("Failed to load stage data: " + response.status);
  }
  return response.json();
}

//Fetched data loaded into current js file
function handleDataLoaded(data) {
  stageData = data;
}

// Handles thrown error in an easy way for user to see
function handleFetchError(error) {
  console.error("Error loading stage data:", error);
  tableBody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Failed to load stage data</td></tr>';
}


// Listens for new select option
countrySelect.addEventListener("change", () => {
  const country = countrySelect.value;
  const stages = stageData[country] || [];

  // Clear existing rows
  tableBody.innerHTML = "";
  stageSelect.innerHTML = '<option selected disabled>Choose a stage</option>';
  resultStage.innerHTML = '<option selected disabled>Choose a stage</option>';

  // Aesthetic placeholder for no user data
  if (stages.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No data available</td></tr>`;
    stageSelect.disabled = true;
    return;
  }

  stageSelect.disabled = false;
  resultStage.disabled = false;

  // Adds new row to table for each record for different countries
  for (let i = 0; i < stages.length; i++) {
    addStageRow(stages[i]);
    addStageOption(stageSelect, stages[i]);
    addStageOption(resultStage, stages[i]);
  }

});

// Takes stage object and creates a table row to be appended (used in event listener)
function addStageRow(stage) {
    const row = document.createElement("tr");
    row.innerHTML = 
        "<td>" + stage.stage + "</td>" +
        "<td>" + stage.time + "</td>" +
        "<td>" + stage.conditions + "</td>" +
        "<td>" + (stage.pb ? "⭐" : "") + "</td>";
    tableBody.appendChild(row);
}

function addStageOption(selectElement, stage) {
    const option = document.createElement("option");
    option.value = stage.stage;
    option.textContent = stage.stage;
    selectElement.appendChild(option);
}

// Runs fetch function for .json data
loadStageData();